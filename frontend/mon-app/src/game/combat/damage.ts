import type { PokemonType, MoveType } from '../data/types';

const CHART: Record<PokemonType, PokemonType> = {
    feu: 'feu',
    plante: 'plante',
    eau: 'eau',
    electrique: 'electrique',
    psy: 'psy',
    normal: 'normal',
    combat: 'combat',
    poison: 'poison',
    roche: 'roche',
    sol: 'sol',
    tenebres: 'tenebres',
    fee: 'fee'
};

export function typeMultiplier(attackType: MoveType, defenderType: PokemonType): number {
    if (attackType === 'neutral') return 1.0;
    if (CHART[attackType] === defenderType) return 2.0;
    if (CHART[defenderType] === attackType) return 0.5;
    return 1.0;
}

export interface DamageInput {
    power: number;
    attackType: MoveType;
    attackerAtk: number;
    defenderType: PokemonType;
}

export function calculateDamage(input: DamageInput, rng: () => number = Math.random): number {
    const mult = typeMultiplier(input.attackType, input.defenderType);
    const randFactor = 0.85 + rng() * 0.15;
    const raw = input.power * (input.attackerAtk / 10) * mult * randFactor;
    return Math.max(1, Math.floor(raw));
}
