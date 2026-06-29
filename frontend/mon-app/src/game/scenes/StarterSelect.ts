import { Scene, GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import { GameState } from '../state/GameState';
import { getSpecies } from '../data/species';

export class StarterSelect extends Scene {
    private selectedTeam: string[] = [];
    private maxSelections = 3;
    
    private availableMonsters = [
        'costarica', 'crombelebi', 'eliegateur', 'grolumiere', 
        'johnyon', 'lapaurore', 'lucatata', 'matterio', 
        'moustea', 'Ramochet', 'thivaltout', 'triocundo'
    ]; 
    
    private slots: GameObjects.Image[] = [];
    private confirmButton!: GameObjects.Text;
    private titleText!: GameObjects.Text;
    private cardsBg: Map<string, GameObjects.Rectangle> = new Map();

    constructor() { super('StarterSelect'); }

    init() {
        this.selectedTeam = [];
        this.slots = [];
        this.cardsBg.clear();
    }

    preload() {
        this.load.image('costarica', '/costarica.png');
        this.load.image('crombelebi', '/crombelebi.png');
        this.load.image('eliegateur', '/eliegateur.png');
        this.load.image('grolumiere', '/grolumiere.png');
        this.load.image('johnyon', '/johnyon.png');
        this.load.image('lapaurore', '/lapaurore.png');
        this.load.image('lucatata', '/lucatata.png');
        this.load.image('matterio', '/matterio.png');
        this.load.image('moustea', '/moustea.png');
        this.load.image('Ramochet', '/ramochet.png');
        this.load.image('thivaltout', '/thivaltout.png');
        this.load.image('triocundo', '/triocundo.png');
    }

    create() {
        const { width, height } = this.scale;

        this.add.rectangle(0, 0, width, height, 0x1e293b).setOrigin(0);

        const textStyle = { 
            fontFamily: '"Press Start 2P", monospace', 
            color: '#ffffff', 
            stroke: '#000000', 
            strokeThickness: 4 
        };

        this.titleText = this.add.text(width / 2, 60, 'CHOISIS 3 POKÉMON (0/3)', {
            ...textStyle, fontSize: '24px'
        }).setOrigin(0.5);

        const startX = width / 2 - 150;
        for (let i = 0; i < 3; i++) {
            this.add.circle(startX + i * 150, 160, 45, 0x334155).setStrokeStyle(3, 0x000000);
            
            const slotImg = this.add.image(startX + i * 150, 160, '').setAlpha(0);
            slotImg.setInteractive({ useHandCursor: true });
            slotImg.on('pointerdown', () => this.removeMonster(i));
            
            this.slots.push(slotImg);
        }

        const cols = 6;
        const spacingX = 110;
        const spacingY = 110;
        const gridStartX = width / 2 - ((cols - 1) * spacingX) / 2;
        const gridStartY = 300;

        this.availableMonsters.forEach((key, index) => {
            const x = gridStartX + (index % cols) * spacingX;
            const y = gridStartY + Math.floor(index / cols) * spacingY;

            // Carte de fond
            const cardBg = this.add.rectangle(x, y, 90, 90, 0x475569)
                .setStrokeStyle(2, 0x000000)
                .setInteractive({ useHandCursor: true });
            
            this.cardsBg.set(key, cardBg);

            const sprite = this.add.image(x, y, key);

            const maxDimension = Math.max(sprite.width, sprite.height);
            const baseScale = 70 / maxDimension;
            const hoverScale = baseScale * 1.15;

            sprite.setScale(baseScale);

            cardBg.on('pointerover', () => {
                if (this.selectedTeam.length < this.maxSelections || this.selectedTeam.includes(key)) {
                    cardBg.setFillStyle(0x64748b);
                    
                    this.tweens.add({
                        targets: sprite,
                        scaleX: hoverScale,
                        scaleY: hoverScale,
                        duration: 150,
                        ease: 'Sine.easeOut'
                    });
                }
            });
            
            cardBg.on('pointerout', () => {
                cardBg.setFillStyle(0x475569);
                
                this.tweens.add({
                    targets: sprite,
                    scaleX: baseScale,
                    scaleY: baseScale,
                    duration: 150,
                    ease: 'Sine.easeOut'
                });
            });

            cardBg.on('pointerdown', () => {
                this.toggleMonster(key);
            });
        });

        this.confirmButton = this.add.text(width / 2, height - 80, '▶ VALIDER L\'ÉQUIPE ◀', {
            ...textStyle, fontSize: '20px', color: '#64748b'
        }).setOrigin(0.5);

        this.confirmButton.on('pointerdown', () => {
            if (this.selectedTeam.length === 3) {
                
                GameState.reset();

                this.selectedTeam.forEach(monsterKey => {
                    const speciesId = monsterKey.toLowerCase(); 
                    const sp = getSpecies(speciesId);
                    
                    GameState.addToTeam({
                        speciesId: speciesId,
                        currentHp: sp.baseHp,
                        maxHp: sp.baseHp
                    });
                });

                this.scene.start('Overworld'); 
                this.sound.stopAll();
            }
        });

        EventBus.emit('current-scene-ready', this);
    }

    private toggleMonster(key: string) {
        const index = this.selectedTeam.indexOf(key);
        
        if (index > -1) {
            this.selectedTeam.splice(index, 1);
        } else if (this.selectedTeam.length < this.maxSelections) {
            this.selectedTeam.push(key);
        }

        this.updateVisuals();
    }

    private removeMonster(slotIndex: number) {
        if (this.selectedTeam[slotIndex]) {
            this.selectedTeam.splice(slotIndex, 1);
            this.updateVisuals();
        }
    }

    private updateVisuals() {
        this.titleText.setText(`CHOISIS 3 POKÉMON (${this.selectedTeam.length}/3)`);

        for (let i = 0; i < 3; i++) {
            const mon = this.selectedTeam[i];
            if (mon) {
                this.slots[i].setTexture(mon);
                
                const maxDimension = Math.max(this.slots[i].width, this.slots[i].height);
                const scale = 60 / maxDimension;
                
                this.slots[i].setScale(scale);
                this.slots[i].setAlpha(1);
            } else {
                this.slots[i].setAlpha(0);
            }
        }

        this.cardsBg.forEach((bg, key) => {
            if (this.selectedTeam.includes(key)) {
                bg.setStrokeStyle(4, 0xFFCC00);
            } else {
                bg.setStrokeStyle(2, 0x000000);
            }
        });

        if (this.selectedTeam.length === 3) {
            this.confirmButton.setColor('#FFCC00');
            this.confirmButton.setInteractive({ useHandCursor: true });
            
            this.tweens.add({
                targets: this.confirmButton,
                scaleX: 1.05, scaleY: 1.05,
                yoyo: true, duration: 300, ease: 'Sine.easeInOut'
            });
        } else {
            this.confirmButton.setColor('#64748b');
            this.confirmButton.disableInteractive();
            this.confirmButton.setScale(1);
        }
    }
}