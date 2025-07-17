import { Player } from '../entities/Player.js';
import { Cockroach } from '../entities/Cockroach.js';
import { DialogueSystem } from '../ui/DialogueSystem.js';
import { SwordStone } from '../entities/SwordStone.js';
import { playerConfig, cockroachConfig, worldConfig } from '../config/game-config.js';

export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // Load sprites
        this.load.svg('knight', 'assets/knight.svg', { width: 32, height: 32 });
        this.load.svg('knight_with_sword', 'assets/knight_with_sword.svg', { width: 32, height: 32 });
        this.load.svg('sword_stone', 'assets/sword_stone.svg', { width: 64, height: 64 });
        this.load.svg('stone', 'assets/stone.svg', { width: 64, height: 64 });
        this.load.svg('princess', 'assets/princess.svg', { width: 32, height: 32 });
        this.load.svg('tower_window', 'assets/tower_window.svg', { width: 64, height: 64 });
        this.load.svg('tower_wall', 'assets/tower_wall.svg', { width: 100, height: 100 });
        this.load.svg('cockroach', 'assets/cockroach.svg', { width: 24, height: 24 });
    }

    create() {
        this.createWorld();
        this.createPlatforms();
        this.createTower();
        
        // Create game objects
        this.player = new Player(this, playerConfig);
        this.dialogueSystem = new DialogueSystem(this);
        this.swordStone = new SwordStone(this, 1000, 1086);
        
        // Create cockroaches
        this.cockroaches = [];
        cockroachConfig.positions.forEach(pos => {
            const cockroach = new Cockroach(this, pos.x, pos.y, cockroachConfig);
            this.cockroaches.push(cockroach);
            this.physics.add.collider(cockroach.getSprite(), this.platforms);
        });

        // Add collisions
        this.physics.add.collider(this.player.getSprite(), this.platforms);
        this.physics.add.overlap(this.player.getSprite(), this.swordStone.getSprite(), this.checkSwordProximity, null, this);
        
        // Setup princess interaction
        this.physics.add.overlap(
            this.player.getSprite(),
            this.princess,
            this.checkPrincessProximity,
            null,
            this
        );

        // Setup camera
        this.cameras.main.setBounds(0, 0, worldConfig.width, worldConfig.height);
        this.cameras.main.startFollow(this.player.getSprite(), true, 0.08, 0.08);
        this.cameras.main.setDeadzone(100, 100);

        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.sKey = this.input.keyboard.addKey('S');
        this.oneKey = this.input.keyboard.addKey('ONE');
        this.twoKey = this.input.keyboard.addKey('TWO');

        // Quest state
        this.questActive = false;
    }

    createWorld() {
        this.physics.world.setBounds(0, 0, worldConfig.width, worldConfig.height);
        this.add.rectangle(worldConfig.width/2, worldConfig.height/2, worldConfig.width, worldConfig.height, 0x87CEEB);
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        
        // Ground platforms
        for (let i = 0; i < 3; i++) {
            this.platforms.create(400 + (800 * i), 1150, 'ground')
                .setScale(2)
                .setSize(400, 32)
                .setDisplaySize(800, 32)
                .setTint(0x8B4513)
                .refreshBody();
        }

        // Tower platforms
        const platformData = [
            { x: worldConfig.towerPosition - 300, y: 1000 },
            { x: worldConfig.towerPosition - 150, y: 850 },
            { x: worldConfig.towerPosition - 300, y: 700 },
            { x: worldConfig.towerPosition - 150, y: 550 },
            { x: worldConfig.towerPosition - 300, y: 400 },
            { x: worldConfig.towerPosition - 150, y: 250 },
            { x: worldConfig.towerPosition - 300, y: 100 },
            { x: worldConfig.towerPosition - 50, y: 150 }
        ];

        platformData.forEach(data => {
            this.platforms.create(data.x, data.y, 'ground')
                .setScale(0.5)
                .setSize(100, 32)
                .setDisplaySize(200, 32)
                .setTint(0x8B4513)
                .refreshBody();
        });
    }

    createTower() {
        const towerWidth = 100;
        const tilesY = Math.ceil(worldConfig.height / 100);
        
        for (let y = 0; y < tilesY; y++) {
            this.add.sprite(worldConfig.towerPosition, y * 100 + 50, 'tower_wall')
                .setDisplaySize(towerWidth, 100);
        }
        
        this.add.sprite(worldConfig.towerPosition, 100, 'tower_window');
        this.princess = this.add.sprite(worldConfig.towerPosition, 100, 'princess');
        this.princess.setScale(2);
        this.physics.add.existing(this.princess, true);
        this.princess.body.setSize(32, 32);
    }

    startCockroachQuest() {
        this.questActive = true;
    }

    update(time) {
        if (!this.dialogueSystem.isActive()) {
            this.player.update(this.cursors);
            this.cockroaches.forEach(cockroach => cockroach.update(time));
            this.swordStone.update(this.cursors);
        } else {
            if (Phaser.Input.Keyboard.JustDown(this.oneKey)) {
                this.dialogueSystem.handleChoice(1);
            } else if (Phaser.Input.Keyboard.JustDown(this.twoKey)) {
                this.dialogueSystem.handleChoice(2);
            }
        }
    }

    checkSwordProximity(player, stone) {
        this.swordStone.handleProximity(player);
    }

    checkPrincessProximity(player, princess) {
        if (!this.dialogueSystem.isActive() && Phaser.Input.Keyboard.JustDown(this.sKey)) {
            this.dialogueSystem.startDialogue();
        }
    }
} 