import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GameState } from '../state/GameState';

export class GameOver extends Scene {
    constructor() { super('GameOver'); }

    create() {
        this.cameras.main.setBackgroundColor(0x300000);
        this.add.text(512, 280, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 72, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
        }).setOrigin(0.5);

        const btn = this.add.text(512, 460, 'Recommencer', {
            fontFamily: 'Arial Black', fontSize: 36, color: '#ffffff',
            backgroundColor: '#0066cc', padding: { x: 24, y: 12 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setBackgroundColor('#0088ff'));
        btn.on('pointerout', () => btn.setBackgroundColor('#0066cc'));
        btn.on('pointerdown', () => {
            GameState.reset();
            this.scene.start('MainMenu');
        });

        EventBus.emit('current-scene-ready', this);
    }
}
