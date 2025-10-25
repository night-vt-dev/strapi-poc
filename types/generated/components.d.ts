import type { Schema, Attribute } from '@strapi/strapi';

export interface BlocksSection extends Schema.Component {
  collectionName: 'components_blocks_section';
  info: {
    displayName: 'Section';
    icon: 'align-justify';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    subtitle: Attribute.String;
    content: Attribute.Text;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'blocks.section': BlocksSection;
    }
  }
}
