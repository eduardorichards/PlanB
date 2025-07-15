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
let platforms;
let swordInStone;
let playerFacingLeft = false;

function preload() {
    // Load the knight sprite
    this.load.svg('knight', 'assets/knight.svg', { width: 32, height: 32 });
    // Load the sword in stone sprite
    this.load.svg('sword_stone', 'assets/sword_stone.svg', { width: 64, height: 64 });
}

function create() {
    // Set world bounds (make it 3 screens wide)
    this.physics.world.setBounds(0, 0, 2400, 600);
    
    // Create a background color that fills the world
    this.add.rectangle(1200, 300, 2400, 600, 0x87CEEB); // Sky blue background
    
    // Create platforms group
    platforms = this.physics.add.staticGroup();
    
    // Create the main ground platforms (three sections)
    for (let i = 0; i < 3; i++) {
        platforms.create(400 + (800 * i), 550, 'ground')
            .setScale(2)
            .setSize(400, 32)
            .setDisplaySize(800, 32)
            .setTint(0x8B4513)
            .refreshBody();
    }

    // Add some decorative smaller platforms
    platforms.create(600, 400, 'ground')
        .setScale(0.5)
        .setSize(100, 32)
        .setDisplaySize(200, 32)
        .setTint(0x8B4513)
        .refreshBody();

    platforms.create(1200, 450, 'ground')
        .setScale(0.5)
        .setSize(100, 32)
        .setDisplaySize(200, 32)
        .setTint(0x8B4513)
        .refreshBody();
    
    // Create the sword in stone (positioned on the last platform)
    swordInStone = this.add.sprite(2000, 486, 'sword_stone');
    this.physics.add.existing(swordInStone, true); // true makes it static
    
    // Create the player with the knight sprite
    player = this.add.sprite(100, 300, 'knight');
    player.setScale(2);
    this.physics.add.existing(player);
    
    // Add collision between player and platforms
    this.physics.add.collider(player, platforms);
    
    // Set player properties
    player.body.setBounce(0.2);
    player.body.setCollideWorldBounds(true);
    player.body.setSize(20, 30);
    player.body.setOffset(6, 2);
    
    // Set up camera to follow player
    this.cameras.main.setBounds(0, 0, 2400, 600);
    this.cameras.main.startFollow(player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(100, 100);
    
    // Enable keyboard input
    cursors = this.input.keyboard.createCursorKeys();

    // Add collision check between player and sword
    this.physics.add.overlap(player, swordInStone, touchSword, null, this);
}

function update() {
    // Horizontal movement
    if (cursors.left.isDown) {
        player.body.setVelocityX(-160);
        if (!playerFacingLeft) {
            player.scaleX = -2;
            playerFacingLeft = true;
        }
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(160);
        if (playerFacingLeft) {
            player.scaleX = 2;
            playerFacingLeft = false;
        }
    } else {
        player.body.setVelocityX(0);
    }

    // Jump when the up key is pressed AND the player is touching the floor
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.setVelocityY(-330);
    }
}

function touchSword(player, sword) {
    // This function will be called when the player touches the sword
    if (!this.swordTouched) {
        this.swordTouched = true;
        this.add.text(sword.x - 100, sword.y - 100, 'You found the sword!', {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4
        }).setScrollFactor(1);
    }
} 