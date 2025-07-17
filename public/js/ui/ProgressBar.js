export class ProgressBar {
    constructor(scene, x, y) {
        this.container = scene.add.container(x, y);
        this.background = scene.add.rectangle(0, 0, 200, 20, 0x000000);
        this.bar = scene.add.rectangle(-100, 0, 0, 16, 0xffd700);
        
        this.container.add([this.background, this.bar]);
        this.container.setScrollFactor(0);
        this.container.setVisible(false);
        
        this.progress = 0;
    }

    show() {
        this.container.setVisible(true);
    }

    hide() {
        this.container.setVisible(false);
        this.progress = 0;
        this.bar.width = 0;
    }

    reset() {
        this.progress = 0;
        this.bar.width = 0;
    }

    update(increment) {
        this.progress += increment;
        this.bar.width = Math.min(this.progress * 200, 200);
        return this.progress >= 1;
    }
} 