class NPC2 extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(1.5);
        this.body.allowGravity = false;
        this.flipX = true;
        this.body.setOffset(((this.width - this.body.width)/2) - 45,(this.height - this.body.height)/2)
        this.anims.play("npc2");

        this.prompt_E = scene.add.sprite(scene.player.x, scene.player.y - 30, 'buttons', 87); // yes I probably shouldn't create a whole new sprite when I can use the existing one in the player class, oh well
        this.prompt_E.visible = false

        this.shovel = scene.physics.add.sprite(51, 1045, 'shovel').setScale(0.8);
        this.shovel.body.allowGravity = false;
        this.shovel.visible = false;
        this.shovel.setDepth(2);

        this.shovelDetector = scene.physics.add.sprite(1551, 1105);
        this.shovelDetector.body.allowGravity = false;
        this.gaveShovel = false;
    }

    update(){
        this.prompt_E.x = this.scene.player.x
        this.prompt_E.y = this.scene.player.y - 30;
        if (this.scene.physics.overlap(this.scene.player, this) && !this.scene.player.shovelInHand && !this.isTalking && !this.gaveShovel) {
                this.prompt_E.visible = true;
        } else {
            this.prompt_E.visible = false;
        }

        if(this.scene.player.inVent && this.scene.player.shovelInHand){
            this.shovel.visible = false;
            this.prompt_E.visible = false;
        }else if(this.scene.player.shovelInHand){
            this.shovel.visible = true;
        }
    }

    checkMessage(){
        if(this.scene.interact.isDown && !this.isTalking){
            this.isTalking = true;
            this.scene.npc2Bubble.toggleVisible(0, " is that you Landissa? I have been\n trying to escape too, but that\n damn guard took my shovel");
            this.scene.npc2Bubble.toggleVisible(5000);
            this.scene.npc2Bubble.toggleVisible(5500, " you think you can go get it\n and bring it to me so\n I can finish my tunnel? I'll\n make it worth your while.");
            this.scene.npc2Bubble.toggleVisible(10500);
            this.shovel.visible = true;
            this.scene.shovelOverlap.active = true;
            this.scene.time.delayedCall(10500,() => {
                this.isTalking = false;
            })

        }
    }

    dig(){
        this.shovel.visible = false;
        this.gaveShovel = true;
        this.shovel.body.checkCollision.none = true;

        this.scene.npc2Bubble.toggleVisible(0, " Thanks Hun!\n Come on in and use my tunnel\n I'll see you on the other side!");
        this.scene.npc2Bubble.toggleVisible(5000);
        this.scene.time.delayedCall(5000, () => {
            this.anims.play("npc2Walk");
            this.flipX = false;
            this.body.velocity.x = 100;
            
        })
        this.scene.time.delayedCall(7000, () => {
            this.scene.softBlocks.forEach(block => block.visible = false);
            let door = this.scene.getDoorById(3);
            door.anims.play("cellOpen");
            door.body.checkCollision.none = true;
        })

    }
}   