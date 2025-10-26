function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', c => chunks.push(Buffer.from(c)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

module.exports = {
  init(opts = {}) {
    const {
      repo, token, branch = 'main',
      basePath = 'uploads',
      publicBaseUrl,              // e.g. https://raw.githubusercontent.com/owner/repo/main
      commitUsername = 'strapi-bot',
      commitEmail = 'strapi-bot@local',
      maxRetries = 5,             // retry 409 races
      retryDelayMs = 120
    } = opts;

    if (!repo || !token || !publicBaseUrl) {
      throw new Error('Upload GitHub provider: missing required options (repo, token, publicBaseUrl).');
    }

    const [owner, name] = repo.split('/');
    const API = `https://api.github.com/repos/${owner}/${name}/contents`;
    const UA = 'strapi-upload-github';

    async function gh(method, path, body) {
      const res = await fetch(`${API}/${encodeURI(path)}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': UA,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const text = await res.text().catch(() => '');
      if (!res.ok) {
        const err = new Error(`GitHub ${method} ${path} failed: ${res.status} ${text}`);
        err.status = res.status;
        err.body = text;
        throw err;
      }
      return text ? JSON.parse(text) : {};
    }

    function publicUrl(pathInRepo) {
      return `${publicBaseUrl.replace(/\/$/, '')}/${pathInRepo}`;
    }

    // Safer path: nest by year/month to avoid hot-spot collisions
    function buildPath(file) {
      // Strapi supplies file.hash (unique per variant) and file.ext
      const d = new Date();
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const folder = basePath ? `${basePath}/${y}/${m}` : `${y}/${m}`;
      const filename = `${file.hash}${file.ext || ''}`;
      return `${folder}/${filename}`;
    }

    async function getSha(path) {
      const res = await fetch(`${API}/${encodeURI(path)}?ref=${branch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': UA,
        },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json?.sha || null;
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function putUpsert(path, buffer, message) {
      const content = buffer.toString('base64');
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const sha = await getSha(path); // null if new; non-null if updating
        try {
          const out = await gh('PUT', path, {
            message: message || `Upload ${path}`,
            content,
            branch,
            sha: sha || undefined,
            committer: { name: commitUsername, email: commitEmail },
          });
          return out;
        } catch (e) {
          if (e.status === 409 && attempt < maxRetries - 1) {
            // Another writer won the race; backoff and retry with fresh sha
            await sleep(retryDelayMs * (attempt + 1));
            continue;
          }
          throw e;
        }
      }
      throw new Error(`Failed to upsert ${path} after ${maxRetries} attempts`);
    }

    return {
      async upload(file) {
        const buffer = file.buffer || (file.stream ? await streamToBuffer(file.stream) : null);
        if (!buffer) throw new Error('No file buffer/stream provided');

        const path = buildPath(file);
        const out = await putUpsert(path, buffer, `Upload ${file.name || path}`);

        // hand back the public URL + metadata so Strapi persists it
        file.url = publicUrl(path);
        file.provider_metadata = { path, sha: out?.content?.sha || null };
      },

      async uploadStream(file) {
        return this.upload(file);
      },

      async delete(file) {
        const path = file?.provider_metadata?.path || buildPath(file);
        let sha = file?.provider_metadata?.sha || (await getSha(path));
        if (!sha) return; // already gone
        await gh('DELETE', path, {
          message: `Delete ${path}`,
          sha,
          branch,
          committer: { name: commitUsername, email: commitEmail },
        });
      },
    };
  },
};
