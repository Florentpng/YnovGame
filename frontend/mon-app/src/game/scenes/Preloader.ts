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
        // On affiche le background chargé dans la Boot Scene
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
        this.load.image('battle_background', 'battle_bg.jpg');
        this.load.image('background', 'login_background.png'); // Si ton fond s'appelle comme ça maintenant
        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');

        // Boucle sur les clés de SPECIES ("moustea", "ramochet", etc.)
        for (const speciesId of Object.keys(SPECIES)) {
            // Puisque setPath est enlevé, Phaser va chercher directement : "/moustea.png"
            this.load.image(speciesId, `${speciesId}.png`);
        }
    }

    create ()
    {
        // Une fois TOUT chargé (interface + Pokémon), on lance le menu principal
        this.scene.start('MainMenu');
    }
}