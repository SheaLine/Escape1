class Load extends Phaser.Scene {
    constructor(){
        super("loadScene");
    }

    preload(){
        this.load.setPath("./assets/");
        
        // Load tilemap
        this.load.image("jail", "map/jailTiles.png");
        this.load.spritesheet("jailSheet", "map/jailTiles.png", { frameWidth: 32, frameHeight: 32 });
        this.load.image("background", "map/Background.png");
        this.load.image("rails", "map/rails.png");
        this.load.spritesheet("ladder", "map/ladderSheet.png", { frameWidth: 20, frameHeight: 32 });
        this.load.spritesheet("keyCard", "map/Card.png", { frameWidth: 24, frameHeight: 24 });
        this.load.spritesheet("door", "map/Door1.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("barDoor", "map/Door2.png", { frameWidth: 32, frameHeight: 64});
        this.load.tilemapTiledJSON("map", "map/map.tmj");

        // Load Map Sprites
        this.load.atlas("stuff", "map/stuff.png", "map/stuff.json");
        this.load.image("bone", "Bone.png");
        this.load.image("light", "map/8.png");
        this.load.image("cone", "map/cone.png");
        this.load.image("shovel", "shovel.png");

        //UX
        this.load.spritesheet("buttons", "tilemap_white_packed.png", { frameWidth: 16, frameHeight: 16});
        this.load.image("thought", "emote__.png");
        this.load.image("alert", "emote_exclamation.png")
        this.load.image("agro", "emote_faceAngry.png")
        this.load.image("space", "space.png");
        this.load.image("spaceGrey", "spaceGrey.png");

        // Load characters
        this.load.spritesheet('landy', "landy sprite sheet.png", { frameWidth: 50, frameHeight: 50});
        this.load.atlas('dog', 'dog.png', 'dog.json');
        this.load.atlas('guard', 'guard/guard.png', 'guard/guard.json');
        this.load.atlas('guardWalk', 'guard/guardWalk.png', 'guard/guardWalk.json');
        this.load.atlas('NPC1', 'NPCs/npc1.png', 'NPCs/npc1.json');
        this.load.atlas('NPC2', 'NPCs/npc2.png', 'NPCs/npc2.json');
        this.load.atlas('NPC2_walk', 'NPCs/npc2Walk.png', 'NPCs/npc2Walk.json');
        this.load.atlas('NPC3', 'NPCs/npc3.png', 'NPCs/npc3.json');

        //mini Game 1
        this.load.image('wall', 'brick_wall-red.png');

        //mini Game 2
        this.load.tilemapTiledJSON('maze', 'map/miniGame2.tmj')       
        this.load.image('circle', "circle.png");
        this.load.image('green', '00ff41.png')
        this.load.spritesheet('key', 'KeyIcons.png', { frameWidth: 32, frameHeight: 32})

        //title screens
        this.load.tilemapTiledJSON("title", 'map/title.tmj');
        this.load.image("grass", 'map/phase-2.png')


        

        //sounds
        this.load.audio("bark", 'sounds/Dog Bark 3.wav')
        this.load.audio("vent", "sounds/FX262.wav");
        this.load.audio("siren", "sounds/siren.mp3");
        this.load.audio("step", "sounds/footstep_concrete_000.ogg");
        this.load.audio("escaped", "sounds/joyful_jungle_bpm140.ogg");
        this.load.audio("title", "sounds/main.ogg");
        this.load.audio("main", "sounds/Horror.mp3");
        this.load.audio('start', "sounds/start.ogg");
        this.load.audio('click', "sounds/zipclick.ogg");
        

        //fonts
        this.load.text('font', 'WESTM.TTF');

    }
    create(){
        this.anims.create({
            key: 'walkLeft',
            frames: [
                { key: 'landy', frame: 11 },
                { key: 'landy', frame: 10 },
                { key: 'landy', frame: 9 },
                { key: 'landy', frame: 8 }
            ],
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'walkRight',
            frames: this.anims.generateFrameNumbers('landy', { start: 4, end: 7 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'runLeft',
            frames: [
                { key: 'landy', frame: 11 },
                { key: 'landy', frame: 10 },
                { key: 'landy', frame: 9 },
                { key: 'landy', frame: 8 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'runRight',
            frames: this.anims.generateFrameNumbers('landy', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'dogSit',
            frames:[
                { key: 'dog', frame: "test-4.png" },
                { key: 'dog', frame: "test-5.png" },
                { key: 'dog', frame: "test-6.png" },
                { key: 'dog', frame: "test-7.png" }
            ],
            duration: 10000,
            repeat: -1
        });

        this.anims.create({
            key: 'dogWalk',
            frames:[
                { key: 'dog', frame: "test-8.png" },
                { key: 'dog', frame: "test-9.png" },
                { key: 'dog', frame: "test-10.png" },
                { key: 'dog', frame: "test-11.png" },
                { key: 'dog', frame: "test-12.png" },
                { key: 'dog', frame: "test-13.png" },
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'dogRun',
            frames:[
                { key: 'dog', frame: "test-8.png" },
                { key: 'dog', frame: "test-9.png" },
                { key: 'dog', frame: "test-10.png" },
                { key: 'dog', frame: "test-11.png" },
                { key: 'dog', frame: "test-12.png" },
                { key: 'dog', frame: "test-13.png" },
            ],
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'dogOpen',
            frames:[
                { key: 'dog', frame: "test-7.png" },
                { key: 'dog', frame: "test-3.png" },
                { key: 'dog', frame: "test-2.png" },
            ],
            duration: 2000,
            repeat: 0
        });

        this.anims.create({
            key: 'cellOpen',
            frames: this.anims.generateFrameNumbers('barDoor', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'guardIdle',
            frames:[
                { key: 'guard', frame: "Idle-0.png" },
                { key: 'guard', frame: "Idle-1.png" },
                { key: 'guard', frame: "Idle-2.png" },
                { key: 'guard', frame: "Idle-3.png" },
            ],
            duration: 2000,
            repeat: -1
        });

        this.anims.create({
            key: 'guardWalk',
            frames:[
                { key: 'guardWalk', frame: "guardWalk-0.png" },
                { key: 'guardWalk', frame: "guardWalk-1.png" },
                { key: 'guardWalk', frame: "guardWalk-2.png" },
                { key: 'guardWalk', frame: "guardWalk-3.png" },
                { key: 'guardWalk', frame: "guardWalk-4.png" },
                { key: 'guardWalk', frame: "guardWalk-5.png" },
            ],
            frameRate: 7,
            repeat: -1
        });

        this.anims.create({
            key: 'space',
            frames:[
                {frame: "space" },
                {frame: "spaceGrey" },
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'npc1',
            frames:[
                { key: 'NPC1', frame: "Idle-0.png" },
                { key: 'NPC1', frame: "Idle-1.png" },
                { key: 'NPC1', frame: "Idle-2.png" },
                { key: 'NPC1', frame: "Idle-3.png" },
            ],
            duration: 5000,
            repeat: -1
        });

        this.anims.create({
            key: 'npc2',
            frames:[
                { key: 'NPC2', frame: "Idle-0.png" },
                { key: 'NPC2', frame: "Idle-1.png" },
                { key: 'NPC2', frame: "Idle-2.png" },
                { key: 'NPC2', frame: "Idle-3.png" },
            ],
            duration: 5000,
            repeat: -1
        });

        this.anims.create({
            key: 'npc2Walk',
            frames:[
                { key: 'NPC2_walk', frame: "Walk-0.png" },
                { key: 'NPC2_walk', frame: "Walk-1.png" },
                { key: 'NPC2_walk', frame: "Walk-2.png" },
                { key: 'NPC2_walk', frame: "Walk-3.png" },
                { key: 'NPC2_walk', frame: "Walk-4.png" },
                { key: 'NPC2_walk', frame: "Walk-5.png" },
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'npc3',
            frames:[
                { key: 'NPC3', frame: "Idle-0.png" },
                { key: 'NPC3', frame: "Idle-1.png" },
                { key: 'NPC3', frame: "Idle-2.png" },
                { key: 'NPC3', frame: "Idle-3.png" },
            ],
            duration: 5000,
            repeat: -1
        });

        this.anims.create({
            key: 'keyCard',
            frames: this.anims.generateFrameNumbers('keyCard', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'doorOpen',
            frames: this.anims.generateFrameNumbers('door', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'doorClose',
            frames:[
                { key: 'door', frame: 5},
                { key: 'door', frame: 4},
                { key: 'door', frame: 3},
                { key: 'door', frame: 2},
                { key: 'door', frame: 1},
                { key: 'door', frame: 0},
            ],
            frameRate: 10,
            repeat: 0
        });

        this.scene.start("title");
    }
}