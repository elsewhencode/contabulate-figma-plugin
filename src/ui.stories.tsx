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
        fontName: {
          family: 'Roboto',
          style: 'Medium',
        },
      },
    ]}
  />
);
