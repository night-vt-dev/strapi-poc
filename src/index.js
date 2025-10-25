module.exports = {
  register() {},
  bootstrap({ strapi }) {

    const uids = Object.keys(strapi.contentTypes || {});
    strapi.log.info('Loaded CT UIDs: ' + uids.join(', '));

    const services = Object.keys(strapi.services || {});
    strapi.log.info('Loaded Service UIDs: ' + services.join(', '));
    const ping = async (model, event) => {
      try {
        const url = process.env.REVALIDATE_URL;
        const secret = process.env.REVALIDATE_SECRET;
        if (!url || !secret) return;
        await fetch(url + `?secret=${secret}`, { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ model, event }) });
      } catch (e) { strapi.log.warn('Revalidate ping failed: ' + e.message); }
    };
    strapi.db.lifecycles.subscribe({
      models: ['api::page.page','api::post.post'],
      async afterUpdate(event){ if (event.params?.data?.publishedAt) await ping(event.model.uid, 'publish'); },
      async afterCreate(event){ await ping(event.model.uid, 'create'); }
    });
  },
};
