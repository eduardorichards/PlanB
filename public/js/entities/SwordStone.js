import { ProgressBar } from '../ui/ProgressBar.js';

export class SwordStone {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.add.sprite(x, y, 'sword_stone');
        scene.physics.add.existing(this.sprite, true);
        
        this.progressBar = new ProgressBar(scene, 400, 50);
        this.isNearby = false;
        this.hasSword = false;
        
        // Create success message
        this.messageText = scene.add.text(0, 0, 'You have obtained the sword!', {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4,
            align: 'center'
        });
        this.messageText.setOrigin(0.5);
        this.messageText.setScrollFactor(1);
        this.messageText.setVisible(false);
    }

    handleProximity(player) {
        if (!this.hasSword) {
            this.isNearby = true;
        }
    }

    update(cursors) {
        if (this.isNearby && !this.hasSword && cursors.space.isDown) {
            this.progressBar.show();
            if (this.progressBar.update(0.02)) {
                this.completePull();
                this.scene.player.equipSword();
            }
        } else if (!cursors.space.isDown) {
            this.progressBar.hide();
            this.progressBar.reset();
        }
    }

    completePull() {
        this.hasSword = true;
        this.isNearby = false;
        
        this.messageText.setPosition(this.sprite.x, this.sprite.y - 100);
        this.messageText.setVisible(true);
        this.scene.time.delayedCall(2000, () => {
            this.messageText.setVisible(false);
        });
        
        this.progressBar.hide();
        this.sprite.setTexture('stone');
        
        return true; // Signal to update player sprite
    }

    getSprite() {
        return this.sprite;
    }
} 