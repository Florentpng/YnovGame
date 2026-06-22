import type { PokemonType } from "./types";
import type { MoveId } from "./moves";

export type SpeciesId =
  | "eliegateur"
  | "lucatata"
  | "thivaltout"
  | "triocundo"
  | "matterio"
  | "moustea"
  | "costarica"
  | "lapaurore"
  | "johnyon"
  | "ramochet"
  | "crombelebi"
  | "grolumiere";

export interface SpeciesDef {
  id: string;
  name: string;
  imageUrl: string;
  type: PokemonType;
  baseHp: number;
  baseAtk: number;
  moveIds: MoveId[];
}

export const SPECIES: Record<SpeciesId, SpeciesDef> = {
  eliegateur: {
    id: "1",
    name: "Eliegateur",
    imageUrl: "../../assets/eliegateur.png",
    type: "tenebres",
    baseHp: 30,
    baseAtk: 12,
    moveIds: ["discord", "monster_sucre"],
  },
  lucatata: {
    id: "2",
    name: "Lucatata",
    imageUrl: "../../assets/lucatata.png",
    type: "normal",
    baseHp: 2,
    baseAtk: 1,
    moveIds: ["tier_temps", "PL"],
  },
  thivaltout: {
    id: "3",
    name: "Thivaltout",
    imageUrl: "../../assets/thivaltout.png",
    type: "poison",
    baseHp: 34,
    baseAtk: 9,
    moveIds: ["rose", "duper"],
  },
  triocundo: {
    id: "4",
    name: "Triocundo",
    imageUrl: "../../assets/triocundo.png",
    type: "sol",
    baseHp: 25,
    baseAtk: 11,
    moveIds: ["coup_d_boul", "raouleguibele"],
  },
  matterio: {
    id: "5",
    name: "Matterio",
    imageUrl: "../../assets/matterio.png",
    type: "combat",
    baseHp: 27,
    baseAtk: 9,
    moveIds: ["jab", "jiu_jitsu"],
  },
  moustea: {
    id: "6",
    name: "Moustéa",
    imageUrl: "../../assets/moustea.png",
    type: "eau",
    baseHp: 28,
    baseAtk: 8,
    moveIds: ["zero", "stage"],
  },
  costarica: {
    id: "7",
    name: "Costarica",
    imageUrl: "../../assets/costarica.png",
    type: "roche",
    baseHp: 22,
    baseAtk: 10,
    moveIds: ["emploi_fictif", "mastere_cyber"],
  },
  lapaurore: {
    id: "8",
    name: "Lapaurore",
    imageUrl: "../../assets/lapaurore.png",
    type: "feu",
    baseHp: 24,
    baseAtk: 8,
    moveIds: ["absence_injustifiee", "convocation"],
  },
  johnyon: {
    id: "9",
    name: "Johnyon",
    imageUrl: "../../assets/johnyon.png",
    type: "electrique",
    baseHp: 20,
    baseAtk: 9,
    moveIds: ["drop_table", "react"],
  },
  ramochet: {
    id: "10",
    name: "Ramochet",
    imageUrl: "../../assets/ramochet.png",
    type: "plante",
    baseHp: 21,
    baseAtk: 7,
    moveIds: ["disparition", "pause"],
  },
  crombelebi: {
    id: "11",
    name: "Crombélébi",
    imageUrl: "../../assets/crombelebi.png",
    type: "fee",
    baseHp: 23,
    baseAtk: 6,
    moveIds: ["these", "antithese"],
  },
  grolumiere: {
    id: "12",
    name: "Grolumiere",
    imageUrl: "../../assets/grolumiere.png",
    type: "psy",
    baseHp: 23,
    baseAtk: 6,
    moveIds: ["esquive", "IA"],
  },
};

const ALL_SPECIES_IDS = Object.keys(SPECIES) as SpeciesId[];
const shuffledIds = [...ALL_SPECIES_IDS].sort(() => Math.random() - 0.5);

export const STARTER_IDS: SpeciesId[] = shuffledIds.slice(0, 6);
export const WILD_IDS: SpeciesId[] = shuffledIds.slice(6);

export function getSpecies(id: SpeciesId | string): SpeciesDef {
  const s = SPECIES[id as SpeciesId];
  if (!s) throw new Error(`Problème espèce: ${id}`);
  return s;
}
