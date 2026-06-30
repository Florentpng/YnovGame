import { EventBus } from "../EventBus";
import { getSpecies } from "../data/species";

export interface PokemonInstance {
  speciesId: string;
  currentHp: number;
  maxHp: number;
}

export interface PlayerPosition {
  x: number;
  y: number;
}

const INITIAL_SPAWN: PlayerPosition = { x: 2, y: 12 };

export const GameState = {
  playerTeam: [] as PokemonInstance[],
  defeatedTrainerIds: new Set<string>(),
  playerPosition: { ...INITIAL_SPAWN } as PlayerPosition,

  reset(): void {
    this.playerTeam = [];
    this.defeatedTrainerIds = new Set<string>();
    this.playerPosition = { ...INITIAL_SPAWN };
    EventBus.emit("team-updated", []);
  },

  setStarter(speciesId: string): void {
    const sp = getSpecies(speciesId);
    this.playerTeam = [{ speciesId, currentHp: sp.baseHp, maxHp: sp.baseHp }];
    EventBus.emit("team-updated", this.snapshotTeam());
  },

  addToTeam(p: PokemonInstance): boolean {
    if (this.playerTeam.length >= 3) return false;
    this.playerTeam.push(p);
    EventBus.emit("team-updated", this.snapshotTeam());
    return true;
  },

  damagePokemon(index: number, damage: number): void {
    const p = this.playerTeam[index];
    if (!p) return;
    p.currentHp = Math.max(0, p.currentHp - damage);
    EventBus.emit("team-updated", this.snapshotTeam());
  },

  setPlayerPosition(pos: PlayerPosition): void {
    this.playerPosition = pos;
  },

  markTrainerDefeated(id: string): void {
    this.defeatedTrainerIds.add(id);
  },

  snapshotTeam(): PokemonInstance[] {
    return this.playerTeam.map((p) => ({ ...p }));
  },

  allFainted(): boolean {
    return (
      this.playerTeam.length > 0 &&
      this.playerTeam.every((p) => p.currentHp <= 0)
    );
  },
};
