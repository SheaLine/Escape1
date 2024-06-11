class Light extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture){
        super(scene,x,y,texture)
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.intensity = 1.3;
        this.light = scene.lights.addLight(x,y, 200).setColor(0xffe16a).setIntensity(this.intensity);//0xffe16a

        this.setAlpha(1);
        this.setScale(0.1);
        this.setDepth(1);
        this.setPipeline('Light2D');
        this.setTint(0xffe16a)

        this.body.allowGravity = false;
        this.body.setSize(1000, 1460)
        this.body.setOffset(((this.width - 1000)/2) - 30, ((this.width - 1460)/2));

        this.initToggle = false;
        this.lightON = true;

        this.colors = [0x2500E0, 0x4A53E1, 0xF6F8F7, 0xFF6170, 0xE31E33];
        this.currentColorIndex = 0;
        this.sirenPlayed = false;
        this.switch = null;
        
    }

    update(){
        if(this.scene.playerFree && !this.initToggle){
            this.switch = this.scene.time.addEvent({
                delay: 3000,
                callback: () => this.toggleLight(),
                callbackScope: this,
                loop: true
            })
            this.initToggle = true;
        }
    }

    toggleLight() {
        if (this.light.intensity > 0) {
            this.light.setIntensity(0);
            this.lightON = false;
            this.visible = false;
            this.scene.alert.active = false;
        } else{
            this.light.setIntensity(1.3);
            this.lightON = true;
            this.visible = true;
            this.scene.alert.active = true;
        }
    }

    caught(){
        if(this.sirenPlayed){
            return;
        }
        this.scene.siren.play() //sound
        this.scene.lights.setAmbientColor(0x000000);
        this.siren = this.scene.time.addEvent({
            delay: 200,
            callback: () =>{
                this.light.setColor(this.colors[this.currentColorIndex])
                this.setTint(this.colors[this.currentColorIndex])
                this.scene.light2s.forEach(light2 => {
                    light2.setColor(this.colors[this.currentColorIndex]);
                });
                this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
            },
            loop: true
        })
    }

    // stopCollision(){
    //     this.scene.alert.active = false;
    // }
    // startCollision(){
    //     this.body.checkCollision = true;
    // }
}