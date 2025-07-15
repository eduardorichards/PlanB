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
let stone;
let princess;
let playerFacingLeft = false;
let messageText;
let progressBar;
let progressBarBg;
let progressBarContainer;
let isNearSword = false;
let isNearPrincess = false;
let pullProgress = 0;
let hasSword = false;
let dialogueBox;
let dialogueText;
let dialogueOptions;
let dialogueActive = false;
let optionTexts = [];
let interactionText; // Add this variable

function preload() {
    // Load sprites
    this.load.svg('knight', 'assets/knight.svg', { width: 32, height: 32 });
    this.load.svg('knight_with_sword', 'assets/knight_with_sword.svg', { width: 32, height: 32 });
    this.load.svg('sword_stone', 'assets/sword_stone.svg', { width: 64, height: 64 });
    this.load.svg('stone', 'assets/stone.svg', { width: 64, height: 64 });
    this.load.svg('princess', 'assets/princess.svg', { width: 32, height: 32 });
    this.load.svg('tower_window', 'assets/tower_window.svg', { width: 64, height: 64 });
    this.load.svg('tower_wall', 'assets/tower_wall.svg', { width: 100, height: 100 });
}

function create() {
    // Set world bounds (make it 3 screens wide and taller for the tower)
    this.physics.world.setBounds(0, 0, 2400, 1200);
    
    // Create a background color that fills the world
    this.add.rectangle(1200, 600, 2400, 1200, 0x87CEEB); // Sky blue background
    
    // Create platforms group
    platforms = this.physics.add.staticGroup();
    
    // Create the main ground platforms (three sections)
    for (let i = 0; i < 3; i++) {
        platforms.create(400 + (800 * i), 1150, 'ground')
            .setScale(2)
            .setSize(400, 32)
            .setDisplaySize(800, 32)
            .setTint(0x8B4513)
            .refreshBody();
    }

    // Create tower platforms (steps going up)
    const towerX = 2200; // Tower position
    const platformData = [
        { x: towerX - 300, y: 1000 },
        { x: towerX - 150, y: 850 },
        { x: towerX - 300, y: 700 },
        { x: towerX - 150, y: 550 },
        { x: towerX - 300, y: 400 },
        { x: towerX - 150, y: 250 },
        { x: towerX - 300, y: 100 },
        { x: towerX - 50, y: 150 } // Platform next to princess, lowered to match character heights
    ];

    platformData.forEach(data => {
        platforms.create(data.x, data.y, 'ground')
            .setScale(0.5)
            .setSize(100, 32)
            .setDisplaySize(200, 32)
            .setTint(0x8B4513)
            .refreshBody();
    });

    // Create tower background with stone texture
    const towerWidth = 100;
    const towerHeight = 1200;
    const tilesY = Math.ceil(towerHeight / 100);
    
    for (let y = 0; y < tilesY; y++) {
        this.add.sprite(towerX, y * 100 + 50, 'tower_wall')
            .setDisplaySize(towerWidth, 100);
    }
    
    // Create window and princess
    const window = this.add.sprite(towerX, 100, 'tower_window');
    princess = this.add.sprite(towerX, 100, 'princess');
    princess.setScale(2);
    this.physics.add.existing(princess, true); // Add static physics body
    princess.body.setSize(32, 32); // Set collision box size
    
    // Create the sword in stone
    stone = this.add.sprite(1000, 1086, 'sword_stone');
    this.physics.add.existing(stone, true);
    
    // Create the player with the knight sprite
    player = this.add.sprite(100, 1000, 'knight');
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
    this.cameras.main.setBounds(0, 0, 2400, 1200);
    this.cameras.main.startFollow(player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(100, 100);
    
    // Create progress bar (fixed to camera)
    progressBarContainer = this.add.container(400, 50);
    progressBarBg = this.add.rectangle(0, 0, 200, 20, 0x000000);
    progressBar = this.add.rectangle(-100, 0, 0, 16, 0xffd700);
    progressBarContainer.add([progressBarBg, progressBar]);
    progressBarContainer.setScrollFactor(0);
    progressBarContainer.setVisible(false);

    // Create dialogue box (fixed to camera)
    dialogueBox = this.add.rectangle(400, 500, 700, 150, 0x000000, 0.7);
    dialogueBox.setScrollFactor(0);
    dialogueBox.setVisible(false);

    dialogueText = this.add.text(70, 440, '', {
        fontSize: '24px',
        fill: '#ffffff',
        wordWrap: { width: 660 }
    });
    dialogueText.setScrollFactor(0);
    dialogueText.setVisible(false);

    // Create dialogue options
    const optionStyle = {
        fontSize: '20px',
        fill: '#ffff00'
    };

    optionTexts = [
        this.add.text(100, 500, '1: You are beautiful', optionStyle),
        this.add.text(100, 530, '2: Do you need something, my princess?', optionStyle)
    ];

    optionTexts.forEach(text => {
        text.setScrollFactor(0);
        text.setVisible(false);
    });

    // Create success message text
    messageText = this.add.text(0, 0, 'You have obtained the sword!', {
        fontSize: '32px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 4,
        align: 'center'
    });
    messageText.setOrigin(0.5);
    messageText.setScrollFactor(1);
    messageText.setVisible(false);
    
    // Create interaction indicator text
    interactionText = this.add.text(400, 100, 'Press S to talk', {
        fontSize: '20px',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    });
    interactionText.setOrigin(0.5);
    interactionText.setScrollFactor(0);
    interactionText.setVisible(false);
    
    // Enable keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    
    // Add key for dialogue
    this.sKey = this.input.keyboard.addKey('S');
    this.oneKey = this.input.keyboard.addKey('ONE');
    this.twoKey = this.input.keyboard.addKey('TWO');

    // Add collision checks
    this.physics.add.overlap(player, stone, checkSwordProximity, null, this);
    this.physics.add.overlap(player, princess, checkPrincessProximity, null, this);
}

function update() {
    if (!dialogueActive) {
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

        // Handle sword pulling
        if (isNearSword && !hasSword) {
            if (cursors.space.isDown) {
                progressBarContainer.setVisible(true);
                pullProgress += 0.02;
                progressBar.width = Math.min(pullProgress * 200, 200);
                
                if (pullProgress >= 1) {
                    completePullingSword.call(this);
                }
            } else {
                progressBarContainer.setVisible(false);
                pullProgress = 0;
                progressBar.width = 0;
            }
        }

        // Check for dialogue initiation
        if (isNearPrincess && this.sKey.isDown && !dialogueActive) {
            startDialogue.call(this);
        }
    } else {
        // Handle dialogue choices
        if (this.oneKey.isDown) {
            handleDialogueChoice.call(this, 1);
        } else if (this.twoKey.isDown) {
            handleDialogueChoice.call(this, 2);
        }
    }
}

function checkSwordProximity(player, sword) {
    if (!hasSword) {
        isNearSword = true;
    }
}

function checkPrincessProximity(player, princess) {
    isNearPrincess = true;
}

function completePullingSword() {
    hasSword = true;
    isNearSword = false;
    
    messageText.setPosition(stone.x, stone.y - 100);
    messageText.setVisible(true);
    this.time.delayedCall(2000, () => {
        messageText.setVisible(false);
    });
    
    progressBarContainer.setVisible(false);
    stone.setTexture('stone');
    player.setTexture('knight_with_sword');
}

function startDialogue() {
    dialogueActive = true;
    dialogueBox.setVisible(true);
    dialogueText.setText("Press 1 or 2 to choose what to say:");
    dialogueText.setVisible(true);
    optionTexts.forEach(text => text.setVisible(true));
}

function handleDialogueChoice(choice) {
    if (choice === 1) {
        dialogueText.setText("Princess: Not interested, go away.");
    } else {
        dialogueText.setText("Princess: Mmm maybe, but what can you get me?");
    }
    
    optionTexts.forEach(text => text.setVisible(false));
    
    this.time.delayedCall(2000, () => {
        dialogueBox.setVisible(false);
        dialogueText.setVisible(false);
        dialogueActive = false;
    });
} 