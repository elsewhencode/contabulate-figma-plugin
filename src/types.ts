import { TableSpec } from './dto/tableSpec';

export interface PluginProps {
  spec: TableSpec;
  fonts: Font[];
  [key: string]: unknown;
}
