import { Scene } from 'phaser';
import { SPECIES } from '../data/species';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(512, 384, 'background');

        // Barre de progression
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        this.load.audio('overworld_music', 'overworld_theme.mp3');
        this.load.audio('wild_music', 'wild_theme.mp3');
        this.load.audio('trainer_music', 'trainer_theme.mp3');
        this.load.audio('legendary_music', 'legendary_theme.mp3');
        this.load.audio('mainmenu_music', 'mainmenu_theme.mp3');

        this.load.image('water_sprite', 'water.png');
        this.load.image('tall_grass_sprite', 'tall_grass.png');
        this.load.image('tree_sprite', 'tree.png');
        this.load.image('team_rocket_avatar', 'team_rocket.png');
        this.load.image('player_avatar', 'avatar.png');
        this.load.image('battle_background', 'battle_bg.jpg');
        this.load.image('background', 'login_background.png');
        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');

        for (const speciesId of Object.keys(SPECIES)) {

            this.load.image(speciesId, `${speciesId}.png`);
        }
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}