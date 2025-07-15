// Game configuration
const config = {
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
        preload: preload,
        create: create,
        update: update
    }
};

// Create game instance
const game = new Phaser.Game(config);

// Game variables
let player;
let cursors;

function preload() {
    // Load game assets here
    // Example: this.load.image('player', 'assets/player.png');
}

function create() {
    // Create game objects here
    // Example of a simple rectangle as a placeholder for the player
    player = this.add.rectangle(400, 300, 32, 32, 0x00ff00);
    this.physics.add.existing(player);
    
    // Enable keyboard input
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Game loop logic here
    if (cursors.left.isDown) {
        player.x -= 4;
    } else if (cursors.right.isDown) {
        player.x += 4;
    }

    if (cursors.up.isDown) {
        player.y -= 4;
    } else if (cursors.down.isDown) {
        player.y += 4;
    }
} 