import { ColumnSpec, TableSpec } from './dto/tableSpec';

export interface PluginProps {
  spec: TableSpec;
  fonts: Font[];
  [key: string]: unknown;
}

export type ColumnType = 'word' | 'date' | 'number';

export interface FormState {
  cols: string;
  rows: string;
  padding: string;
  spacing: string;
  fontFamily: string;
  fontStyle: string;
  gridLines: boolean;
  gridLineColor: string;
  gridLineOpacity: string;
  seed: number;
  columns: ColumnSpec[];
}

export type FormStateSetter = <Name extends keyof FormState>(
  state: FormState[Name],
  name: undefined | Name
) => void;
