import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class MainMenu extends Scene {
    constructor() { super('MainMenu'); }

    create() {
        this.add.text(512, 240, 'Pokémon-like', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
        }).setOrigin(0.5);

        this.add.text(512, 340, '(prototype)', {
            fontFamily: 'Arial', fontSize: 20, color: '#cccccc',
        }).setOrigin(0.5);

        const button = this.add.text(512, 480, 'Démarrer', {
            fontFamily: 'Arial Black', fontSize: 36, color: '#ffffff',
            backgroundColor: '#0066cc', padding: { x: 24, y: 12 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        button.on('pointerover', () => button.setBackgroundColor('#0088ff'));
        button.on('pointerout', () => button.setBackgroundColor('#0066cc'));
        button.on('pointerdown', () => this.scene.start('StarterSelect'));

        this.input.keyboard?.once('keydown-ENTER', () => this.scene.start('StarterSelect'));
        this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('StarterSelect'));

        EventBus.emit('current-scene-ready', this);
    }
}
