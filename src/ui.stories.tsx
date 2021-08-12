/** @jsx h */

import { h } from 'preact';
import { defaultSpec } from './main';
import { Plugin, SIZE } from './ui';

export default {
  title: 'Plugin',
};

export const Default = () => (
  <div style={{ height: `${SIZE.height}px` }}>
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
  </div>
);
