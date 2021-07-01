import { loadSettingsAsync, once } from '@create-figma-plugin/utilities';
import { showUI } from '@create-figma-plugin/utilities';
import faker from 'faker';
import { PluginProps, TableSpec } from './types';

const robotoRegular: FontName = { family: 'Roboto', style: 'Regular' };
const robotoBold: FontName = { family: 'Roboto', style: 'Bold' };

export const defaultSpec: TableSpec = {
  cols: 5,
  rows: 5,
  gridLines: false,
  padding: 16,
  spacing: 16,
  font: {
    fontName: {
      family: 'Roboto',
      style: 'Regular',
    },
  },
};

export default async function () {
  const options = { width: 240, height: 420 };

  const [fonts, settings] = await Promise.all([
    figma.listAvailableFontsAsync(),
    loadSettingsAsync(defaultSpec),
  ]);

  const data: PluginProps = {
    fonts,
    spec: (settings as TableSpec) || defaultSpec,
  };

  debugger;

  showUI<PluginProps>(options, data);

  await figma.loadFontAsync(robotoRegular);
  await figma.loadFontAsync(robotoBold);

  once('create', async (spec: TableSpec) => {
    const { cols, rows, gridLines, padding, spacing, font } = spec;
    const target = figma.currentPage.selection.find(n => n.type === 'FRAME');

    // Only support adding to empty frames.
    if (target && target.type === 'FRAME' && target.children.length === 0) {
      target.layoutMode = 'VERTICAL';
      target.itemSpacing = gridLines ? spacing / 2 : spacing;
      target.counterAxisSizingMode = 'FIXED';
      target.primaryAxisSizingMode = 'AUTO';

      target.paddingTop = padding;
      target.paddingLeft = padding;
      target.paddingBottom = padding;
      target.paddingRight = padding;

      for (let r = 0; r < rows; r++) {
        if (r !== 0 && gridLines) {
          const line = figma.createLine();
          line.layoutAlign = 'STRETCH';
          line.opacity = 0.25;
          target.appendChild(line);
        }

        const row = figma.createFrame();
        target.appendChild(row);

        row.layoutMode = 'HORIZONTAL';
        row.layoutAlign = 'STRETCH';
        row.itemSpacing = spacing;
        row.primaryAxisSizingMode = 'FIXED';
        row.counterAxisSizingMode = 'AUTO';

        for (let c = 0; c < cols; c++) {
          const cell = figma.createText();
          row.appendChild(cell);

          // Header?
          cell.fontName = r === 0 ? robotoBold : robotoRegular;
          cell.layoutGrow = 1;
          cell.characters = faker.random.word();
        }
      }

      const nodes = [target];

      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
    } else {
      figma.closePlugin('Please select an empty frame node.');
    }

    figma.closePlugin();
  });

  once('cancel', () => {
    figma.closePlugin();
  });
}
