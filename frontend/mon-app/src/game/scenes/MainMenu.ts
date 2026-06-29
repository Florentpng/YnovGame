import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import loginBackgroundUrl from '../../assets/login_background.png';

export class MainMenu extends Scene {
    constructor() { super('MainMenu'); }

    preload() {
        this.load.image('login-background', loginBackgroundUrl);
    }

    create() {
        const { width, height } = this.scale;

        this.sound.play('mainmenu_music', { loop: true, volume: 0.5 });

        const bg = this.add.image(width / 2, height / 2, 'login-background').setOrigin(0.5);
        bg.setDisplaySize(width, height);

        const title = this.add.text(width / 2, height / 4, 'POKYNOV', {
            fontFamily: '"Press Start 2P", Impact, sans-serif',
            fontSize: '64px',
            color: '#FFCC00',
            stroke: '#2A52BE',
            strokeThickness: 12,
            shadow: { offsetX: 6, offsetY: 6, color: '#000000', fill: true }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            y: title.y - 15,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const startText = this.add.text(width / 2, height - 120, '▶ DÉMARRER ◀', {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#000000', fill: true }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const blinkTween = this.tweens.add({
            targets: startText,
            alpha: 0.2,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Linear'
        });

        startText.on('pointerover', () => {
            startText.setColor('#FFCC00');
            blinkTween.pause();            
            startText.setAlpha(1);         
        });
        
        startText.on('pointerout', () => {
            startText.setColor('#ffffff');
            blinkTween.resume();           
        });

        const changeScene = () => {
            this.scene.start('StarterSelect');
        }
        
        startText.on('pointerdown', changeScene);
        this.input.keyboard?.once('keydown-ENTER', changeScene);
        this.input.keyboard?.once('keydown-SPACE', changeScene);

        EventBus.emit('current-scene-ready', this);
    }
}
