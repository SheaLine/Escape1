class Dog extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.flipX = true;
        this.setScale(0.5);
        this.body.setSize(50,36);
        this.setDepth(1);

        this.state = 'sitting';
        scene.time.addEvent({
            delay: 13000,
            callback: () => scene.sound.play("bark"),
            loop: true
        })
        this.speed = 50;
        return this;
    }

    update(){
        if( this.state == 'following'){
            if(this.scene.sprint.isDown){
                this.speed = 100
            }
            else{
                this.speed = 50;
            }
        }
        if(this.scene.player.onLadder || this.body.blocked.up || this.body.blocked.right || this.body.blocked.left){
            this.x = this.scene.player.x;
            this.y = this.scene.player.y;
        }
        switch(this.state){
            case 'sitting':
                this.anims.play("dogSit", true);
                break;
            case 'fetching':
                this.moveTowardsBone();
                break;
            case 'opening':
                this.openDoor();
                break;
            case 'following':
                this.followPlayer();
                break;
        }
    }

    moveTowardsBone(){
        this.scene.physics.moveToObject(this, this.scene.bone, 50);

        if (this.x < this.scene.bone.x) {
            this.flipX = true;
        } else if (this.x > this.scene.bone.x) {
            this.flipX = false;
        }

        if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.bone.x, this.scene.bone.y) > 5) {
            this.body.setVelocityY(0);
            console.log("walking");
            this.anims.play('dogWalk', true);
        }else{
            this.anims.play('dogSit', true);
            this.body.setVelocityX(0);
            this.scene.time.delayedCall(3000, () =>{
                this.scene.bone.destroy();
                this.state = "opening"
            })
        }
    }

    openDoor(){
        let door = this.scene.getDoorById(1);
        this.scene.physics.moveToObject(this, door, 50);

        if (this.flipX == false){this.flipX = true};
        if (Phaser.Math.Distance.Between(this.x, this.y, door.x, door.y) > 36) {
            this.anims.play('dogWalk', true);
            this.body.setVelocityY(0);
        }else{
            console.log("made it");
            this.body.setVelocityX(0);
            this.anims.play('dogOpen', true);
            this.on('animationcomplete', () => {
                this.anims.stop();
                door.anims.play("cellOpen");
                door.body.checkCollision.none = true;
                this.scene.playerFree = true;
                this.scene.playerBubble.toggleVisible(0, " GOOD BOY!");
                this.scene.playerBubble.toggleVisible(2000);
                this.scene.playerBubble.toggleVisible(3000,  " OH! I guess your\ncoming with me now :)\nThe guards can't see me if\n I'm not in the light!");
                this.scene.playerBubble.toggleVisible(8000);
                this.state = 'following';
            })
        }
    }

    followPlayer() {
        this.scene.physics.moveToObject(this, this.scene.player, this.speed);

        if (this.x < this.scene.player.x) {
            this.flipX = true;
        } else if (this.x > this.scene.player.x) {
            this.flipX = false;
        }

        if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) > 50) {
            this.anims.play('dogWalk', true);
        } else {
            this.body.setVelocity(0, 0); // Stop moving when close enough
            this.anims.play('dogSit', true);
        }
    }
}