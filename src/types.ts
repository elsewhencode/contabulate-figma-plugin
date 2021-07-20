export interface TableSpec {
  cols: number;
  rows: number;
  padding: number;
  spacing: number;
  gridLines: boolean;
  font: FontName;
}

export interface PluginProps {
  spec: TableSpec;
  fonts: Font[];
  [key: string]: unknown;
}
