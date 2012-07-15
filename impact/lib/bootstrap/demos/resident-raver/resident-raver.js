ig.module(
    'bootstrap.demos.resident-raver.resident-raver'
)
    .requires(
    'bootstrap.demos.resident-raver.config', // All of the game's settings
    'bootstrap.demos.demo-harness',
    'bootstrap.demos.resident-raver.levels.broward',
    'bootstrap.demos.resident-raver.levels.bryan',
    'bootstrap.demos.resident-raver.levels.cawthon',
    'bootstrap.demos.resident-raver.levels.degraff',
    'bootstrap.demos.resident-raver.levels.deviney',
    'bootstrap.demos.resident-raver.levels.dorman',
    'bootstrap.demos.resident-raver.levels.dorms',
    'bootstrap.demos.resident-raver.levels.gilchrist',
    'bootstrap.demos.resident-raver.levels.kellum',
    'bootstrap.demos.resident-raver.levels.landis',
    'bootstrap.demos.resident-raver.levels.reynolds',
    'bootstrap.demos.resident-raver.levels.salley',
    'bootstrap.demos.resident-raver.levels.smith',
    'bootstrap.demos.resident-raver.entities.zombie', // Need to import zombies since we dynamically spawn them
    'bootstrap.demos.resident-raver.plugins.stats',
    'bootstrap.demos.resident-raver.plugins.local-storage'
)

    .defines(function ()
    {

        /* Empty module to require all bootstrap plugins */

        MyGame.inject({
            /*lightMask: new ig.Image('media/bootstrap/demos/jetroid/images/lighting.png'), *///TODO need to move this into the specific game
            exitedLevel: false,
            gravity:360,
            currentLevelName:"dorms",
            levelCounter:0,
            showStats: true,
            cameraOffsetY: 0,
            init: function()
            {
                this.parent();


                // Setup camera trap and light mask

                //this.camera.lightMask = this.lightMask;
            },
            configureCamera: function()
            {
                //console.log("Configure Camera");
                this.camera.debug = false;
                this.camera.trap.size.x = Math.round(224 * ig.system.scale);
                this.camera.trap.size.y = Math.round(ig.system.height / 3);
                //this.camera.offset.x = 0;
                var cameraMinY = 0;//this.showStats ? -16 : 0;
                this.camera.min.x = 8;
                this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
                //TODO need a way to reset this
                this.camera.min.y = this.cameraOffsetY;
                this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;

                console.log("camera", this.camera.pos, this.camera.offset);
            },
            loadLevel:function (data)
            {
                if(this.light)
                    ig.game.lightManager.removeLight(this.light);

                // Reset Default Values
                this.defaultInstructions = "none";
                this.showStats = true;
                var defaultWeapon = 1;

                this.currentLevel = data;

                var cameraMinY = 0;//this.showStats ? -16 : 0;

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

                //If there are no stats make sure the player doesn't have a weapon
                if (this.showStats) {
                    //ig.game.stats.ammo = 10;
                    this.player.makeInvincible();

                    //for testing
                    //defaultWeapon = 5;
                    this.player.equip(defaultWeapon, true);
                }

            },
            exitLevel: function (data) {
                //Kills player and sets exitedLevel value to true
                this.exitedLevel = true;
                this.player.kill(true);
            },
            reloadLevel: function () {
                if (this.exitedLevel) {
                    ig.system.setGame(StartScreen);
                } else {
                    this.parent();
                }
            },
            onPause: function(){
                this.stats.score = (this.stats.doors * 50) + (this.stats.kills * 5);
                this.parent();

                console.log("camera", this.camera.pos, this.camera.offset);
            },
            showDeathMessage: function()
            {
                // Show the game over menu
                this.showMenu(new StatMenu("Game Over!"));
                this.parent();
            }
        })

        StartScreen.inject({
            instructText:new ig.Font('media/bootstrap/images/04b03.font.png'),
            background:new ig.Image('media/bootstrap/demos/resident-raver/images/screen-bg.png'),
            mainCharacter:new ig.Image('media/bootstrap/demos/resident-raver/images/screen-main-character.png'),
            title:new ig.Image('media/bootstrap/demos/resident-raver/images/game-title.png'),
            drawScreen:function ()
            {
                this.background.draw(0, 0);
                this.mainCharacter.draw(0, 0);
                this.title.draw(ig.system.width - this.title.width, 0);
                var x = ig.system.width / 2,
                    y = ig.system.height - 10;


                var text = !ig.ua.mobile ? 'Press Spacebar To Start!' : 'Press Anywhere To Start!'

                this.instructText.draw(text, x + 40, y, ig.Font.ALIGN.CENTER);
            }

        })

        /*Camera = ig.Class.inject({
            currentLookAhead:{x:0, y:0},
            set:function (entity) {
                this.pos.x = this.offset.x;
                //this.pos.y = entity.pos.y - this.offset.y;
                this.trap.pos.x = entity.pos.x - this.trap.size.x / 2;
                this.trap.pos.y = entity.pos.y - this.trap.size.y;
            }
        });*/

    });
