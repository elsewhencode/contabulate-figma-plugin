import { loadSettingsAsync, once, setRelaunchButton } from '@create-figma-plugin/utilities';
import { showUI } from '@create-figma-plugin/utilities';
import faker from 'faker';
import { PluginProps, TableSpec } from './types';

const robotoRegular: FontName = { family: 'Roboto', style: 'Regular' };

export const defaultSpec: TableSpec = {
  cols: 5,
  rows: 5,
  gridLines: false,
  padding: 16,
  spacing: 16,
  font: robotoRegular,
};

const errorMessage = 'Please select an empty frame node or an existing table.';

export default async function () {
  const options = { width: 240, height: 420 };

  const [fonts, settings] = await Promise.all([
    figma.listAvailableFontsAsync(),
    loadSettingsAsync(defaultSpec),
  ]);

  const target = figma.currentPage.selection.find(n => n.type === 'FRAME');

  let spec: TableSpec = (settings as TableSpec) || defaultSpec;

  if (!target || target.type !== 'FRAME') {
    figma.closePlugin(errorMessage);
    return;
  } else if (target.children.length > 0) {
    const targetSpecJson = target.getPluginData('contabulate:spec');

    if (targetSpecJson) {
      spec = JSON.parse(targetSpecJson);
    } else {
      figma.closePlugin(errorMessage);
      return;
    }
  }

  const data: PluginProps = {
    fonts,
    spec,
  };

  showUI<PluginProps>(options, data);

  once('create', async (spec: TableSpec) => {
    const { cols, rows, gridLines, padding, spacing, font } = spec;

    target.children.forEach(child => child.remove());

    await figma.loadFontAsync(font);

    let bold = fonts
      .filter(f => f.fontName.family === font.family)
      .find(f => f.fontName.style === 'Bold')?.fontName;

    if (bold) {
      await figma.loadFontAsync(bold);
    } else {
      bold = font;
    }

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
          cell.fontName = r === 0 ? bold : font;
          cell.layoutGrow = 1;
          cell.characters = faker.random.word();
        }
      }

      target.setPluginData('contabulate:spec', JSON.stringify(spec));

      const nodes = [target];

      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
    } else {
      figma.closePlugin('Please select an empty frame node.');
    }

    setRelaunchButton(target, 'edit');

    figma.closePlugin();
  });

  once('cancel', () => {
    figma.closePlugin();
  });
}
