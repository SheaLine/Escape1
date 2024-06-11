class Guard extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x+ 60, y-26, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.allowGravity = true;
        this.setScale(1.6)
        this.setDepth(1);
        this.flipX = true;
        this.body.setSize(15,32);
        this.body.setOffset(((this.width - 15)/2) - 3, ((this.width - 32)/2) + 5);

        this.spawnX = x;
        this.speed = 25;
        this.patrolDistance = 160;
        this.body.velocity.x = -this.speed;
        this.state = 'patrol';
        this.body.allowGravity = false;

        this.detector = scene.physics.add.sprite(this.x - 55, this.y + 15);
        this.detector.body.setSize(76, 16);
        this.detector.body.allowGravity = false;
        this.detector.guard = this;
        

        this.alertSprite = this.scene.add.sprite(this.x, this.y - 35, 'alert');
        this.alertSprite.visible = false;

        this.agroSprite = this.scene.add.sprite(this.x, this.y - 35, 'agro');
        this.agroSprite.visible = false;

        this.lockupCalled = false;

        this.lastPosition = { x: this.x, y: this.y };
        scene.time.addEvent({
            delay: 3000,
            callback: this.checkIfMoved,
            callbackScope: this,
            loop: true
        });

        
    }

    update(){

         //stops guard from getting stuck around ladders and stairs
        if(this.body.blocked.left){
            this.y -= 3;
            this.x -= 3;
            this.scene.time.delayedCall(1500, () => {this.y+= 3;})
        }
        if (this.body.blocked.right){
            this.y -= 3;
            this.x += 3;
            this.scene.time.delayedCall(1500, () => {this.y+= 3;})
        }

        //states: patrol, warned, agro, attack
        switch(this.state){
            case 'patrol':
                this.agroSprite.visible = false;
                this.alertSprite.visible = false;
                //this.scene.playerAndDetects.active = true;
                if (!this.isPausing) {
                    this.anims.play('guardWalk', true);
                    if (this.x <= this.spawnX - this.patrolDistance) {
                        this.patrol(true);
                    } else if (this.x >= this.spawnX + this.patrolDistance) {
                        this.patrol(false);
                    }
                    else{
                        // this.goTospawn();
                    }
                }

                if(this.body.velocity.x === 0){
                    this.anims.play('guardIdle', true);
                }
                break;
            case 'warned':
                console.log("in warned State")
                this.alert();
                break;
            case 'agro':
                console.log("in agro")
                this.agro();
                break;
            case 'attack':
                console.log("in attack")
                if(!this.lockupCalled)
                    console.log("LOCKUP CALLED");
                    this.lockup();
                    this.lockupCalled = true;
                break;
        }

        //update child sprites
        this.detector.x = this.x - 57;
        this.alertSprite.x = this.x;
        this.agroSprite.x = this.x;

        //vent handling
        if(this.scene.player.inVent){
            if(this.state = 'warned'){
                this.state = 'patrol'
                this.isPausing = false;
            }
            // if (this.state = 'agro'){
            //     this.state = 'patrol'
            //     this.isPausing = false;
            // }
        }
        if(this.y < this.scene.player.y){
            this.state = 'patrol';
        }
    }

    patrol(isMovingRight){
        this.body.setVelocity.x = 0;  // Stop movement
        this.isPausing = true;

        this.scene.time.delayedCall(2000, () => {
            this.isPausing = false;
            if (isMovingRight) {
                this.body.velocity.x = this.speed;
                this.flipX = false;
                this.body.setOffset(((this.width - 15)/2) - 3, ((this.width - 32)/2) + 5);
                this.detector.body.setOffset(((this.detector.width - 76)/2) + 100, ((this.detector.width - 16)/2));
            } else {
                this.body.velocity.x = -this.speed;
                this.flipX = true; 
                this.body.setOffset(((this.width - 15)/2) + 3, ((this.width - 32)/2) + 5);
                this.detector.body.setOffset(((this.detector.width - 76)/2), ((this.detector.width - 16)/2));
            }
        });
    }

    alert(){
        this.body.velocity.x = 0;
        console.log("ALERTED");
        this.emotedAlert = true;
        this.alertSprite.visible = true;
        this.anims.play("guardIdle", true);
        
        this.scene.time.delayedCall(2000, () => {
            console.log("moving to player!");
            if(this.state != 'attack' && !this.scene.player.inVent){
                this.state = "agro";
            }
            
        });
    }

    agro(){
        this.alertSprite.visible = false;
        let startMoving = false;
        if(startMoving){
            
        }
        if (this.x < this.scene.player.x) {
            this.flipX = false;
            this.body.setOffset(((this.width - 15)/2) - 3, ((this.width - 32)/2) + 5);
            this.detector.body.setOffset(((this.detector.width - 76)/2) + 100, ((this.detector.width - 16)/2));
        } else if (this.x > this.scene.player.x) {
            this.flipX = true;
            this.body.setOffset(((this.width - 15)/2) + 3, ((this.width - 32)/2) + 5);
            this.detector.body.setOffset(((this.detector.width - 76)/2), ((this.detector.width - 16)/2));
        }
        this.scene.time.delayedCall(2000, () => {
            this.agroSprite.visible = true;
            this.anims.play('guardWalk', true);
            startMoving = true;
            this.moveToX(this, this.scene.player, 50);
            console.log("move towards");
        })
    }

    lockup(){
        console.log('your done');
        this.body.velocity.x = 0;
        this.anims.play("guardIdle");
        

        this.scene.player.body.velocity.x = 0;
        this.scene.player.allowMovement = false;
        this.scene.player.anims.stop();
        this.scene.player.setTexture('landy', 0);
        this.scene.playerBubble.toggleVisible(0, "             NOOOO!!\nDon't put me back there!\n");
        this.scene.ceilingLights.getChildren().forEach(light => {
            this.scene.dog.setPipeline('Light2D');
            this.setPipeline('Light2D');
            this.scene.player.setPipeline('Light2D');
            this.active = false;
            if(light.switch != null){light.switch.remove()};
            light.visible = true;
            light.light.setIntensity(2);
            light.caught();
            light.sirenPlayed = true;
        }, [], this);


        this.scene.time.delayedCall(5000, () => {
            this.scene.siren.stop();
            this.scene.gameRestart = true;
            
        })
    }

    checkIfMoved(){
        if(this.x === this.lastPosition.x){
            console.log("hasn't moved");
            this.body.velocity.x = this.flipX ? -this.speed : this.speed
            if (this.state != 'patrol'){
                this.state = 'patrol';
            }
        }
        else{
            this.lastPosition = {x: this.x}
        }
    }

    moveToX(object, target, speed) {
        this.agroSprite.visible = true;
        // Calculate the difference in X position
        const dx = target.x - object.x;

        // Calculate the angle to the target (just for reference)
        const angle = Math.atan2(0, dx);

        // Calculate the velocity components
        const velocityX = Math.cos(angle) * speed;

        // Set the velocity of the object
        object.body.velocity.x = velocityX;
        object.body.velocity.y; // Ensure the Y velocity is zero
    }

}