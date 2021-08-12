/** @jsx h */
import { render, Container, VerticalSpace, Button, useForm, Tabs } from '@create-figma-plugin/ui';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import {
  convertHexColorToRgbColor,
  convertRgbColorToHexColor,
  emit,
} from '@create-figma-plugin/utilities';
import { FormState, PluginProps } from './types';
import styles from './ui.css';
import { TableSpec } from './dto/tableSpec';
import useDebounce from './use-debounce';
import { Config } from './components/Config';
import { ColumnConfig } from './components/ColumnConfig';
import produce from 'immer';

export const SIZE = { width: 300, height: 500 };

function mapState(formState: FormState): TableSpec {
  return {
    cols: parseInt(formState.cols, 10),
    rows: parseInt(formState.rows, 10),
    padding: parseInt(formState.padding, 10),
    spacing: parseInt(formState.spacing, 10),
    styles: {
      gridLines: !!formState.gridLines,
      gridLineColor: formState.gridLineColor
        ? convertHexColorToRgbColor(formState.gridLineColor)
        : { r: 0, g: 0, b: 0 },
      gridLineOpacity: Number.parseInt(formState.gridLineOpacity, 10) / 100,
    },
    font: {
      family: formState.fontFamily,
      style: formState.fontStyle,
    },
    seed: formState.seed,
    columns: formState.columns,
  };
}

export function Plugin({ spec, fonts }: PluginProps) {
  const { formState, setFormState, handleSubmit, disabled } = useForm<FormState>(
    {
      cols: `${spec.cols}`,
      rows: `${spec.rows}`,
      padding: `${spec.padding}`,
      spacing: `${spec.spacing}`,
      gridLines: spec.styles.gridLines,
      gridLineColor: spec.styles.gridLineColor
        ? convertRgbColorToHexColor(spec.styles.gridLineColor) || '000000'
        : '000000',
      gridLineOpacity: `${(spec.styles.gridLineOpacity || 0.25) * 100}`,
      fontFamily: spec.font.family,
      fontStyle: spec.font.style,
      seed: spec.seed,
      columns: spec.columns,
    },
    {
      close() {
        console.log('Closing');
        emit('cancel');
      },

      submit(state) {
        if (!disabled) {
          console.log('Creating');
          emit('create', mapState(state));
        }
      },
      transform: produce((state: FormState) => {
        const colCount = Number.parseInt(state.cols);

        if (Number.isFinite(colCount) && colCount !== state.columns.length) {
          if (state.columns.length < colCount) {
            state.columns.push(
              ...Array.from({ length: colCount - state.columns.length }).map(() => ({
                name: null,
                type: 'Word' as const,
              }))
            );
          } else {
            state.columns = state.columns.slice(0, colCount);
          }
        }

        return state;
      }),
    }
  );

  const debouncedState = useDebounce(formState, 200);

  useEffect(() => {
    console.log('Previewing');
    const newSpec = mapState(debouncedState);
    emit('preview', newSpec);
  }, [debouncedState, disabled]);

  const [tab, setTab] = useState<string>('Config');

  console.dir(formState);

  return (
    <div className={styles.uiWrap}>
      <div className={styles.tabWrapper}>
        <Tabs
          options={[
            {
              children: (
                <Config
                  formState={formState}
                  setFormState={setFormState}
                  fonts={fonts}
                  spec={spec}
                />
              ),
              value: 'Config',
            },
            {
              children: <ColumnConfig formState={formState} setFormState={setFormState} />,
              value: 'Columns',
            },
          ]}
          value={tab}
          onValueChange={setTab}
        />
      </div>

      <Container space="medium">
        <VerticalSpace space="large" />
        <Button fullWidth onClick={handleSubmit}>
          Apply
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
