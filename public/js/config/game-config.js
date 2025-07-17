export const gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        key: 'MainScene'
    }
};

export const worldConfig = {
    width: 2400,
    height: 1200,
    towerPosition: 2200
};

export const playerConfig = {
    initialX: 100,
    initialY: 1000,
    scale: 2,
    bounceValue: 0.2,
    speed: 160,
    jumpVelocity: -330
};

export const cockroachConfig = {
    count: 4,
    scale: 1.5,
    bounceValue: 0.3,
    speed: 100,
    positions: [
        { x: 300, y: 900 },   // Higher up on first platform
        { x: 800, y: 1000 },  // On second platform
        { x: 1500, y: 800 },  // On a higher platform
        { x: 2000, y: 950 }   // Near the tower
    ]
}; 