class MiniGame2 extends Phaser.Scene{
    constructor(){
        super("miniGame2");

    }

    create(){
        this.maze = this.add.tilemap("maze", 32, 32, 30, 19);

        this.circle = this.physics.add.sprite(this.game.config.width/2 - 225,this.game.config.height/2 - 235, 'circle').setScale(.5);
        this.circle.body.allowGravity = false

        this.walls = this.physics.add.staticGroup();
        this.wall = this.maze.createFromObjects("walls", {
            class: "wall",
            key: "green"
        });
        this.physics.world.enable(this.wall, Phaser.Physics.Arcade.STATIC_BODY);
        this.wall.forEach(wall => {
            this.walls.add(wall);
        })

        let startBorder = this.physics.add.staticSprite(this.game.config.width/2 - 255, this.game.config.height/2 - 235);
        let key = this.physics.add.staticSprite(this.game.config.width/2 + 255, this.game.config.height/2 + 220, "key", 1);

        this.info = this.add.text(this.game.config.width/2, 30, 'Use the arrow keys to pick the lock',
        { 
            fontFamily: "Courier ",
            //fontWeight: '400',
            //fontStyle: 'Normal',
            color:'#00FF41',
            fontSize: '24px'
        }).setOrigin(0.5).setDepth(2);

        this.complete = this.add.text(this.game.config.width/2, this.game.config.height/2, "YOU'RE IN!",
        { 
            fontFamily: 'Courier',
            //fontWeight: '400',
            //fontStyle: 'Normal',
            color:'#00FF41',
            fontSize: '100px'
        }).setOrigin(0.5);
        this.complete.visible = false;
        this.playSound = true;


        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.circle, this.walls);
        this.physics.add.collider(this.circle, startBorder);
        this.physics.add.overlap(this.circle, key, () => {
            this.complete.visible = true;

            if(this.playSound){
                this.sound.play("start")
                this.playSound = false;
            }
            this.info.visible = false;
            this.circle.visible = false;
            key.visible = false;
            this.wall.forEach(wall => {
                wall.visible = false;
            })
            this.time.delayedCall(3000, () => {
                this.scene.start("mainScene", { miniGame2Completed: true })
            });
        });

        this.footstepSound = this.sound.add('click', {
            //loop: true,
            volume: 2
        });

        this.footstepTimer = this.time.addEvent({
            delay: 300,
            callback: () => {
                if (this.isMoving) {
                    this.footstepSound.play();
                }
            },
            callbackScope: this,
            loop: true,
            paused: true
        });

        this.velocity = 125
        this.isMoving = false;
    }

    update() {
        // Handle circle movement
        let isMoving = false;
        if (this.cursors.left.isDown) {
            this.circle.setVelocityX(-this.velocity);
            isMoving = true;
        } else if (this.cursors.right.isDown) {
            this.circle.setVelocityX(this.velocity);
            isMoving = true;
        } else {
            this.circle.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.circle.setVelocityY(-this.velocity);
            isMoving = true;
        } else if (this.cursors.down.isDown) {
            this.circle.setVelocityY(this.velocity);
            isMoving = true;
        } else {
            this.circle.setVelocityY(0);
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
            this.footstepSound.stop();
            //this.footstepTimer.elapsed = 0;
        }
    }
}