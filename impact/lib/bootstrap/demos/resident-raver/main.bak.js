ig.module(
    'game.main'
)
    .requires(
    'impact.game',
    'game.levels.broward',
    'game.levels.bryan',
    'game.levels.cawthon',
    'game.levels.degraff',
    'game.levels.deviney',
    'game.levels.dorms',
    'game.levels.dorman',
    'game.levels.gilchrist',
    'game.levels.kellum',
    'game.levels.landis',
    'game.levels.reynolds',
    'game.levels.salley',
    'game.levels.smith',
    'impact.font',
    'game.plugins.camera',
    // Entities that are dynamically spawned
    'game.entities.door',
    'game.entities.zombie',
    // Remove this when done debugging
    'impact.debug.debug',
    'game.plugins.impact-storage',
    'game.plugins.tracking',
    'game.plugins.string-utils',
    'impact.sound',
    'game.menus.menu'
)

    .defines(function () {

        MyGame = ig.Game.extend({

            gravity:360,
            statText:new ig.Font('media/04b03.font.png'),
            showStats:false,
            levelTimer:new ig.Timer(),
            levelExit:null,
            stats:null,
            lives:0,
            camera:null,
            player:null,
            lifeSprite:new ig.Image('media/life-sprite.png'),
            duration:1,
            strength:3,
            quakeTimer: null,
            quakeRunning: false,
            deathMessage:'You Died',
            sortBy:ig.Game.SORT.Z_INDEX,
            instructionsTimer:null,
            instructionDelay:2,
            instructionsText:"",
            isGameOver:false,
            activeMenu:null,
            buttonDelay:.3,
            buttonDelayTimer:null,
            useWeapons:true,
            playerStartPosition:{x:0, y:0},
            defaultInstructions:'',
            storage:null,
            currentLevelName:"dorms",
            levelCounter:0,
            tracking: null,

            /**
             * Main function
             */
            init:function () {

                //Setup Tracking
                this.tracking = new Tracking(trackingID);

                // Setup Local Storage
                this.storage = this.storage = new ig.Storage();

                // Setup Game Timers
                this.quakeTimer = new ig.Timer();
                this.instructionsTimer = new ig.Timer();
                this.buttonDelayTimer = new ig.Timer();

                // Setup camera
                //Low Resolution
                //this.camera = new Camera((ig.system.width - 256) * .5, ig.system.height / 3, 5);
                this.camera = new Camera(((16*16) - ig.system.width) * .5, ig.system.height / 3, 5);

                // Medium Resolution
                //this.camera = new Camera((ig.system.width - 256) * .5, ig.system.height / 3, 5);

                // High Resolution
                //this.camera = new Camera((ig.system.width - (16*16* 2)) * .5, ig.system.height / 3, 5);

                console.log(ig.system.width, ig.system.width/2, 430, 16*16, 16*16*ig.system.scale);
                this.camera.trap.size.x = 224 * ig.system.scale;
                this.camera.trap.size.y = ig.system.height / 3;
                this.camera.lookAhead.x = 0;//ig.ua.mobile ? ig.system.width / 6 : 0;

                this.loadLevel(LevelDorms);

                //TODO Need to abstract these controls for mobile or desktop
                ig.input.unbindAll();

                if(ig.ua.iOS)
                {
                    // Bind keys
                    ig.input.bindTouch("#buttonLeft", 'left');
                    ig.input.bindTouch("#buttonRight", 'right');
                    ig.input.bindTouch("#buttonJump", 'jump');
                    ig.input.bindTouch("#buttonShoot", 'shoot');
                    ig.input.bindTouch("#canvas", 'continue');
                    ig.input.bind(ig.KEY.Q, 'quit');
                    ig.input.bindTouch("#canvas", 'pause');
                }
                else
                {
                    // Bind keys
                    ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                    ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                    ig.input.bind(ig.KEY.X, 'jump');
                    ig.input.bind(ig.KEY.C, 'shoot');
                    ig.input.bind(ig.KEY.SPACE, 'continue');
                    ig.input.bind(ig.KEY.Q, 'quit');
                    ig.input.bind(ig.KEY.ESC, 'pause');
                }


                // Create Background Music
                ig.music.add('media/sounds/theme.*');
                ig.music.volume = 0.5;
                //ig.music.play();

                // Set game volume
                ig.Sound.volume = 0.5;

            },
            loadLevel:function (data) {

                // Reset Default Values
                this.defaultInstructions = "none";
                this.showStats = true;
                var defaultWeapon = 1;

                this.currentLevel = data;

                var cameraMinY = 0;//this.showStats ? -16 : 0;

                this.stats = {time:0, kills:0, deaths:0, doors:0, ammo:0};
                this.parent(data);

                this.levelCounter++;

                // Track Level
                this.tracking.trackPage("/game/load/level/"+this.currentLevelName);

                // Looks for
                var settings = this.getEntityByName("settings");
                if (settings) {
                    // Set properties supported by game engine if overriden by setting entity
                    if (settings.showStats)
                        this.showStats = settings.showStats == "true" ? true : false;

                    if (settings.defaultInstructions)
                        this.defaultInstructions = settings.defaultInstructions;

                    if (settings.defaultWeapon)
                        defaultWeapon = settings.defaultWeapon;

                    if (settings.cameraMinY)
                        cameraMinY = Number(settings.cameraMinY);

                    //TODO add default weapon settings
                }
                else {
                    // Reset value
                }

                //console.log("showStats", this.showStats, settings.showStats);
                this.player = this.getEntitiesByType(EntityPlayer)[0];
                this.playerStartPosition = {x:this.player.pos.x, y:this.player.pos.y};

                //If there are no stats make sure the player doesn't have a weapon
                if (this.showStats) {
                    //ig.game.stats.ammo = 10;
                    this.player.makeInvincible();

                    //for testing
                    //defaultWeapon = 5;
                    this.player.equip(defaultWeapon, true);
                }

                this.levelTimer.reset();

                this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
                this.camera.min.y = cameraMinY;
                this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
                this.camera.set(this.player);

                if (this.defaultInstructions != "none")
                    this.displayInstructions(this.defaultInstructions, 7);

            },
            update:function () {
                // screen follows the player
                if (this.instructionsTimer.delta() > this.instructionDelay) {
                    this.showInstructionText = false;
                }

                if (this.paused) {
                    // only update some of the entities when paused:
                    for (var i = 0; i < this.entities.length; i++) {
                        if (this.entities[i].ignorePause) {
                            this.entities[i].update();
                        }
                    }

                    if (ig.input.state('quit')) {
                        ig.system.setGame(StartScreen);
                    }
                }
                else {
                    // call update() as normal when not paused
                    this.parent();
                    this.camera.follow(this.player);
                    var delta = this.quakeTimer.delta();
                    if (delta < -0.1) {
                        this.quakeRunning = true;
                        var s = this.strength * Math.pow(-delta / this.duration, 2);
                        if (s > 0.5) {
                            ig.game.screen.x += Math.random().map(0, 1, -s, s);
                            ig.game.screen.y += Math.random().map(0, 1, -s, s);
                        }
                    }
                    else
                    {
                        this.quakeRunning = false;
                    }
                    this.stats.score = (this.stats.doors * 50) + (this.stats.kills * 5);


                }

                //TODO maybe this should be moved into the PauseMenu logic?
                if (ig.input.state('pause') && !this.isGameOver) {

                    if (this.buttonDelayTimer.delta() > this.buttonDelay) {

                        this.togglePause();

                        if (this.paused) {
                            this.showInstructionText = false;
                            //TODO need to save out how much longer instruction text should show before shutting it down
                            this.stats.time = Math.round(this.levelTimer.delta());
                            this.activeMenu = this.spawnEntity(EntityPauseMenu, 30, 10, this.showStats ? {stats:this.stats} : null);

                        } else {
                            //TODO restore instruction text if needed
                            //TODO just need to make sure this correctly resets time.
                            this.levelTimer.set(-this.stats.time);
                        }

                        this.buttonDelayTimer.reset();
                    }
                }

                if (ig.input.state('continue') && this.isGameOver) {
                    this.reloadLevel();
                }

            },
            togglePause:function () {
                this.paused = !this.paused;
                if (!this.paused && this.activeMenu)
                    this.activeMenu.kill();
                //TODO need to make sure anything that gets paused is killed or reactivated here
            },
            displayInstructions:function (value, delay) {
                this.instructionDelay = delay ? delay : 2;
                this.instructionsText = value;
                this.showInstructionText = true;
                this.instructionsTimer.reset();

                //console.log("Display New Text", value);
            },
            draw:function () {
                // Draw all entities and backgroundMaps
                this.parent();
                this.camera.draw();

                /*if (this.showStats && !this.isGameOver) {
                    ig.system.context.fillStyle = 'rgba(0,0,0,0.9)';
                    ig.system.context.fillRect(0 * ig.system.scale, 0 * ig.system.scale, ig.system.width * ig.system.scale, 16 * ig.system.scale);

                    this.statText.draw("Ammo " +  this.stats.ammo.toString().padString(2), 5, 5);
                    this.statText.draw("Doors " + this.stats.doors.toString().padString(3), 50, 5);
                    this.statText.draw("Kills " + this.stats.kills.toString().padString(3), 105, 5);
                    this.statText.draw("Score " + this.stats.score.toString().padString(6), 155, 5);
                }*/

                if (this.showInstructionText) {
                    ig.system.context.fillStyle = 'rgba(0,0,0,0.8)';
                    ig.system.context.fillRect(0 * ig.system.scale, (ig.system.height - 16) * ig.system.scale, ig.system.width * ig.system.scale, ig.system.height * ig.system.scale);

                    var x = ig.system.width / 2,
                        y = ig.system.height - 10;
                    this.statText.draw(this.instructionsText, x, y, ig.Font.ALIGN.CENTER);
                }
            },
            gameOver:function () {
                this.showInstructionText = false;
                this.isGameOver = true;
                this.stats.time = Math.round(this.levelTimer.delta());
                var displayHiScore = false;
                //;

                var levelScoreID = this.currentLevelName+"Score";
                var hiScore = this.storage.getInt(levelScoreID) ? this.storage.getInt(levelScoreID) : 0;

                if(this.stats.score >  hiScore)
                {
                    this.storage.set(levelScoreID, this.stats.score);
                    displayHiScore = true;
                }
                console.log("hi-score", hiScore, this.stats.score, this.storage.getInt(levelScoreID));

                if (this.showStats) {
                    this.paused = true;
                    this.activeMenu = this.spawnEntity(EntityGameOverMenu, 30, 10, this.showStats ? {stats:this.stats, displayHiScore: displayHiScore} : null);

                    // Save Stats
                    this.storage.set("totalScore", this.storage.getInt("totalScore") + this.stats.score);
                    this.storage.set("totalKills", this.storage.getInt("totalKills") + this.stats.kills);
                    this.storage.set("totalDoors", this.storage.getInt("totalDoors") + this.stats.doors);
                    this.storage.set("totalDoors", this.storage.getInt("totalDoors") + this.stats.doors);

                    // Tracking
                    this.tracking.trackPage("/game/over/level/"+this.currentLevelName);
                    this.tracking.trackEvent("game", "over", "level:" + this.currentLevelName + ",score:" + this.stats.score + ",kills" + this.stats.kills + ",doors" + this.stats.doors, null);

                    //Also need to set stats around best for the level
                }
                else {
                    this.respawnPlayer();
                }
            },
            reloadLevel:function () {
                this.isGameOver = false;
                if (this.paused)
                    this.togglePause();
                this.loadLevelDeferred(this.currentLevel);
            },
            respawnPlayer:function () {
                this.player = this.spawnEntity(EntityPlayer, this.playerStartPosition.x, this.playerStartPosition.y);
            },
            shakeScreen:function () {
                //TODO this is to help with performance on mobile
                if (this.quakeRunning) {
                    return;
                }
                this.quakeTimer.set(this.duration);
            },
            setDeathMessage:function (value) {
                this.deathMessage = value;
            }
        });

        StartScreen = ig.Game.extend({
            instructText:new ig.Font('media/04b03.font.png'),
            background:new ig.Image('media/screen-bg.png'),
            mainCharacter:new ig.Image('media/screen-main-character.png'),
            title:new ig.Image('media/game-title.png'),
            storage:null,
            startSFX:new ig.Sound('media/sounds/StartGame.*'),
            tracking: null,

            init:function () {

                // Create tracking
                this.tracking = new Tracking(trackingID);

                this.storage = new ig.Storage();
                //this.resetLocalStorage(); // <- Use this for testing
                // Setup default game values for first time install
                this.setupLocalStorage();

                // Tracking
                this.tracking.trackPage("/game/new-game-screen");


                if(ig.ua.iOS)
                {
                    ig.input.bindTouch("#canvas", "start");
                }
                else
                {
                    ig.input.bind(ig.KEY.SPACE, 'start');
                }

            },
            setupLocalStorage:function () {
                if (!this.storage.isSet("level")) {
                    this.storage.set("level", 1);

                    // Tracking
                    this.tracking.trackEvent("game", "new", "new-install-version:" + version, null);
                }
                //Total Kills
                if (!this.storage.isSet("totalKills"))
                    this.storage.set("totalKills", 0);

                //Total Doors
                if (!this.storage.isSet("totalDoors"))
                    this.storage.set("totalDoors", 0);

                //Total Score
                if (!this.storage.isSet("totalScore"))
                    this.storage.set("totalScore", 0);

                if (!this.storage.isSet("version")) {
                    this.storage.set("version", version);
                }
                else {
                    var oldVer = this.storage.get("version");

                    // Tracking
                    if (oldVer != version)
                        this.tracking.trackEvent("game", "upgrade", oldVer + "->" + version, null);
                }
            },
            resetLocalStorage:function () {
                this.storage.clear();
            },
            update:function () {
                if (ig.input.pressed('start')) {
                    this.startSFX.play();
                    ig.system.setGame(MyGame);
                }
                this.parent();
            },
            draw:function () {
                this.parent();
                this.background.draw(0, 0);
                this.mainCharacter.draw(0, 0);
                this.title.draw(ig.system.width - this.title.width, 0);
                var x = ig.system.width / 2,
                    y = ig.system.height - 10;


                var text = !ig.ua.mobile ? 'Press Spacebar To Start!' : 'Press Anywhere To Start!'

                this.instructText.draw(text, x + 40, y, ig.Font.ALIGN.CENTER);
            }
        });

        /*SplashScreen = ig.Loader.extend({
            logo:new ig.Image('media/game-cook-logo-160x160.png'),
            init:function (gameClass, resources) {
                this.parent(gameClass, resources);
            },
            *//*update:function () {

                this.parent();

                // screen follows the player
                if (this.timer.delta() > this.delay) {
                    ig.system.setGame(StartScreen);
                }
            },*//*
            draw:function () {
                this.logo.draw(0, 0);

                this.parent();
                //TODO need to do background color and center logo


            }
        });*/


        //ig.Sound.enabled = false;

//Setup utils


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
//ig.main( '#canvas', MyGame, 60, 320, 240, 2 );


        if( ig.ua.mobile ) {
            // Disable sound for all mobile devices
            ig.Sound.enabled = false;
        }

        if( ig.ua.iPhone4 ) {
            // The iPhone 4 has more pixels - we'll scale the
            // game up by a factor of 4
            ig.main('#canvas', StartScreen, 60, 240, 160, 4);
        }
        else if( ig.ua.iPhone) {
            ig.main('#canvas', StartScreen, 60, 240, 160, 2);
        }else if( ig.ua.iPad ) {
            ig.main('#canvas', StartScreen, 60, 240, 160, 3);
        }
        else {
            // Desktop browsers
            ig.main('#canvas', StartScreen, 60, 240, 160, 3);
            //ig.$("#controls").hide();

            // Remove touch controls when they are not needed
            var d = document.getElementById('game-container');

            var olddiv = document.getElementById("controls");

            if(olddiv)
                d.removeChild(olddiv);

        }


        // iPhone (low res)
        //ig.main('#canvas', StartScreen , 60, 240, 160, 2);

        // iPhone (high res)
        //ig.main('#canvas', StartScreen , 60, 240, 160, 4);

        // Web
        //ig.main('#canvas', StartScreen , 60, 240, 160, 3);

        // iPad
        //ig.main('#canvas', StartScreen , 60, 256, 192, 4);

        // Win8
        //ig.main('#canvas', StartScreen , 60, 342, 192, 4);

        //Global Constants

        /* Version Meta Data [Should be replaced by ant build */
        var version = "v0.8.0-beta";
        var trackingID = "UA-18884514-9";
    });
