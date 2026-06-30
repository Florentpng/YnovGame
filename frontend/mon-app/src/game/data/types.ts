export type PokemonType =
  | "tenebres"
  | "normal"
  | "eau"
  | "poison"
  | "sol"
  | "fee"
  | "combat"
  | "roche"
  | "plante"
  | "electrique"
  | "feu"
  | "psy";
export type MoveType = PokemonType | "neutral";
export type TileType =
  | "path"
  | "tall_grass"
  | "short_grass"
  | "tree"
  | "water"
  | "legendary_spawn";

export const TILE_COLORS: Record<TileType, number> = {
  path: 0xc8b88a,
  tall_grass: 0x2d6a2d,
  short_grass: 0x6abf4b,
  tree: 0x1a3a1a,
  water: 0x3a7fbf,
  legendary_spawn: 0xffd700,
};

export const WALKABLE: Record<TileType, boolean> = {
  path: true,
  tall_grass: true,
  short_grass: true,
  tree: false,
  water: false,
  legendary_spawn: true,
};
