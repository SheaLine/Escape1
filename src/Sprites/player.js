class Player extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(25, 32)
        this.body.setOffset((this.width - 25)/2, (this.width - 32));
        this.body.setMaxVelocity(scene.MAX_X_VEL, scene.MAX_Y_VEL)
        this.body.setCollideWorldBounds(true)
        this.setDepth(1);
        this.setScale(0.8)

        this.prompt_E = this.scene.add.sprite(this.x, this.y - 30, 'buttons', 87);
        this.prompt_E.visible = true;
        this.prompt_Q = this.scene.add.sprite(this.x, this.y - 30, 'buttons', 85);
        this.prompt_Q.visible = false
        this.prompt_SPACE = this.scene.add.sprite(this.x, this.y - 30, 'space');
        this.prompt_SPACE.visible = false;
        this.prompt_UP = this.scene.add.sprite(this.x, this.y - 30, 'buttons', 438);
        this.prompt_UP.visible = false;
        

        this.boneInHand = false;
        this.shovelInHand = false;
        this.throwDirection = {x: 0, y: 1};

        this.allowMovement = true;

        this.currentVent = null;
        this.inVent = false;
        this.coolDown = false;
        this.canVent = true;

        this.currentLadder = null;
        this.onLadder = false;

        this.hasKeycard = false;
        this.keyInserted = false;

        this.isMoving =  false;

        this.footstepTimer = scene.time.addEvent({
            delay: 300,
            callback: () => {
                if (this.isMoving) {
                    scene.footstepSound.play();
                }
            },
            callbackScope: this,
            loop: true,
            paused: true
        });

        return this;
    }

    update(){
        if (!this.allowMovement) {
            this.body.setVelocityX(0);
            this.body.setAccelerationX(0);
            this.footstepTimer.paused = true;
            this.isMoving = false;
            return;
        }

        if (this.y === 1836){this.y = this.scene.initialPlayerY};
        const isSprinting = this.scene.sprint.isDown;
        const maxVelocityX = isSprinting ? this.scene.SPRINT_MAX_X_VEL : this.scene.MAX_X_VEL;
        const sprintMultiplier = isSprinting ? 2 : 1;

        this.body.setMaxVelocity(maxVelocityX, this.scene.MAX_Y_VEL);
        let isMoving = false;
        if(this.scene.cursors.left.isDown) {
            this.body.setAccelerationX(-this.scene.ACCELERATION * sprintMultiplier);
            if(!this.onLadder){
                this.anims.play(isSprinting ? "runLeft" : "walkLeft", true);
            }
            this.throwDirection = {x: -1, y: -2.5};
            isMoving = true;
        }else if(this.scene.cursors.right.isDown){
            this.body.setAccelerationX(this.scene.ACCELERATION * sprintMultiplier);
            if(!this.onLadder){
                this.anims.play(isSprinting ? "runRight" : "walkRight", true);
            }
            this.throwDirection = {x: 1, y: -2.5};
            isMoving = true;
        }else{
            this.body.setAccelerationX(0)
            this.body.setDragX(this.scene.DRAG)
            if(!this.onLadder){
                this.setTexture('landy', 0);
            }
            this.throwDirection = {x: 0, y: 1};
        }

        this.isMoving = isMoving;

        // Manage footstep sound playback
        if (isMoving) {
            if (this.footstepTimer.paused) {
                this.footstepTimer.paused = false;
                //this.footstepTimer.elapsed = 0;
            }
        } else {
            this.footstepTimer.paused = true;
            this.scene.footstepSound.stop();
            //this.footstepTimer.elapsed = 0;
        }

        if(this.boneInHand){
            this.scene.bone.x = this.x;
            this.scene.bone.y = this.y + 15;
            this.prompt_E.visible = false;
            this.prompt_Q.visible = true;

            if(Phaser.Input.Keyboard.JustDown(this.scene.throw)){
                this.boneInHand = false;
                this.scene.bone.body.allowGravity = true;
                this.scene.bone.setScale(1);
                this.throw(this.scene.bone, 150);
            }
        }

        if(this.shovelInHand && this.scene.npc2.shovel.visible){
            console.log("in hand");
            this.scene.npc2.shovel.x = this.x;
            this.scene.npc2.shovel.y = this.y + 15;
            this.prompt_E.visible = false;

            if(Phaser.Input.Keyboard.JustDown(this.scene.throw)){
                this.shovelInHand = false;
                this.scene.npc2.shovel.body.allowGravity = true;
                this.scene.npc2.shovel.setScale(0.8);
                this.throw(this.scene.npc2.shovel, 150);
                this.prompt_E.visible = false;
                this.prompt_Q.visible = false;
            }
        }

        if(this.prompt_E || this.prompt_Q || this.prompt_SPACE || this.prompt_UP){
            this.prompt_E.x = this.x;
            this.prompt_Q.x = this.x;
            this.prompt_SPACE.x = this.x;
            this.prompt_UP.x = this.x;

            this.prompt_E.y = this.y - 30;
            this.prompt_Q.y = this.y - 30;
            this.prompt_UP.y = this.y - 30;
            this.prompt_SPACE.y = this.y - 30;
            
        }
        if (this.scene.physics.overlap(this.scene.cpu1, this)) {
            if(!this.scene.miniGame1Completed){
                this.prompt_E.visible = true;
            }
        } else if (this.scene.physics.overlap(this.scene.cpu2, this)) {
            if(!this.scene.miniGame2Completed){
                this.prompt_E.visible = true;
            }
        }else if (this.scene.physics.overlap(this.scene.bone, this) && !this.boneInHand){
            this.prompt_E.visible = true;
        }else if (this.scene.physics.overlap(this.scene.npc2.shovel, this) && !this.shovelInHand && this.scene.npc2.shovel.visible){
            this.prompt_E.visible = true;
        }else if (this.scene.physics.overlap(this.scene.keyedDoorDetect, this) && !this.keyInserted){
            this.prompt_E.visible = true;
        }else{
            this.prompt_E.visible = false;
        }

        if (this.scene.physics.overlap(this.scene.npc2, this) && !this.scene.npc2.gaveShovel) {
            if(this.shovelInHand){
                this.prompt_Q.visible = true;
            }
        }else if (this.scene.physics.overlap(this.scene.bone, this) && this.boneInHand){
            this.prompt_Q.visible = true;
        }else{
            this.prompt_Q.visible = false;
        }
        if(this.currentVent != null){
            if(this.checkNonOverlap(this, this.currentVent)){
                this.prompt_SPACE.visible = false;
            }
        }
        if(this.currentLadder != null){
            if(this.checkNonOverlap(this, this.currentLadder)){
                this.prompt_UP.visible = false;
                this.body.allowGravity = true;
                this.onLadder = false;
            }
        }
        
        //stops player from getting stuck around ladders
        if(this.body.blocked.left){
            this.y -= 2;
            this.x -= 1;
        }
        if (this.body.blocked.right){
            this.y -= 2;
            this.x += 1;
        }
    }

    checkBonePickup(){
        //console.log("checking for bone pickup");
        this.prompt_E.visible = true;

        if(this.scene.interact.isDown && !this.boneInHand){
            console.log("PICKUP BONE");
            this.boneInHand = true;
            this.scene.bone.setScale(0.75);
            this.scene.bone.body.allowGravity = false;
        }
    }

    checkShovelPickup(){
        console.log("checking for shovel pickup");
        if(!this.inVent){
            this.prompt_E.visible = true;
        }
    
        if(this.scene.interact.isDown){ //&& !this.shovelInHand
            console.log("PICKUP SHOVEL");
            this.shovelInHand = true;
            this.scene.npc2.shovel.setScale(0.45);
            
        }
    }

    throw(object, hardness){
        console.log("throw dat");
        const direction = this.throwDirection;
        const force = hardness; // so hard
        const velocityX = direction.x * force;
        const velocityY = direction.y * force;
        object.body.setVelocity(velocityX,velocityY);
        object.body.setDragX(75)
    }

    checkVent(){
        if(this.canVent = true){
            this.prompt_SPACE.visible = true;
        }

        if(this.scene.vent.isDown && !this.inVent && !this.coolDown){
            console.log("ventIN");
            this.scene.sound.play("vent");
            this.inVent = true;
            this.body.velocity.y = -300;
            this.prompt_SPACE.visible = false;
            this.prompt_SPACE.y =  this.y + 10;
            this.prompt_SPACE.x = this.currentVent.x
            this.allowMovement = false;
            this.scene.time.delayedCall(300, () => {
                this.visible = false;
                this.prompt_SPACE.visible = true;

                //this.scene.alert.active = false;
                this.scene.playerAndDetects.active = false;
                this.scene.endDetec.active = false;
            });
            
            this.startCooldown();
            return
        }
        if(this.scene.vent.isDown && this.inVent && !this.coolDown){
            console.log("ventOUT");
            //this.scene.alert.active = true;
            this.scene.playerAndDetects.active = true;
            this.scene.endDetec.active = true;
            this.scene.guards.getChildren().forEach(guard =>{ 
                
            });
            this.inVent = false;
            this.body.velocity.y = -300;
            this.visible = true;
            this.allowMovement = true;
            this.prompt_SPACE.y = this.y - 40
            this.prompt_SPACE.x = this.x  
            this.startCooldown();
            return;
        }
    }
    startCooldown() {
        this.coolDown = true;
        this.canVent = false;
        this.scene.time.delayedCall(1000, () => {
            this.canVent = true;
            this.coolDown = false;
        });
    }

    checkLadder(){
        this.onLadder = true;
        this.prompt_UP.visible = true;
        if(this.scene.cursors.up.isDown){
            this.body.velocity.y = -150;
            this.body.allowGravity = false;
        }
        else{
            this.body.velocity.y = 0;
            this.body.allowGravity = true;
        }
    }

    checkMiniGame(){
        if(this.scene.interact.isDown){
            this.scene.startMiniGame1 = true;
        }
    }

    checkMiniGame2(){
        if(this.scene.interact.isDown){
            this.scene.startMiniGame2 = true;
        }
    }
    checkEnterKey(){
        if(this.scene.interact.isDown){
            if(this.hasKeycard && this.scene.npc3Talked && !this.keyInserted){
                this.keyInserted = true;
                this.scene.playerBubble.toggleVisible(0, " I guess I just scan the card here?");
                this.scene.playerBubble.toggleVisible(3000);
            
                this.scene.cell2Open = true;
                let keyDoor = this.scene.getDoorById(4);
                //this.player.prompt_E.visible = false; // fixes icon bug
                this.scene.time.delayedCall(3000, () =>{
                    keyDoor.anims.play("cellOpen");
                    keyDoor.body.checkCollision.none = true;
                    this.scene.playerBubble.toggleVisible(1000, " Yes! One last door\n and I'm out of here!");
                    this.scene.playerBubble.toggleVisible(4000);
                })
            }else if(this.hasKeycard && !this.scene.npc3Talked && !this.keyInserted){
                this.scene.playerBubble.toggleVisible(0, " I wonder if anyone around\n here knows anything\n about this door.");
                this.scene.playerBubble.toggleVisible(3000);
            }
            else if (!this.keyInserted){
                this.scene.playerBubble.toggleVisible(0, " Looks like I need a key card\n for this door.");
                this.scene.playerBubble.toggleVisible(3000);
            }
        }
    }
    checkNonOverlap(spriteA, spriteB) {
        const boundsA = spriteA.getBounds();
        const boundsB = spriteB.getBounds();
        return !Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }
}
