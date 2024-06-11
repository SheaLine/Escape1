class NPC1 extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(1.5);
        this.body.allowGravity = false;
        this.flipX = true;
        this.body.setOffset(((this.width - this.body.width)/2) - 40,(this.height - this.body.height)/2)
        this.anims.play("npc1");

        this.prompt_E = this.scene.add.sprite(scene.player.x, scene.player.y - 30, 'buttons', 87);
        this.prompt_E.visible = false
        this.isTalking = false;
    }

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
        //this.prompt_E.visible = true;

        if(this.scene.interact.isDown && !this.isTalking){
            this.isTalking = true;
            this.scene.npc1Bubble.toggleVisible(0, "                  hey!\n You trying to get out of here?\n Well that keycard up there\n is your ticket out!");
            this.scene.npc1Bubble.toggleVisible(5000);
            this.scene.npc1Bubble.toggleVisible(5500, " I over heard the guards saying\nthat you can unlock the door\nthrough the computer system.");
            this.scene.npc1Bubble.toggleVisible(10500);
            this.scene.time.delayedCall(10500,() => {
                this.isTalking = false;
            })
        }
    }
}