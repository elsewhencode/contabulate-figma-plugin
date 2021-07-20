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
} from '@create-figma-plugin/ui';
import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { emit } from '@create-figma-plugin/utilities';
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
}

export function Plugin({ spec, fonts }: PluginProps) {
  const { formState, setFormState, handleSubmit, disabled } = useForm<FormState>(
    {
      cols: `${spec.cols}`,
      rows: `${spec.rows}`,
      padding: `${spec.padding}`,
      spacing: `${spec.spacing}`,
      gridLines: spec.gridLines,
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
            cols: parseInt(state.cols, 10),
            rows: parseInt(state.rows, 10),
            padding: parseInt(state.padding, 10),
            spacing: parseInt(state.spacing, 10),
            gridLines: !!state.gridLines,
            font: {
              family: state.fontFamily,
              style: state.fontStyle,
            },
          };

          emit('create', newSpec);
        }
      },
    }
  );

  const fontFamilies = useMemo(() => {
    const families = new Set<string>(fonts.map(f => f.fontName.family));
    return Array.from(families.values()).map(value => ({ value }));
  }, [fonts]);

  const fontStyles = useMemo(() => {
    const styles = fonts
      ? fonts
          .filter(font => font.fontName.family === formState.fontFamily)
          .map(f => ({ value: f.fontName.style }))
      : [];

    if (styles.length) {
      if (!(formState.fontStyle && styles.some(style => style.value === formState.fontStyle))) {
        setFormState(styles[0].value, 'fontStyle');
      }
    } else {
      setFormState('', 'fontStyle');
    }

    return styles;
  }, [formState.fontFamily]);

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

        <Checkbox name="gridLines" value={formState.gridLines} onValueChange={setFormState}>
          <Text>Grid lines</Text>
        </Checkbox>

        <VerticalSpace space="large" />

        <div>
          <Text muted>Font Family</Text>
          <VerticalSpace space="small" />

          <div class={styles.dropdownContainer}>
            <Dropdown
              name="fontFamily"
              onValueChange={setFormState}
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
