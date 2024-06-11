class Title extends Phaser.Scene{
    constructor(){
        super("title");
    }
    create(){
        this.map = this.add.tilemap("title", 32, 32, 30, 19);

        this.tilesetTerrain = this.map.addTilesetImage("phase-2", "grass");

        this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
        this.background.setOrigin(0, 0);
        this.grassLayer = this.map.createLayer("grass", [this.tilesetTerrain], 0,0);

        this.loadFont('FutureMillennium', './assets/FutureMillennium.ttf').then(() => {
            this.add.text(this.game.config.width/2, this.game.config.height/2 + 100, 'Escape 1',
                { 
                    fontFamily: 'FutureMillennium',
                    color:'#FFFFFF',
                    fontSize: '72px'
                }).setOrigin(0.5);
            })
    
            this.add.text(this.game.config.width - 100, this.game.config.height - 30, 'Developer: Shea Line',
                { 
                    fontFamily: 'courier',
                    color:'#FFFFFF',
                    fontSize: '14px'
                }).setOrigin(0.5).setDepth(1);
    
            this.play = this.add.text(this.game.config.width/2, this.game.config.height/2 + 150, 'Click to play!',
                { 
                    fontFamily: 'courier',
                    color:'#FFFFFF',
                    fontSize: '14px'
                }).setOrigin(0.5).setDepth(1);
    
                const graphics = this.add.graphics();
    
                // Set fill color to black and draw a rectangle
                graphics.fillStyle(0xb70000, 1);
                graphics.fillRect(this.play.x - 100, this.play.y - 14, 200, 28);
                graphics.setInteractive(new Phaser.Geom.Rectangle(this.play.x - 100, this.play.y - 14, 200, 28), Phaser.Geom.Rectangle.Contains);
                graphics.on('pointerover', () => {
                    console.log('Mouse is over the box');
                    this.changeColor = true;
                    this.play.setColor('#0000EE');
                });
        
                graphics.on('pointerout', () => {
                    console.log('Mouse is no longer over the box');
                    this.play.setColor('#FFFFFF');
                });
                graphics.on('pointerdown', () => {
                    console.log('Box was clicked');
                    this.scene.stop();
                    this.backgroundMusic.stop();
                    this.sound.play("start")
                    this.scene.start("mainScene", { miniGame1Completed: false });
                    
                });
                this.graphics = graphics;

                this.backgroundMusic = this.footstepSound = this.sound.add('title', {
                    loop: true,
                    volume: 0.5
                });
                this.backgroundMusic.play();
    }

    loadFont(name, url) {
        return new Promise((resolve) => {
            const font = new FontFace(name, `url(${url})`);
            font.load().then((loadedFont) => {
                document.fonts.add(loadedFont);
                resolve();
            });
        });
    }
}