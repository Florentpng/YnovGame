import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { STARTER_IDS, getSpecies } from '../data/species';
import { GameState } from '../state/GameState';

const TYPE_COLORS: Record<string, number> = {
    fire: 0xd35400,
    water: 0x2980b9,
    grass: 0x27ae60,
};

export class StarterSelect extends Scene {
    constructor() { super('StarterSelect'); }

    create() {
        this.add.text(512, 100, 'Choisis ton starter', {
            fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
        }).setOrigin(0.5);

        const positions = [320, 512, 704];
        STARTER_IDS.forEach((id, i) => this.makeCard(positions[i], 400, id));

        EventBus.emit('current-scene-ready', this);
    }

    private makeCard(x: number, y: number, speciesId: string) {
        const sp = getSpecies(speciesId);
        const color = TYPE_COLORS[sp.type];

        const card = this.add.rectangle(x, y, 140, 200, color)
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true });

        this.add.text(x, y - 40, sp.name, {
            fontFamily: 'Arial Black', fontSize: 22, color: '#ffffff',
        }).setOrigin(0.5);

        this.add.text(x, y - 10, sp.type, {
            fontFamily: 'Arial', fontSize: 16, color: '#ffffff',
        }).setOrigin(0.5);

        this.add.text(x, y + 30, `PV ${sp.baseHp}\nAtq ${sp.baseAtk}`, {
            fontFamily: 'Arial', fontSize: 16, color: '#ffffff', align: 'center',
        }).setOrigin(0.5);

        card.on('pointerover', () => card.setStrokeStyle(5, 0xffff00));
        card.on('pointerout', () => card.setStrokeStyle(3, 0xffffff));
        card.on('pointerdown', () => this.pick(speciesId));
    }

    private pick(speciesId: string) {
        GameState.reset();
        GameState.setStarter(speciesId);
        this.scene.start('Overworld');
    }
}
