export interface TableSpec {
  cols: number;
  rows: number;
  padding: number;
  spacing: number;
  gridLines: boolean;
  font: Font | null;
}

export interface PluginProps {
  spec: TableSpec;
  fonts: Font[];
}
