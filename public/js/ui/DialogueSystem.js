export class DialogueSystem {
    constructor(scene) {
        this.scene = scene;
        this.active = false;
        this.dialogueLevel = 0;
        
        // Create dialogue box
        this.box = scene.add.rectangle(400, 500, 700, 150, 0x000000, 0.7);
        this.box.setScrollFactor(0);
        this.box.setVisible(false);

        // Create dialogue text
        this.text = scene.add.text(70, 440, '', {
            fontSize: '24px',
            fill: '#ffffff',
            wordWrap: { width: 660 }
        });
        this.text.setScrollFactor(0);
        this.text.setVisible(false);

        // Create options for first level
        this.optionsLevel1 = [
            scene.add.text(100, 500, '1: You are beautiful', {
                fontSize: '20px',
                fill: '#ffff00'
            }),
            scene.add.text(100, 530, '2: Do you need something, my princess?', {
                fontSize: '20px',
                fill: '#ffff00'
            })
        ];

        // Create options for second level
        this.optionsLevel2 = [
            scene.add.text(100, 500, '1: I can buy you things', {
                fontSize: '20px',
                fill: '#ffff00'
            }),
            scene.add.text(100, 530, '2: I saw some cockroaches on the way up here', {
                fontSize: '20px',
                fill: '#ffff00'
            })
        ];

        // Create quest notification
        this.questNotification = scene.add.text(400, 100, 'Kill all cockroaches or the princess will be very upset!', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 16, y: 8 }
        });
        this.questNotification.setOrigin(0.5);
        this.questNotification.setScrollFactor(0);
        this.questNotification.setVisible(false);

        // Hide all options initially
        [...this.optionsLevel1, ...this.optionsLevel2].forEach(text => {
            text.setScrollFactor(0);
            text.setVisible(false);
        });
    }

    startDialogue() {
        this.active = true;
        this.dialogueLevel = 1;
        this.box.setVisible(true);
        this.text.setText("Press 1 or 2 to choose what to say:");
        this.text.setVisible(true);
        this.showCurrentOptions();
    }

    endDialogue() {
        this.active = false;
        this.dialogueLevel = 0;
        this.box.setVisible(false);
        this.text.setVisible(false);
        this.hideAllOptions();
    }

    showCurrentOptions() {
        this.hideAllOptions();
        const currentOptions = this.dialogueLevel === 1 ? this.optionsLevel1 : this.optionsLevel2;
        currentOptions.forEach(option => option.setVisible(true));
    }

    hideAllOptions() {
        [...this.optionsLevel1, ...this.optionsLevel2].forEach(option => option.setVisible(false));
    }

    handleChoice(choice) {
        if (this.dialogueLevel === 1) {
            this.handleFirstLevelChoice(choice);
        } else if (this.dialogueLevel === 2) {
            this.handleSecondLevelChoice(choice);
        }
    }

    handleFirstLevelChoice(choice) {
        switch(choice) {
            case 1:
                this.text.setText("Not interested.");
                this.hideAllOptions();
                this.scene.time.delayedCall(2000, () => this.endDialogue());
                break;
            case 2:
                this.text.setText("Maybe, what can you get me?");
                this.dialogueLevel = 2;
                this.showCurrentOptions();
                break;
        }
    }

    handleSecondLevelChoice(choice) {
        this.hideAllOptions();
        switch(choice) {
            case 1:
                this.text.setText("I hate superficial knights.");
                this.scene.time.delayedCall(2000, () => this.endDialogue());
                break;
            case 2:
                this.text.setText("WHAT?! GET RID OF THEM!");
                this.scene.time.delayedCall(2000, () => {
                    this.text.setText("Straight away Your Highness!");
                    this.scene.time.delayedCall(2000, () => {
                        this.endDialogue();
                        // Show quest notification
                        this.questNotification.setVisible(true);
                        this.scene.time.delayedCall(4000, () => {
                            this.questNotification.setVisible(false);
                        });
                        // Enable cockroach killing
                        if (this.scene.startCockroachQuest) {
                            this.scene.startCockroachQuest();
                        }
                    });
                });
                break;
        }
    }

    isActive() {
        return this.active;
    }
} 