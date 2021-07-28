export interface StyleSpec {
  gridLines: boolean;
  gridLineColor: RGB | null;
  gridLineOpacity: number;
}

export interface TableSpec {
  colCount: number;
  rows: number;
  padding: number;
  spacing: number;
  font: FontName;
  styles: StyleSpec;
}

export interface PluginProps {
  spec: TableSpec;
  fonts: Font[];
  [key: string]: unknown;
}
