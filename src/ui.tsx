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
  DropdownMenu,
  DropdownOption,
  Checkbox,
} from '@create-figma-plugin/ui';
import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { emit } from '@create-figma-plugin/utilities';
import { PluginProps } from './types';
import styles from './ui.scss';

export function Plugin({ spec, fonts }: PluginProps) {
  const { state, handleChange, handleSubmit, isValid } = useForm(spec, {
    onClose() {
      emit('cancel');
    },

    onSubmit(state) {
      if (isValid) {
        emit('create', {
          cols: parseInt(state.cols, 10),
          rows: parseInt(state.rows, 10),
          padding: parseInt(state.padding, 10),
          spacing: parseInt(state.spacing, 10),
          gridLines: !!state.gridLines,
          font: state.fontFamily
            ? {
                fontName: {
                  family: state.fontFamily,
                  style: state.fontStyle,
                },
              }
            : null,
        });
      }
    },
  });

  const fontFamilies = useMemo(() => {
    const result: DropdownOption[] = fonts
      ? fonts.map(f => ({
          value: f.fontName.family,
        }))
      : [];

    return result;
  }, [fonts]);

  const fontStyles = useMemo(() => {
    const styles = fonts
      ? fonts
          .filter(font => font.fontName.family === state.fontFamily)
          .map(f => ({ value: f.fontName.style }))
      : [];

    if (styles.length) {
      if (!(state.fontStyle && styles.some(style => style.value === state.fontStyle))) {
        handleChange({
          fontStyle: styles[0].value,
        });
      }
    } else {
      handleChange({
        fontStyle: null,
      });
    }

    return styles;
  }, [state.fontFamily]);

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />

      <Columns space="medium">
        <div>
          <Text numeric muted>
            Columns
          </Text>
          <VerticalSpace space="small" />
          <TextboxNumeric name="cols" value={state.cols} onChange={handleChange} />
        </div>

        <div>
          <Text numeric muted>
            Rows
          </Text>
          <VerticalSpace space="small" />
          <TextboxNumeric name="rows" value={state.rows} onChange={handleChange} />
        </div>
      </Columns>

      <VerticalSpace space="large" />

      <Columns space="medium">
        <div>
          <Text muted>Padding</Text>
          <VerticalSpace space="small" />
          <TextboxNumeric name="padding" value={state.padding} onChange={handleChange} />
        </div>

        <div>
          <Text muted>Spacing</Text>
          <VerticalSpace space="small" />
          <TextboxNumeric name="spacing" value={state.spacing} onChange={handleChange} />
        </div>
      </Columns>

      <VerticalSpace space="large" />

      <Checkbox name="gridLines" value={state.gridLines} onChange={handleChange}>
        <Text>Grid lines</Text>
      </Checkbox>

      <VerticalSpace space="large" />

      <div>
        <Text muted>Font Family</Text>
        <VerticalSpace space="small" />

        <div class={styles.dropdownContainer}>
          <DropdownMenu
            name="fontFamily"
            onChange={handleChange}
            options={fontFamilies}
            value={state.font}
            fullWidth
          >
            <div class={styles.dropdownValue}>
              <Text>{state.fontFamily || ' '}</Text>
            </div>
          </DropdownMenu>
        </div>
      </div>

      <VerticalSpace space="large" />

      <div>
        <Text muted>Font Style</Text>
        <VerticalSpace space="small" />

        <div class={styles.dropdownContainer}>
          <DropdownMenu
            name="fontStyle"
            onChange={handleChange}
            options={fontStyles}
            value={state.font}
            fullWidth
          >
            <div class={styles.dropdownValue}>
              <Text>{state.fontStyle || ' '}</Text>
            </div>
          </DropdownMenu>
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
  );
}

export default render(Plugin);
