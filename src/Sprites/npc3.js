class NPC3 extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(1.5);
        this.body.allowGravity = false;
        this.flipX = false;
        this.body.setOffset(((this.width - this.body.width)/2) + 76,(this.height - this.body.height)/2)
        this.anims.play("npc3");

        this.prompt_E = this.scene.add.sprite(scene.player.x, scene.player.y - 30, 'buttons', 87);
        this.prompt_E.visible = false;
    }

    
    //* need to add npc3 bubbles, 
    //* then need to add keyCard logic

    update(){
        // interact prompt
        this.prompt_E.x = this.scene.player.x
        this.prompt_E.y = this.scene.player.y - 30;
        if (this.scene.physics.overlap(this.scene.player, this) && !this.isTalking) {
            this.prompt_E.visible = true;
        } else {
            this.prompt_E.visible = false;
        }
    }

    checkMessage(){
        console.log("overlap");
        this.prompt_E.visible = true;

        if(this.scene.interact.isDown && !this.isTalking){
            this.isTalking = true;
            this.scene.npc3Bubble.toggleVisible(0, " You are almost out, can't say\n I'm not jelous, but one less\n person in here is always good!");
            this.scene.npc3Bubble.toggleVisible(5000, " I think the door to get to the\n roof is right below me, but you\n need a key card to get into\n the computer room to open it.");
            this.scene.npc3Bubble.toggleVisible(10000, "Did you happen to find one\n on your journey up here?");
            this.scene.npc3Bubble.toggleVisible(15000);
            this.scene.npc3Talked = true;
            this.scene.time.delayedCall(15000,() => {
                this.isTalking = false;
            })
        }
    }
}