import type { MoveType } from './types';

export type MoveId = 
  | 'charge' | 'murmure' 
  | 'flammeche' | 'griffe' 
  | 'pistolet_o' | 'bulles' 
  | 'fouet_lianes' | 'tranchherbe' 
  | 'electrochoc' | 'etincelle' 
  | 'jet_pierres' | 'seisme' 
  | 'dard_venin' | 'acide' 
  | 'psyko' | 'choc_mental' 
  | 'poing_comete' | 'balayage';

export interface MoveDef {
    id: string;
    name: string;
    type: MoveType;
    power: number;
}

export const MOVES: Record<MoveId, MoveDef> = {
    charge:        { id: 'charge',        name: 'Charge',          type: 'neutral',  power: 8  },
    murmure:       { id: 'murmure',       name: 'Murmure',         type: 'neutral',  power: 5  },
    flammeche:     { id: 'flammeche',     name: 'Flammèche',       type: 'fire',     power: 10 },
    griffe:        { id: 'griffe',        name: 'Griffe',          type: 'fire',     power: 8  },
    pistolet_o:    { id: 'pistolet_o',    name: 'Pistolet à O',    type: 'water',    power: 10 },
    bulles:        { id: 'bulles',        name: 'Bulles',          type: 'water',    power: 7  },
    fouet_lianes:  { id: 'fouet_lianes',  name: 'Fouet Lianes',    type: 'grass',    power: 10 },
    tranchherbe:   { id: 'tranchherbe',   name: 'Tranch\'Herbe',   type: 'grass',    power: 12 },
    electrochoc:   { id: 'electrochoc',   name: 'Électrochoc',     type: 'electric', power: 10 },
    etincelle:     { id: 'etincelle',     name: 'Étincelle',       type: 'electric', power: 8  },
    jet_pierres:   { id: 'jet_pierres',   name: 'Jet-Pierres',     type: 'rock',     power: 9  },
    seisme:        { id: 'seisme',        name: 'Séisme',          type: 'rock',     power: 15 },
    dard_venin:    { id: 'dard_venin',    name: 'Dard-Venin',      type: 'poison',   power: 8  },
    acide:         { id: 'acide',         name: 'Acide',           type: 'poison',   power: 10 },
    psyko:         { id: 'psyko',         name: 'Psyko',           type: 'psychic',  power: 12 },
    choc_mental:   { id: 'choc_mental',   name: 'Choc Mental',     type: 'psychic',  power: 9  },
    poing_comete:  { id: 'poing_comete',  name: 'Poing Comète',    type: 'fighting', power: 9  },
    balayage:      { id: 'balayage',      name: 'Balayage',        type: 'fighting', power: 8  },
};

export function getMove(id: MoveId | string): MoveDef {
    const m = MOVES[id as MoveId];
    if (!m) throw new Error(`Unknown move: ${id}`);
    return m;
}