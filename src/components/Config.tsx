/** @jsx h */

import {
  Button,
  Checkbox,
  Columns,
  Container,
  Dropdown,
  TextboxColor,
  TextboxNumeric,
  useInitialFocus,
  VerticalSpace,
  Text,
  DropdownOptionValue,
  DropdownOption,
} from '@create-figma-plugin/ui';
import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { TableSpec } from '../dto/tableSpec';
import { FormState, FormStateSetter } from '../types';
import styles from '../ui.css';

export const Config = ({
  formState,
  setFormState,
  fonts,
  spec,
}: {
  formState: FormState;
  setFormState: FormStateSetter;
  fonts: Font[];
  spec: TableSpec;
}) => {
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

  const [fontStyles, setFontStyles] = useState<DropdownOption<string>[]>(
    fontMap.get(spec.font.family) || []
  );

  return (
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
    </Container>
  );
};
