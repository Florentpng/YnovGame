export function catchChance(currentHp: number, maxHp: number): number {
    const hpRatio = Math.max(0, currentHp) / maxHp;
    return (1 - hpRatio) * 0.8 + 0.1;
}

export function tryCapture(currentHp: number, maxHp: number, rng: () => number = Math.random): boolean {
    return rng() < catchChance(currentHp, maxHp);
}
