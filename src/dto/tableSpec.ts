import { z } from 'zod';

const RGB = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number(),
});

export const ColumnType = z.enum(['Word', 'Date', 'Number']);
export type ColumnType = z.infer<typeof ColumnType>;

export const ColumnSpec = z.object({
  name: z.nullable(z.string()),
  type: ColumnType,
});
export type ColumnSpec = z.infer<typeof ColumnSpec>;

export const TableSpec = z.object({
  cols: z.number(),
  rows: z.number(),
  padding: z.number(),
  spacing: z.number(),
  font: z.object({
    family: z.string(),
    style: z.string(),
  }),
  styles: z.object({
    gridLines: z.boolean(),
    gridLineColor: z.nullable(RGB),
    gridLineOpacity: z.number(),
  }),
  seed: z.number(),
  columns: z.array(ColumnSpec),
});

export type TableSpec = z.infer<typeof TableSpec>;
