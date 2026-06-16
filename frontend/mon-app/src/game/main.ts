import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { Overworld } from './scenes/Overworld';
import { Battle } from './scenes/Battle';
import { GameOver } from './scenes/GameOver';
import { AUTO, Game } from 'phaser';
import { StarterSelect } from './scenes/StarterSelect';
 
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#1a1a1a',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        StarterSelect,
        Overworld,
        Battle,
        GameOver,
    ],
};
 
const StartGame = (parent: string) => new Game({ ...config, parent });
 
export default StartGame;