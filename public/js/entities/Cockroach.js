export class Cockroach {
    constructor(scene, x, y, config) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'cockroach');
        this.sprite.setScale(config.scale);
        this.sprite.setBounce(config.bounceValue);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setSize(24, 24);
        
        // Movement properties
        this.moveDirection = Math.random() > 0.5 ? 1 : -1;
        this.moveSpeed = config.speed;
        this.lastDirectionChange = 0;
        this.lastJumpTime = 0;
        
        if (this.moveDirection === -1) {
            this.sprite.scaleX = -config.scale;
        }

        // Store reference to this instance on the sprite for collision handling
        this.sprite.cockroachInstance = this;
    }

    update(time) {
        // Change direction every 2 seconds
        if (time > this.lastDirectionChange + 2000) {
            this.moveDirection *= -1;
            this.sprite.scaleX *= -1;
            this.lastDirectionChange = time;
        }

        // 25% chance to jump every 1.5 seconds if on ground
        if (time > this.lastJumpTime + 1500 && this.sprite.body.touching.down) {
            if (Math.random() < 0.25) {
                this.sprite.body.setVelocityY(-250);
                this.lastJumpTime = time;
            }
        }

        // Move horizontally
        this.sprite.body.setVelocityX(this.moveSpeed * this.moveDirection);
    }

    getSprite() {
        return this.sprite;
    }
} 