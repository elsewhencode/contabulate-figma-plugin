/** @jsx h */

import { h } from 'preact';
import { defaultSpec } from './main';
import { Plugin } from './ui';

export default {
  title: 'Plugin',
};

export const Default = () => (
  <Plugin
    spec={defaultSpec}
    fonts={[
      {
        fontName: { family: 'Helvetica', style: 'Regular' },
      },
      { fontName: { family: 'Helvetica', style: 'Bold' } },
      {
        fontName: {
          family: 'Roboto',
          style: 'Regular',
        },
      },
      {
        fontName: {
          family: 'Roboto',
          style: 'Medium',
        },
      },
    ]}
  />
);
