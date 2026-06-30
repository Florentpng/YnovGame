import type { TileType } from "../types";
import type { SpeciesId } from "../species";

const RAW = [
  "TTTTTTTTTTTTTTTTTTTT", // row 0
  "T,,,,,gggg,,,,,,,,,T",
  "T,,,,,gggg,,,,,,,,0T",
  "T,,,,,,,,,,,,,,,,,,T",
  "T,,..............,,T",
  "T,,.,,,,,,,,,,,,.,,T",
  "T,,.,gggg,,,,,,,.,,T",
  "T,,.,gggg,,,,,,,.,,T",
  "T,,.,,,,,,,,,,,,.,,T",
  "T,,.,,,,,,,,,,,,.,,T",
  "T,,.,,,,,,~~~~~,.,,T",
  "T,,.,,,,,,~~~~~,.,,T",
  "T,,................T", // row 12 — player spawn at x=2
  "T,,,,,,,,,,,,,,,,,,T",
  "TTTTTTTTTTTTTTTTTTTT", // row 14
];

const CODE_TO_TILE: Record<string, TileType> = {
  ".": "path",
  g: "tall_grass",
  ",": "short_grass",
  T: "tree",
  "~": "water",
  "0": "hole",
};

export const MAIN_MAP: TileType[][] = RAW.map((row) =>
  Array.from(row).map((c) => {
    const t = CODE_TO_TILE[c];
    if (!t) throw new Error(`Unknown tile code "${c}"`);
    return t;
  }),
);

export const MAP_WIDTH = MAIN_MAP[0].length; // 20
export const MAP_HEIGHT = MAIN_MAP.length; // 15

export interface TrainerPlacement {
  id: string;
  x: number;
  y: number;
  teamSpeciesIds: SpeciesId[]; // length 3
}

export const TRAINERS: TrainerPlacement[] = [
  {
    id: "trainer_a",
    x: 8,
    y: 4,
    teamSpeciesIds: ["eliegateur", "lucatata", "thivaltout"],
  },
  {
    id: "trainer_b",
    x: 4,
    y: 8,
    teamSpeciesIds: ["triocundo", "matterio", "moustea"],
  },
  {
    id: "trainer_c",
    x: 14,
    y: 12,
    teamSpeciesIds: ["lapaurore", "johnyon", "ramochet"],
  },
];
