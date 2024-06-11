class MiniGame1 extends Phaser.Scene{
    constructor(){
        super("miniGame1");
        this.wallCount = 0;
    }

    create(){
        this.walls = this.add.group();
        this.spawn = this.time.addEvent({
            delay: 1000,
            callback: () => {
                let x = Phaser.Math.Between(80, game.config.width - 80);
                let y = Phaser.Math.Between(80, game.config.height - 80); 
                let wall = this.add.sprite(x,y, 'wall').setScale(0.5).setDepth(1);
                this.walls.add(wall);
                wall.setInteractive();

                wall.on('pointerdown', () =>{
                    this.handleWallClick(wall);
                })
            },
            loop: true
        });
        //this.input.on('pointerdown', this.onMouseDown, this);

        this.info = this.add.text(500, 100, 'Click on the icons to break through the firewall',
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
    }

    update(){
        if(this.wallCount === 20){
            
            this.complete.visible = true;
            if(this.playSound){
                this.sound.play("start")
                this.playSound = false;
            }
            this.spawn.remove();
            this.walls.getChildren().forEach(wall => wall.destroy()); 
            this.time.delayedCall(3000, () => {
                this.scene.start("mainScene", { miniGame1Completed: true })
            });
        }
    }

    handleWallClick(wall){
        wall.destroy();
        this.sound.play("click");
        this.info.visible = false;
        this.wallCount++;
       // this.scene.start("mainScene");
    }
}