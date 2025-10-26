import type { Schema, Attribute } from '@strapi/strapi';

export interface BlocksSection extends Schema.Component {
  collectionName: 'components_blocks_section';
  info: {
    displayName: 'Section';
    icon: 'align-justify';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    subtitle: Attribute.String;
    content: Attribute.Text;
    illustration: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    markdown: Attribute.RichText;
  };
}

export interface BlocksSectionWithImage extends Schema.Component {
  collectionName: 'components_blocks_section_with_images';
  info: {
    displayName: 'section with image';
  };
  attributes: {
    Title: Attribute.String;
    Content: Attribute.Text;
    Illustration: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'blocks.section': BlocksSection;
      'blocks.section-with-image': BlocksSectionWithImage;
    }
  }
}
