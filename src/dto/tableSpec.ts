import { z } from 'zod';

const RGB = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number(),
});

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
});

export type TableSpec = z.infer<typeof TableSpec>;
