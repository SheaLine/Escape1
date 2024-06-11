class Escape extends Phaser.Scene {
    constructor(){
        super("mainScene");
    }

    init(data){

        this.ACCELERATION = 200
        this.MAX_X_VEL = 50
        this.SPRINT_MAX_X_VEL = 150
        this.MAX_Y_VEL = 2000
        this.DRAG = 600    

        this.playerFree = false;

        this.initialPlayerX = 1264; //1264
        this.initialPlayerY = 1799; //1799

        this.gameRestart = false;
        this.lockupCalled = false;
        this.startMiniGame1 = false;
        this.miniGame1Completed = false //make sure to make false after testing
        this.npc3Talked = false;
        this.startMiniGame2 = false;
        this.miniGame2Completed = false
        this.cell1Open = false;
        this.cell2Open = false;
        this.cell3Open = false;

        this.doorCoolDown = false;
        this.door1Open = false;
        this.door2Open = false; 
        this.door3Open = false;
        this.door4Open = false;
        this.door5Open = false;
        this.door6Open = false;

        if( data && data.miniGame1Completed){
            this.miniGame1Completed = data.miniGame1Completed;
        }
        if( data && data.miniGame2Completed){
            this.miniGame2Completed = data.miniGame2Completed;
        }
    }

    create(){
        document.getElementById('description').innerHTML = '<h2>Controls: </h2>Left Cursor: move left <br> Right Cursor: move right <br> Shift: sprint <h2>How To Play: </h2>Escape the prison, the guards can see you when you are under the light!<br><h2>GOOD LUCK!!</h2>';

        //lighting
        this.lights.enable();
        this.lights.setAmbientColor(0x696969); 

        // tiled map
        this.map = this.add.tilemap("map", 32, 32, 50, 58);

        // tilesets
        this.tilesetBackground = this.map.addTilesetImage("sky", "background");
        this.tilesetTerrain = this.map.addTilesetImage("jail", "jail");
        this.tilesetRails = this.map.addTilesetImage("rail", "rails");

        // layers
        this.backgroundLayer = this.map.createLayer("Background", [this.tilesetTerrain, this.tilesetBackground], 0,0);
        this.jailLayer = this.map.createLayer("platforms", [this.tilesetTerrain], 0,0);
        this.railLayer = this.map.createLayer("rails", [this.tilesetRails], 0,0);
        this.barriers = this.map.createLayer("barrier", [this.tilesetTerrain], 0,0);
        this.barriers.visible = false;
        this.backgroundLayer.setPipeline('Light2D');
        this.jailLayer.setPipeline('Light2D');

        this.jailLayer.setCollisionByProperty({ 
            collides: true 
        })
        this.barriers.setCollisionByProperty({ 
            collides: true 
        })

        //audio
        this.siren = this.sound.add('siren');
        this.siren.setSeek(31);
        this.footstepSound = this.sound.add('step', {
            //loop: true,
            volume: 0.3
        });
        this.backgroundMusic = this.sound.add('main', {
            loop: true,
            volume: 0.3
        });
        this.backgroundMusic.play();

        //Map Sprites (decorations)
        let bed = this.add.sprite(1305, 1787, 'stuff', '2.png').setScale(2).setPipeline('Light2D');
        bed.flipX = true;
        let toilet = this.add.sprite(1331, 1810, 'stuff', '4.png').setScale(1.5).setPipeline('Light2D');
        toilet.flipX = true;
        let shelf = this.add.sprite(1200, 1795, 'stuff', '13.png').setScale(1.3).setPipeline('Light2D');
        this.add.sprite(1210, 1788, 'stuff', '12.png').setScale(1.3).setPipeline('Light2D'); // bottle
        this.add.sprite(1200, 1790, 'stuff', '10.png').setScale(1.3).setPipeline('Light2D'); // soap
        this.add.sprite(1240, 1800, 'stuff', '5.png').setScale(1.8).setPipeline('Light2D'); // sink
        this.add.sprite(415, 1565, 'stuff', '17.png').setScale(1.5).setPipeline('Light2D'); // metal detector (no usage)
        this.add.sprite(500, 1590, 'stuff', '24.png').setScale(1.5).setPipeline('Light2D'); // table
        let chair1 = this.add.sprite(720, 1585, 'stuff', '20.png').setScale(1.5).setPipeline('Light2D'); // chair
        chair1.flipX = true;
        let monitor1 = this.add.sprite(990, 1440, 'stuff', '27.png').setScale(1.5).setPipeline('Light2D'); // table
        monitor1.flipX = true;
        this.add.sprite(990, 1460, 'stuff', '24.png').setScale(1.5).setPipeline('Light2D'); // table
        let chair2 = this.add.sprite(990, 1460, 'stuff', '20.png').setScale(1.5).setPipeline('Light2D'); // chair
        chair2.flipX = true;
        this.lights.addLight(990, 1460, 200).setColor(0xffe16a).setIntensity(1.3);
        this.cpu1 = this.physics.add.sprite(990, 1460);
        this.cpu1.body.allowGravity = false;
        this.add.sprite(70, 538, 'stuff', '2.png').setScale(2).setPipeline('Light2D'); //bed
        let shelf2 = this.add.sprite(135, 545, 'stuff', '13.png').setScale(1.3).setPipeline('Light2D');
        this.add.sprite(135, 538, 'stuff', '12.png').setScale(1.3).setPipeline('Light2D'); // bottle
        this.add.sprite(135, 538, 'stuff', '10.png').setScale(1.3).setPipeline('Light2D'); // soap
        this.add.sprite(123, 541, 'stuff', '11.png').setScale(1.3).setPipeline('Light2D'); // bottle
        this.lights.addLight(272, 735, 200).setColor(0xffe16a).setIntensity(1.3);//0xffe16a
        this.lights.addLight(159, 652, 200).setColor(0xffe16a).setIntensity(1.3);//0xffe16a
        this.lights.addLight(62, 652, 200).setColor(0xffe16a).setIntensity(1.3);//0xffe16a
        this.lights.addLight(408, 652, 200).setColor(0xffe16a).setIntensity(1.3);//0xffe16a

        
        let monitor2 = this.add.sprite(272, 735, 'stuff', '27.png').setScale(1.5).setPipeline('Light2D'); // table
        monitor2.flipX = true;
        this.add.sprite(272, 757, 'stuff', '24.png').setScale(1.5).setPipeline('Light2D'); // table
        let chair3 = this.add.sprite(272, 757, 'stuff', '20.png').setScale(1.5).setPipeline('Light2D'); // chair
        chair3.flipX = true;
        this.cpu2 = this.physics.add.sprite(272, 735);
        this.cpu2.body.allowGravity = false;

        //keycard door
        this.keyedDoorDetect = this.physics.add.staticSprite(354, 748);

        //Win detector
        this.winDetec = this.physics.add.staticSprite(274, 5);
        this.winDetec.setSize(32,4)


        // ceiling lights (interactive)
        this.ceilingLight = this.map.createFromObjects("objects", {
            name: "light",
            key: "light",
        });
        this.ceilingLights = this.add.group();
        this.physics.world.enable(this.ceilingLight, Phaser.Physics.Arcade.STATIC_BODY);
        this.ceilingLight.forEach(light => {
            light.setPipeline('Light2D');
            light.setDepth(2);
            let lightCone = new Light(this, light.x + 5.4, light.y + 71, 'cone', );
            this.ceilingLights.add(lightCone);
        })

        // ceiling lights (NON interactive)
        this.ceilingLight = this.map.createFromObjects("objects", {
            name: "light2",
            key: "light",
        });
        this.physics.world.enable(this.ceilingLight, Phaser.Physics.Arcade.STATIC_BODY);
        this.light2s = [];
        this.ceilingLight.forEach(light => {
            let light2 = this.lights.addLight(light.x,light.y, 200).setColor(0xffe16a).setIntensity(1.3);//0xffe16a
            this.light2s.push(light2);
            //light.setPipeline('Light2D');
        })
        // guards
        const guardObjects = this.map.getObjectLayer('objects').objects.filter(obj => obj.name === 'guard');
        this.guards = this.add.group();
        guardObjects.forEach(guard => {
            let newGuard = new Guard(this, guard.x, guard.y, 'guard', 0);
            this.guards.add(newGuard);
        })

        //put the detectors in a group
        this.guardDetectors = this.add.group();
        this.guards.getChildren().forEach(guard => {
            this.guardDetectors.add(guard.detector);
        });

        // vents
        this.vents = this.map.createFromObjects("objects", {
            name: "vent",
            key: "stuff",
            frame: "30.png"
        });
        this.physics.world.enable(this.vents, Phaser.Physics.Arcade.STATIC_BODY);
        this.ventsGroup = this.add.group();
        this.vents.forEach(vent => {
            this.ventsGroup.add(vent);
            vent.setScale(2.5);
            vent.x -= 32;
            vent.body.x -= 32;
            vent.y += 5;
            vent.body.y -= 10;
        })

        //stairs
        this.stair = this.map.createFromObjects("stair", {
            name: "stair",
        });
        this.physics.world.enable(this.stair, Phaser.Physics.Arcade.STATIC_BODY);
        this.stairGroup = this.add.group();
        this.stair.forEach(stair => {
            this.stairGroup.add(stair);
            stair.visible = false;
            
        })

        // stage doors
        this.doors = this.map.createFromObjects("objects", {
            name: "door1",
            key: "door",
            frame: 0
        });
        this.physics.world.enable(this.doors, Phaser.Physics.Arcade.STATIC_BODY);
        this.doorGroup = this.add.group(this.doors);

        // jail doors
        this.barDoors = this.map.createFromObjects("objects", {
            name: "door2",
            key: "barDoor",
            frame: 0
        });
        this.physics.world.enable(this.barDoors, Phaser.Physics.Arcade.STATIC_BODY);
        this.jailDoorGroup = this.add.group(this.barDoors);
        let landyDoor = this.getDoorById(1);
        landyDoor.flipX = true;
        this.barDoors.forEach(door => {
            door.setPipeline('Light2D');  // Apply the Light2D pipeline to each door
        });
        // ladders
        this.ladders = this.map.createFromObjects("objects", {
            name: "ladder",
            key: "ladder",
            frame: 0
        });
        this.physics.world.enable(this.ladders, Phaser.Physics.Arcade.STATIC_BODY);
        this.ladderGroup = this.add.group()
        this.ladders.forEach(ladder => {
            ladder.setPipeline('Light2D');  // Apply the Light2D pipeline to each door
            this.ladderGroup.add(ladder);

            if(ladder.getData('invisible')){
                ladder.visible = false;
            }
        });

        

        // digables
        this.softBlocks = this.map.createFromObjects("objects", {
            name: "soft",
            key: "jailSheet",
            frame: 4
        });
        this.softBlocks.forEach(block => block.setPipeline('Light2D'))

        // keyCard
        this.keyCard = this.map.createFromObjects("objects", {
            name: "keyCard",
            key: "keyCard",
            frame: 0
        });
        this.physics.world.enable(this.keyCard, Phaser.Physics.Arcade.STATIC_BODY);
        this.keyCardGroup = this.add.group();
        this.keyCard.forEach(key => {
            key.anims.play("keyCard");
            this.keyCardGroup.add(key);
            key.y += 15;
            key.body.y += 15;
        })

        //Dog Bone
        this.bone = this.physics.add.sprite(1175, 1820, "bone");
        this.bone.setAngle(90);
        this.bone.body.setSize(25,10);
        this.bone.body.setOffset(((this.bone.width - 25)/2) + 1, (this.bone.height - 10)/2);
        this.bone.setDepth(2);
        this.boneDetector = this.physics.add.sprite(1115, 1817);
        this.boneDetector.body.allowGravity = false;
        this.boneDetector.body.setSize(76,16);
        this.boneDetector.body.setOffset(((this.boneDetector.width - 76)/2) - 20,(this.bone.height - 16)/2);

        //keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.sprint = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.throw = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.vent = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // gravity and physics
        this.physics.world.gravity.y = 2000
        this.physics.world.bounds.setTo(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        //player
        this.player = new Player(this, this.initialPlayerX, this.initialPlayerY, 'landy', 0);

        //dog
        this.dog = new Dog(this, 1045, 1815, 'dog', 'test-4.png');

        //NPC1
        this.npc1 = new NPC1 (this, 700, 1575, 'NPC1', 'Idle-0.png');

        //NPC2
        this.npc2 = new NPC2 (this, 1551, 1095, 'NPC2', 'Idle-0.png' )

        //NPC3
        this.npc3 = new NPC3 (this, 78, 552, 'NPC3', 'Idle-0.png');

        //camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25) // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(2);

        //colliders
        this.physics.add.collider(this.player, this.jailLayer);
        this.physics.add.collider(this.player, this.barriers);
        this.physics.add.collider(this.guards, this.jailLayer);
        this.physics.add.collider(this.bone, this.jailLayer);
        this.physics.add.collider(this.npc2.shovel, this.jailLayer);
        this.physics.add.collider(this.npc2.shovel, this.barriers);
        this.physics.add.collider(this.dog, this.jailLayer);
        //* DONT FORGET TO ADD JAIL DOORS BACK AFTER TESTING
        this.physics.add.collider(this.player, this.jailDoorGroup); 
        this.physics.add.overlap(this.player, this.bone, () => {
            this.player.checkBonePickup();
        }, null, this);
        this.physics.add.overlap(this.boneDetector, this.bone, () => this.dog.state = 'fetching', null, this);

        // definitly make a function to find closest guard in future
        this.alert = this.physics.add.overlap(this.player, this.ceilingLights, () => {
            //console.log("guard warned");
            let nearestGuard = null;
            let smallestDistance = Number.MAX_SAFE_INTEGER;
            this.guards.getChildren().forEach(guard => {
                const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, guard.x, guard.y);
                if(distance < game.config.width/2 && distance < smallestDistance){
                    nearestGuard = guard;
                    smallestDistance = distance;
                }
            });
            if(nearestGuard && nearestGuard.state == 'patrol' && !this.player.inVent){
                nearestGuard.state = 'warned';
            }
        }, null, this);
        this.alert.active = false;

        this.playerAndDetects = this.physics.add.overlap(this.player, this.guardDetectors, (player, guardDetector) => {
            if(guardDetector.guard.state == 'patrol' && !this.player.inVent){//guardDetector.guard.state != 'agro' || guardDetector.guard.state != 'attack'){
                guardDetector.guard.state = 'warned';
            }
        }, null, this);
        this.endDetec = this.physics.add.overlap(this.player, this.guards, (player, guard) => { if(!this.player.inVent){guard.state = 'attack'}});
        
        this.physics.add.overlap(this.player, this.ventsGroup, (player, vent) =>  {
            console.log(`player hit vent at ${vent.x}, ${vent.y}`)
            this.player.checkVent();
            this.player.currentVent = vent;
        });

        this.physics.add.overlap(this.player, this.ladderGroup, (player, ladder) =>  {
            this.player.checkLadder();
            this.player.currentLadder = ladder;
            this.player.setTexture('landy', 3);
        });

        this.physics.add.overlap(this.player, this.npc1, () =>  {
            this.npc1.checkMessage();
        });

        this.physics.add.overlap(this.player, this.npc2, () =>  {
            this.npc2.checkMessage();
        });

        this.physics.add.overlap(this.player, this.npc3, () =>  {
            this.npc3.checkMessage();
        });

        this.physics.add.overlap(this.player, this.keyedDoorDetect, () =>  {
                this.player.checkEnterKey();
        });

        this.physics.add.overlap(this.player, this.keyCardGroup, (player, key) =>  {
            key.destroy();
            this.player.hasKeycard = true;
            this.playerBubble.toggleVisible(0, " Sweet! Looks like a guard\n left their key card I'll need\n this later!");
            this.playerBubble.toggleVisible(5000)
        });

        this.physics.add.overlap(this.player, this.doorGroup, (player, door) =>  {
            this.handleDoor(door);
        });

        this.physics.add.collider(this.player, this.stairGroup, (player, stair) => {
            console.log("overlap");
            if (this.player.body.blocked.right && this.player.y < stair.y) {
                player.y -= 3;
                player.body.y -= 3;
                player.x += 3;
                player.body.x += 3;
            }
            if (this.player.body.blocked.left && this.player.y < stair.y) {
                console.log("ran dat");
                player.y -= 3;
                player.body.y -= 3;
                player.x -= 3;
                player.body.x -= 3;
            }

        }, null, this);

        this.physics.add.overlap(this.player, this.cpu1, () =>  {
            if(!this.miniGame1Completed ){
                this.player.checkMiniGame();
            }
        });

        this.physics.add.overlap(this.player, this.cpu2, () =>  {
            if(!this.miniGame2Completed ){
                this.player.checkMiniGame2();
            }
        });

        this.shovelOverlap = this.physics.add.overlap(this.player, this.npc2.shovel, () =>  {
            this.player.checkShovelPickup();
        });
        this.shovelOverlap.active = false;

        this.physics.add.overlap(this.npc2.shovelDetector, this.npc2.shovel, () =>  {
            this.npc2.dig();
        });

        this.physics.add.overlap(this.winDetec, this.player, () =>  {
            this.player.allowMovement = false;
            this.player.body.setCollideWorldBounds(false);
            this.player.body.velocity.y = (-50);
            this.time.delayedCall(1000, () => {
                this.backgroundMusic.stop();
                this.scene.start("won");
            })
        });
        
        // thought bubbles
        this.bubbles = this.add.group();
        this.playerBubble = new Bubble(this, this.player.x, this.player.y - 40,'thought', 0, this.player, " I can't stand this terrible place\n anymore! I didn't even do\n anything wrong. I must escape\n ...but how???");
        this.bubbles.add(this.playerBubble);
        this.playerBubble.toggleVisible(5000);

        this.npc1Bubble = new Bubble(this, this.npc1.x, this.npc1.y - 26, 'thought', 0, this.npc1, "");
        this.bubbles.add(this.npc1Bubble);
        this.npc1Bubble.toggleVisible(0);

        this.npc2Bubble = new Bubble(this, this.npc2.x, this.npc2.y - 26, 'thought', 0, this.npc2, "");
        this.bubbles.add(this.npc2Bubble);
        this.npc2Bubble.toggleVisible(0);

        this.npc3Bubble = new Bubble(this, this.npc3.x, this.npc3.y - 26, 'thought', 0, this.npc3, "");
        this.bubbles.add(this.npc3Bubble);
        this.npc3Bubble.toggleVisible(0);

        if(this.miniGame1Completed || this.miniGame2Completed){
            this.restoreState(); // restores state of game if just came from another scene
        }
    }

    update(){
        console.log(`player X: ${this.player.x}, player Y: ${this.player.y}`);
        // check for game restart
        if(this.gameRestart){
            console.log("restart")
            this.backgroundMusic.stop();
            this.scene.stop();
            this.scene.start("mainScene", { miniGame1Completed: false });

        }

        // check for miniGame 1 Start
        if(this.startMiniGame1){
            this.saveState();
            this.backgroundMusic.stop();
            this.scene.start("miniGame1")
        }

        // check for miniGame 2 Start
        if(this.startMiniGame2){
            this.saveState();
            this.backgroundMusic.stop();
            this.scene.start("miniGame2")
        }

        // check for miniGame 1 Complete
        if(this.miniGame1Completed && !this.cell1Open){
            console.log("open the door");
            this.cell1Open = true;
            let keyDoor = this.getDoorById(2);
            this.panCameraToObject(keyDoor, 3000, 1000);
            this.player.prompt_E.visible = false; // fixes icon bug
            this.time.delayedCall(3000, () =>{
                keyDoor.anims.play("cellOpen");
                keyDoor.body.checkCollision.none = true;
            })
        }

        // check for miniGame 2 Complete
        if(this.miniGame2Completed && !this.cell3Open){
            console.log("FINAL DOOR");
            this.cell3Open = true;
            let keyDoor = this.getDoorById(5);
            this.player.prompt_E.visible = false; // fixes icon bug
            this.time.delayedCall(1500, () =>{
                keyDoor.anims.play("cellOpen");
                keyDoor.body.checkCollision.none = true;
            })
        }

        // door animation update
        if (!this.physics.overlap(this.player, this.doorGroup)) {
            this.doorGroup.getChildren().forEach(door => {
                if(this.door1Open){
                    door.anims.play("doorClose");
                    this.door1Open = false
                }
                if(this.door2Open){
                    door.anims.play("doorClose");
                    this.door2Open = false
                }
                if(this.door3Open){
                    door.anims.play("doorClose");
                    this.door1Open = false
                }
                if(this.door4Open){
                    door.anims.play("doorClose");
                    this.door2Open = false
                }
            })
        }

        // Sprite updates
        this.player.update();
        this.dog.update();
        this.npc1.update();
        this.npc2.update();
        this.npc3.update();
        this.bubbles.getChildren().forEach(bubble => bubble.update());
        this.ceilingLights.getChildren().forEach(light => light.update());
        this.guards.getChildren().forEach(guard => guard.update());
        
        
    }

    getDoorById(id) {
        return this.barDoors.find(door => door.getData('id') === id);
    }

    getStageDoorById(id) {
        return this.doors.find(door => door.getData('id') === id);
    }

    panCameraToObject(target, panDuration, holdDuration) {
        // Stop camera follow
        this.cameras.main.stopFollow();
        this.player.allowMovement = false       

        // Pan to the target object
        this.cameras.main.pan(target.x, target.y, panDuration, 'Power2');

        // After the pan is complete, hold for the specified duration and then pan back
        this.time.delayedCall(panDuration, () => {
            this.time.delayedCall(holdDuration, () => {
                // Pan back to the player
                this.cameras.main.pan(this.player.x, this.player.y, panDuration, 'Power2');

                // After the pan back is complete, follow the player again
                this.time.delayedCall(panDuration, () => {
                    this.cameras.main.startFollow(this.player);
                    this.player.allowMovement = true;
                });
            });
        });
    }

    handleDoor(door){ // extremely inefficient door setup (def a better way, but will do for now)
        let doorExit = null;
        if(door.getData('id') === 1){
            doorExit = this.getStageDoorById(2);
            console.log("DOOR1")
            if(!this.door1Open){
                door.anims.play("doorOpen");
                this.door1Open = true;
            }
            this.time.delayedCall(1000, () => {
                if(!this.doorCoolDown){
                    this.player.x = doorExit.x;
                    this.player.y = doorExit.y;
                    this.doorCooldown(door)
                }
            })
        }else if(door.getData('id') === 2){
            doorExit = this.getStageDoorById(1);
            console.log("DOOR2")
            if(!this.door2Open){
                door.anims.play("doorOpen");
                this.door2Open = true;
            }
            this.time.delayedCall(1000, () => {
                if(!this.doorCoolDown){
                    this.player.x = doorExit.x;
                    this.player.y = doorExit.y;
                    this.doorCooldown(door)
                }
            })
        }else if(door.getData('id') === 3){
            doorExit = this.getStageDoorById(4);
            console.log("DOOR3")
            if(!this.door3Open){
                door.anims.play("doorOpen");
                this.door3Open = true;
            }
            this.time.delayedCall(1000, () => {
                if(!this.doorCoolDown){
                    this.player.x = doorExit.x;
                    this.player.y = doorExit.y;
                    this.doorCooldown(door)
                }
            })
        }else if(door.getData('id') === 4){
            doorExit = this.getStageDoorById(3);
            console.log("DOOR4")
            if(!this.door4Open){
                door.anims.play("doorOpen");
                this.door4Open = true;
            }
            this.time.delayedCall(1000, () => {
                if(!this.doorCoolDown){
                    this.player.x = doorExit.x;
                    this.player.y = doorExit.y;
                    this.doorCooldown(door)
                }
            })
        }else if(door.getData('id') === 5){
            doorExit = this.getStageDoorById(6);
            console.log("DOOR5")
            if(!this.door5Open){
                door.anims.play("doorOpen");
                this.door5Open = true;
            }
            this.time.delayedCall(1000, () => {
                if(!this.doorCoolDown){
                    this.player.x = doorExit.x;
                    this.player.y = doorExit.y;
                    this.doorCooldown(door)
                }
            })
        }else if(door.getData('id') === 6){
            doorExit = this.getStageDoorById(5);
            console.log("DOOR6")
            if(!this.door6Open){
                door.anims.play("doorOpen");
                this.door6Open = true;
            }
            this.time.delayedCall(1000, () => {
                if(!this.doorCoolDown){
                    this.player.x = doorExit.x;
                    this.player.y = doorExit.y;
                    this.doorCooldown(door)
                }
            })
        }else{
            console.log("DOOR_ID_ERROR");
        }
    }

    doorCooldown(door) {
        this.doorCoolDown = true;
        door.body.checkCollision.none = true;
        this.time.delayedCall(5000, () => {
            this.doorCoolDown = false;
            door.body.checkCollision.none = false;
        });
    }

    saveState(){
        this.sceneState = {
            playerX: this.player.x,
            playerY: this.player.y,
            dogX: this.dog.x,
            dogY: this.dog.y,
            dogState: this.dog.state,
            free: this.playerFree,
            npc3: this.npc3Talked,
            cell1: this.cell1Open,
            cell2: this.cell2Open,
            cell3: this.cell3Open,

            playerBubble: this.playerBubble,
        }
    }

    restoreState(){
        if(this.sceneState){
            this.player.setPosition(this.sceneState.playerX, this.sceneState.playerY);
            this.dog.setPosition(this.sceneState.dogX, this.sceneState.dogY);
            this.dog.state = this.sceneState.dogState;
            this.playerFree = this.sceneState.free;
            this.playerBubble.toggleVisible(0);
            this.npc3Talked = this.sceneState.npc3;
            this.cell1Open = this.sceneState.cell1;
            this.cell2Open = this.sceneState.cell2;
            this.cell3Open = this.sceneState.cell3;
        }
    }
}