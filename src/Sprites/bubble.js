class Bubble extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, target, message){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.target = target;
        this.message = message;
        this.initBubble();
        this.setDepth(10);
    }
    update(){
        // move with player
        this.x = this.target.x;
        this.y = this.target.y - 20;

        this.text.setText(this.message);       
        this.text.setPosition(this.x, this.y - this.height / 2 ); // Adjust text position within the bubble
        //this.text.setMessageOrgin(,)
    }

    initBubble(){
        // Set the origin of the bubble sprite to center
        this.setOrigin(0.5, 1);

        // Add text to the bubble
        this.text = this.scene.add.text(0, 0, this.message, { 
            font: '64px Arial', 
            fill: '#000000',
            resolution: 2
        });
        this.text.setOrigin(0.5, 0.6);
        this.text.setScale(.1)
        this.text.setDepth(11)
        
    }
    
    toggleVisible(time, newMessage){
        this.scene.time.addEvent({
            delay: time,
            callback: () => {
                if(newMessage){
                    this.setMessage(newMessage);
                    this.visible = true;
                }
                else{
                    this.setMessage("");
                    this.visible = false;
                }
            }
        })
    }
    setMessage(string){
        this.message = string;
    }
    setMessageOrgin(x,y){
        this.text.setOrigin(x, y);
    }

    destroyBubble(time){
        this.scene.time.addEvent({
            delay: time,
            callback: () => {
                this.text.destroy();
                this.destroy();
            }
        })
        
    }
    
}