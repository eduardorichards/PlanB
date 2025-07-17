import { gameConfig } from './config/game-config.js';
import { MainScene } from './scenes/MainScene.js';

// Add the main scene to the game config
gameConfig.scene = MainScene;

// Create game instance
const game = new Phaser.Game(gameConfig); 