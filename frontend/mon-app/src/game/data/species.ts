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
  isLegendary?: boolean;
}

export const SPECIES: Record<SpeciesId, SpeciesDef> = {
  eliegateur: {
    id: "1",
    name: "Eliegateur",
    imageUrl: "/eliegateur.png",
    type: "tenebres",
    baseHp: 30,
    baseAtk: 12,
    moveIds: ["discord", "monster_sucre"],
    isLegendary: false,
  },
  lucatata: {
    id: "2",
    name: "Lucatata",
    imageUrl: "/lucatata.png",
    type: "normal",
    baseHp: 2,
    baseAtk: 1,
    moveIds: ["tier_temps", "PL"],
    isLegendary: false,
  },
  thivaltout: {
    id: "3",
    name: "Thivaltout",
    imageUrl: "/thivaltout.png",
    type: "poison",
    baseHp: 34,
    baseAtk: 9,
    moveIds: ["rose", "duper"],
    isLegendary: false,
  },
  triocundo: {
    id: "4",
    name: "Triocundo",
    imageUrl: "/triocundo.png",
    type: "sol",
    baseHp: 25,
    baseAtk: 11,
    moveIds: ["coup_d_boul", "raouleguibele"],
    isLegendary: false,
  },
  matterio: {
    id: "5",
    name: "Matterio",
    imageUrl: "/matterio.png",
    type: "combat",
    baseHp: 27,
    baseAtk: 9,
    moveIds: ["jab", "jiu_jitsu"],
    isLegendary: false,
  },
  moustea: {
    id: "6",
    name: "Moustéa",
    imageUrl: "/moustea.png",
    type: "eau",
    baseHp: 28,
    baseAtk: 8,
    moveIds: ["zero", "stage"],
    isLegendary: false,
  },
  costarica: {
    id: "7",
    name: "Costarica",
    imageUrl: "/costarica.png",
    type: "roche",
    baseHp: 22,
    baseAtk: 10,
    moveIds: ["emploi_fictif", "mastere_cyber"],
    isLegendary: false,
  },
  lapaurore: {
    id: "8",
    name: "Lapaurore",
    imageUrl: "/lapaurore.png",
    type: "feu",
    baseHp: 24,
    baseAtk: 8,
    moveIds: ["absence_injustifiee", "convocation"],
    isLegendary: false,
  },
  johnyon: {
    id: "9",
    name: "Johnyon",
    imageUrl: "/johnyon.png",
    type: "electrique",
    baseHp: 20,
    baseAtk: 9,
    moveIds: ["drop_table", "react"],
    isLegendary: false,
  },
  ramochet: {
    id: "10",
    name: "Ramochet",
    imageUrl: "/ramochet.png",
    type: "plante",
    baseHp: 21,
    baseAtk: 7,
    moveIds: ["disparition", "pause"],
    isLegendary: false,
  },
  crombelebi: {
    id: "11",
    name: "Crombélébi",
    imageUrl: "/crombelebi.png",
    type: "fee",
    baseHp: 23,
    baseAtk: 6,
    moveIds: ["these", "antithese"],
    isLegendary: false,
  },
  grolumiere: {
    id: "12",
    name: "Grolumiere",
    imageUrl: "/grolumiere.png",
    type: "psy",
    baseHp: 40,
    baseAtk: 6,
    moveIds: ["esquive", "IA"],
    isLegendary: true,
  },
};

const ALL_SPECIES_IDS = Object.keys(SPECIES) as SpeciesId[];

export const LEGENDARY_IDS = ALL_SPECIES_IDS.filter(id => SPECIES[id].isLegendary === true);

const ONLY_NORMAL_POKEMON = ALL_SPECIES_IDS.filter(id => !SPECIES[id].isLegendary);

const shuffledNormalIds = [...ONLY_NORMAL_POKEMON].sort(() => Math.random() - 0.5);

export const STARTER_IDS: SpeciesId[] = shuffledNormalIds;
export const WILD_IDS: SpeciesId[] = shuffledNormalIds;

export function getSpecies(id: SpeciesId | string): SpeciesDef {
  const s = SPECIES[id as SpeciesId];
  if (!s) throw new Error(`Problème espèce: ${id}`);
  return s;
}