import type { MoveType } from "./types";

export type MoveId =
  | "tier_temps"
  | "PL"
  | "react"
  | "drop_table"
  | "absence_injustifiee"
  | "convocation"
  | "emploi_fictif"
  | "mastere_cyber"
  | "esquive"
  | "IA"
  | "discord"
  | "monster_sucre"
  | "rose"
  | "duper"
  | "disparition"
  | "pause"
  | "stage"
  | "zero"
  | "jiu_jitsu"
  | "jab"
  | "these"
  | "antithese"
  | "coup_d_boul"
  | "raouleguibele";

export interface MoveDef {
  id: string;
  name: string;
  type: MoveType;
  power: number;
}

export const MOVES: Record<MoveId, MoveDef> = {
  tier_temps: {
    id: "tier_temps",
    name: "Tier temps",
    type: "normal",
    power: 8,
  },
  PL: { id: "PL", name: "PL", type: "normal", power: 5 },
  react: { id: "react", name: "React", type: "electrique", power: 10 },
  drop_table: {
    id: "drop_table",
    name: "DROP Table",
    type: "electrique",
    power: 8,
  },
  absence_injustifiee: {
    id: "absence_injustifiee",
    name: "Absence injustifiée",
    type: "feu",
    power: 7,
  },
  convocation: {
    id: "convocation",
    name: "Convocation",
    type: "feu",
    power: 7,
  },
  emploi_fictif: {
    id: "emploi_fictif",
    name: "Emploi Fictif",
    type: "roche",
    power: 10,
  },
  mastere_cyber: {
    id: "mastere_cyber",
    name: "Mastère Cyber",
    type: "roche",
    power: 12,
  },
  esquive: { id: "esquive", name: "Esquive", type: "psy", power: 10 },
  IA: { id: "IA", name: "IA", type: "psy", power: 8 },
  discord: { id: "discord", name: "Discord", type: "tenebres", power: 9 },
  monster_sucre: {
    id: "monster_sucre",
    name: "Monster Sucré",
    type: "tenebres",
    power: 50,
  },
  rose: { id: "rose", name: "Rosé", type: "poison", power: 8 },
  duper: { id: "duper", name: "Duper", type: "poison", power: 10 },
  disparition: {
    id: "disparition",
    name: "Disparition",
    type: "plante",
    power: 12,
  },
  pause: { id: "pause", name: "Pause", type: "plante", power: 9 },
  stage: { id: "stage", name: "Stage", type: "eau", power: 9 },
  zero: { id: "zero", name: "0/20", type: "eau", power: 8 },
  jiu_jitsu: { id: "Jiu-jitsu", name: "Jiu-Jitsu", type: "combat", power: 8 },
  jab: { id: "jab", name: "Jab", type: "combat", power: 8 },
  these: { id: "these", name: "Thèse", type: "fee", power: 8 },
  antithese: { id: "antithese", name: "Antithèse", type: "fee", power: 8 },
  coup_d_boul: {
    id: "coup d'boul",
    name: "Coup d'boul",
    type: "sol",
    power: 8,
  },
  raouleguibele: {
    id: "raouléguibélé",
    name: "Raouléguibélé",
    type: "sol",
    power: 8,
  },
};

export function getMove(id: MoveId | string): MoveDef {
  const m = MOVES[id as MoveId];
  if (!m) throw new Error(`Unknown move: ${id}`);
  return m;
}
