import { Input, Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { MAIN_MAP, MAP_WIDTH, MAP_HEIGHT, TRAINERS } from '../data/maps/mainMap';
import { TILE_COLORS, WALKABLE } from '../data/types';
import { GameState } from '../state/GameState';
import { WILD_IDS } from '../data/species';
import type { BattleInitData } from './Battle';

export const TILE_SIZE = 32;
export const ORIGIN_X = (1024 - MAP_WIDTH * TILE_SIZE) / 2;
export const ORIGIN_Y = (768 - MAP_HEIGHT * TILE_SIZE) / 2;

export function tilePixelCenter(tx: number, ty: number): { x: number; y: number } {
    return {
        x: ORIGIN_X + tx * TILE_SIZE + TILE_SIZE / 2,
        y: ORIGIN_Y + ty * TILE_SIZE + TILE_SIZE / 2,
    };
}

export class Overworld extends Scene {
    private player!: Phaser.GameObjects.Rectangle;
    private isMoving = false;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };

    constructor() { super('Overworld'); }

    init() {
        // Phaser reuses the scene instance across restarts (e.g. when returning
        // from Battle). Reset transient state so the player can move again.
        this.isMoving = false;
    }

    create() {
        this.add.rectangle(512, 384, MAP_WIDTH * TILE_SIZE + 8, MAP_HEIGHT * TILE_SIZE + 8, 0x000000)
            .setStrokeStyle(2, 0xffffff);

        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                const { x: px, y: py } = tilePixelCenter(x, y);
                this.add.rectangle(px, py, TILE_SIZE, TILE_SIZE, TILE_COLORS[MAIN_MAP[y][x]]);
            }
        }

        for (const t of TRAINERS) {
            if (GameState.defeatedTrainerIds.has(t.id)) continue;
            const { x: px, y: py } = tilePixelCenter(t.x, t.y);
            this.add.rectangle(px, py, 26, 26, 0xff3030).setStrokeStyle(2, 0xffffff);
        }

        const pos = tilePixelCenter(GameState.playerPosition.x, GameState.playerPosition.y);
        this.player = this.add.rectangle(pos.x, pos.y, 28, 28, 0x4080ff).setStrokeStyle(2, 0xffffff);

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = {
            up:    this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.Z),
            down:  this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.S),
            left:  this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.Q),
            right: this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.D),
        };

        EventBus.emit('current-scene-ready', this);
    }

    update() {
        if (this.isMoving) return;
        if (this.cursors.left.isDown  || this.wasd.left.isDown)  return this.tryMove(-1, 0);
        if (this.cursors.right.isDown || this.wasd.right.isDown) return this.tryMove(1, 0);
        if (this.cursors.up.isDown    || this.wasd.up.isDown)    return this.tryMove(0, -1);
        if (this.cursors.down.isDown  || this.wasd.down.isDown)  return this.tryMove(0, 1);
    }

    private tryMove(dx: number, dy: number) {
        const nx = GameState.playerPosition.x + dx;
        const ny = GameState.playerPosition.y + dy;
        if (nx < 0 || ny < 0 || nx >= MAP_WIDTH || ny >= MAP_HEIGHT) return;
        if (!WALKABLE[MAIN_MAP[ny][nx]]) return;
        if (this.trainerAt(nx, ny)) return;

        this.isMoving = true;
        const target = tilePixelCenter(nx, ny);
        this.tweens.add({
            targets: this.player,
            x: target.x,
            y: target.y,
            duration: 150,
            onComplete: () => {
                GameState.setPlayerPosition({ x: nx, y: ny });
                this.isMoving = false;
                this.checkEncounters(nx, ny);
            },
        });
    }

    private trainerAt(x: number, y: number) {
        return TRAINERS.find(
            (t) => t.x === x && t.y === y && !GameState.defeatedTrainerIds.has(t.id),
        );
    }

    private checkEncounters(x: number, y: number) {
        // 1. Trainer adjacency (deterministic, priority)
        const adj = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 },
        ];
        for (const a of adj) {
            const t = this.trainerAt(a.x, a.y);
            if (t) {
                this.startBattle({
                    kind: 'trainer',
                    enemyTeamSpeciesIds: t.teamSpeciesIds,
                    trainerId: t.id,
                });
                return;
            }
        }

        // 2. Wild encounter (random, only on tall grass)
        if (MAIN_MAP[y][x] === 'tall_grass' && Math.random() < 0.1) {
            const speciesId = WILD_IDS[Math.floor(Math.random() * WILD_IDS.length)];
            this.startBattle({
                kind: 'wild',
                enemyTeamSpeciesIds: [speciesId],
            });
        }
    }

    private startBattle(data: BattleInitData) {
        this.scene.start('Battle', data);
    }
}
