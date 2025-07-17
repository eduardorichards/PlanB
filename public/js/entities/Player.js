export class Player {
    constructor(scene, config) {
        this.scene = scene;
        this.sprite = scene.add.sprite(config.initialX, config.initialY, 'knight');
        this.sprite.setScale(config.scale);
        scene.physics.add.existing(this.sprite);
        
        // Physics properties
        this.sprite.body.setBounce(config.bounceValue);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setSize(20, 30);
        this.sprite.body.setOffset(6, 2);
        
        // State
        this.hasSword = false;
        this.facingLeft = false;
        this.baseScale = config.scale;
    }

    update(cursors) {
        if (cursors.left.isDown) {
            this.sprite.body.setVelocityX(-160);
            if (!this.facingLeft) {
                this.sprite.scaleX = -this.baseScale;
                this.facingLeft = true;
            }
        } else if (cursors.right.isDown) {
            this.sprite.body.setVelocityX(160);
            if (this.facingLeft) {
                this.sprite.scaleX = this.baseScale;
                this.facingLeft = false;
            }
        } else {
            this.sprite.body.setVelocityX(0);
        }

        if (cursors.up.isDown && this.sprite.body.touching.down) {
            this.sprite.body.setVelocityY(-330);
        }
    }

    equipSword() {
        this.hasSword = true;
        this.sprite.setTexture('knight_with_sword');
    }

    getSprite() {
        return this.sprite;
    }
} 