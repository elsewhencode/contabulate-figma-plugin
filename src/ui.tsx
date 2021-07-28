// src/ui.tsx

/** @jsx h */
import {
  render,
  Container,
  Text,
  VerticalSpace,
  Button,
  TextboxNumeric,
  useForm,
  Columns,
  Dropdown,
  Checkbox,
  useInitialFocus,
  DropdownOption,
  DropdownOptionValue,
  TextboxColor,
} from '@create-figma-plugin/ui';
import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import {
  convertHexColorToRgbColor,
  convertRgbColorToHexColor,
  emit,
} from '@create-figma-plugin/utilities';
import { PluginProps, TableSpec } from './types';
import styles from './ui.css';

interface FormState {
  cols: string;
  rows: string;
  padding: string;
  spacing: string;
  fontFamily: string;
  fontStyle: string;
  gridLines: boolean;
  gridLineColor: string;
  gridLineOpacity: string;
}

export function Plugin({ spec, fonts }: PluginProps) {
  const [fontFamilies, fontMap] = useMemo(() => {
    const map = new Map<string, DropdownOptionValue<string>[]>();

    fonts.forEach(({ fontName: { family, style } }) => {
      if (!map.has(family)) {
        map.set(family, [{ value: style }]);
      } else {
        map.get(family)?.push({ value: style });
      }
    });

    return [Array.from(map.keys()).map(value => ({ value })), map];
  }, [fonts]);

  const { formState, setFormState, handleSubmit, disabled } = useForm<FormState>(
    {
      cols: `${spec.colCount}`,
      rows: `${spec.rows}`,
      padding: `${spec.padding}`,
      spacing: `${spec.spacing}`,
      gridLines: spec.styles.gridLines,
      gridLineColor: spec.styles.gridLineColor
        ? convertRgbColorToHexColor(spec.styles.gridLineColor) || '#000000'
        : '#000000',
      gridLineOpacity: `${(spec.styles.gridLineOpacity || 0.25) * 100}`,
      fontFamily: spec.font.family,
      fontStyle: spec.font.style,
    },
    {
      close() {
        emit('cancel');
      },

      submit(state) {
        if (!disabled) {
          const newSpec: TableSpec = {
            colCount: parseInt(state.cols, 10),
            rows: parseInt(state.rows, 10),
            padding: parseInt(state.padding, 10),
            spacing: parseInt(state.spacing, 10),
            styles: {
              gridLines: !!state.gridLines,
              gridLineColor: state.gridLineColor
                ? convertHexColorToRgbColor(state.gridLineColor)
                : null,
              gridLineOpacity: Number.parseInt(state.gridLineOpacity, 10) / 100,
            },
            font: {
              family: state.fontFamily,
              style: state.fontStyle,
            },
          };

          emit('create', newSpec);
        }
      },
      transform(state) {
        return {
          ...state,
        };
      },
    }
  );

  const [fontStyles, setFontStyles] = useState<DropdownOption<string>[]>(
    fontMap.get(spec.font.family) || []
  );

  console.dir(formState);

  return (
    <div className={styles.uiWrap}>
      <Container space="medium">
        <VerticalSpace space="medium" />

        <Columns space="medium">
          <div>
            <Text numeric muted>
              Columns
            </Text>
            <VerticalSpace space="small" />
            <TextboxNumeric
              name="cols"
              value={formState.cols}
              onValueInput={setFormState}
              {...useInitialFocus()}
            />
          </div>

          <div>
            <Text numeric muted>
              Rows
            </Text>
            <VerticalSpace space="small" />
            <TextboxNumeric name="rows" value={formState.rows} onValueInput={setFormState} />
          </div>
        </Columns>

        <VerticalSpace space="large" />

        <Columns space="medium">
          <div>
            <Text muted>Padding</Text>
            <VerticalSpace space="small" />
            <TextboxNumeric name="padding" value={formState.padding} onValueInput={setFormState} />
          </div>

          <div>
            <Text muted>Spacing</Text>
            <VerticalSpace space="small" />
            <TextboxNumeric name="spacing" value={formState.spacing} onValueInput={setFormState} />
          </div>
        </Columns>

        <VerticalSpace space="large" />

        <Text bold>Grid Lines</Text>

        <VerticalSpace space="small" />

        <Columns space="medium">
          <div>
            <VerticalSpace space="extraSmall" />
            <Checkbox name="gridLines" value={formState.gridLines} onValueChange={setFormState}>
              <Text>Enabled</Text>
            </Checkbox>
          </div>

          <div>
            <TextboxColor
              disabled={!formState.gridLines}
              hexColor={formState.gridLineColor}
              hexColorPlaceholder="Color"
              hexColorName="gridLineColor"
              onHexColorValueInput={setFormState}
              opacityName="gridLineOpacity"
              opacity={formState.gridLineOpacity}
              onOpacityValueInput={setFormState}
              opacityPlaceholder="%"
            />
          </div>
        </Columns>

        <VerticalSpace space="large" />

        <div>
          <Text muted>Font Family</Text>
          <VerticalSpace space="small" />

          <div class={styles.dropdownContainer}>
            <Dropdown
              name="fontFamily"
              onValueChange={family => {
                const styles = fontMap.get(family)!;

                if (!styles.find(s => s.value === formState.fontStyle)) {
                  setFontStyles(styles);
                  setFormState(styles[0].value, 'fontStyle');
                }

                setFormState(family, 'fontFamily');
              }}
              options={fontFamilies}
              value={formState.fontFamily}
            >
              <div class={styles.dropdownValue}>
                <Text>{formState.fontFamily || ' '}</Text>
              </div>
            </Dropdown>
          </div>
        </div>

        <VerticalSpace space="large" />

        <div>
          <Text muted>Font Style</Text>
          <VerticalSpace space="small" />

          <div class={styles.dropdownContainer}>
            <Dropdown
              name="fontStyle"
              onValueChange={setFormState}
              options={fontStyles}
              value={formState.fontStyle}
            >
              <div class={styles.dropdownValue}>
                <Text>{formState.fontStyle || ' '}</Text>
              </div>
            </Dropdown>
          </div>
        </div>

        <VerticalSpace space="large" />

        <Button fullWidth onClick={handleSubmit}>
          Create
        </Button>

        <VerticalSpace space="small" />

        <Button
          fullWidth
          secondary
          onClick={() => {
            emit('cancel');
          }}
        >
          Cancel
        </Button>
        <VerticalSpace space="medium" />
      </Container>
    </div>
  );
}

export default render(Plugin);
