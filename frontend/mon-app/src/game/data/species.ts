import type { PokemonType } from './types';
import type { MoveId } from './moves';

export type SpeciesId = 'eliegateur' | 'lucatata' | 'thivolt' | 'facundor' | 'matteon' | 'eleamite' | 'costarica' | 'aurorise' | 'johnyx' | 'richettin' | 'crombul';

export interface SpeciesDef {
    id: string;
    name: string;
    type: PokemonType;
    baseHp: number;
    baseAtk: number;
    moveIds: MoveId[];
}

export const SPECIES: Record<SpeciesId, SpeciesDef> = {
    eliegateur: { id: '1',  name: 'Eliegateur', type: 'dark',     baseHp: 30, baseAtk: 12, moveIds: ['dard_venin', 'acide'] },
    lucatata:   { id: '2',  name: 'Lucatata',   type: 'normal',   baseHp: 10, baseAtk: 10, moveIds: ['charge', 'murmure'] },
    thivolt:    { id: '3',  name: 'Thivolt',    type: 'electric', baseHp: 34, baseAtk: 9,  moveIds: ['electrochoc', 'etincelle'] },
    facundor:   { id: '4',  name: 'Facundor',   type: 'steel',    baseHp: 25, baseAtk: 11, moveIds: ['poing_comete', 'balayage'] },
    matteon:    { id: '5',  name: 'Matteon',    type: 'fighting', baseHp: 27, baseAtk: 9,  moveIds: ['poing_comete', 'balayage'] },
    eleamite:   { id: '6',  name: 'Eleamite',   type: 'water',    baseHp: 28, baseAtk: 8,  moveIds: ['pistolet_o', 'bulles'] },
    costarica:  { id: '7',  name: 'Costarica',  type: 'fire',     baseHp: 22, baseAtk: 10, moveIds: ['flammeche', 'griffe'] },
    aurorise:   { id: '8',  name: 'Aurorise',   type: 'fire',     baseHp: 24, baseAtk: 8,  moveIds: ['flammeche', 'griffe'] },
    johnyx:     { id: '10', name: 'Johnyx',     type: 'rock',     baseHp: 20, baseAtk: 9,  moveIds: ['jet_pierres', 'seisme'] },
    richettin:  { id: '11', name: 'Richettin',  type: 'grass',    baseHp: 21, baseAtk: 7,  moveIds: ['fouet_lianes', 'tranchherbe'] },
    crombul:    { id: '12', name: 'Crombul',    type: 'psychic',  baseHp: 23, baseAtk: 6,  moveIds: ['psyko', 'choc_mental'] },
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
