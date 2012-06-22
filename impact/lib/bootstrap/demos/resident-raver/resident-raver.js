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
    'bootstrap.demos.resident-raver.entities.zombie'
    /*'bootstrap.demos.jetroid.plugins.meters',
    'bootstrap.demos.jetroid.plugins.stats'*/
)

    .defines(function ()
    {

        /* Empty module to require all bootstrap plugins */

        MyGame.inject({
            /*lightMask: new ig.Image('media/bootstrap/demos/jetroid/images/lighting.png'), *///TODO need to move this into the specific game
            exitedLevel: false,
            showMiniMap: false,
            gravity:360,
            init: function()
            {
                this.parent();

                // Setup camera trap and light mask
                this.camera.trap.size.x = ig.system.width / 3;
                this.camera.trap.size.y = ig.system.height / 3;
                //this.camera.lightMask = this.lightMask;
            },
            exitLevel: function (data) {
                //Kills player and sets exitedLevel value to true
                this.exitedLevel = true;
                this.player.kill(true);
            },
            onPlayerDeath: function () {
                if (this.exitedLevel) {
                    this.isGameOver = true;
                    this.togglePause(true);
                    // Show the game over menu
                    this.showMenu(new StatMenu("You Left The Level!"));
                    
                } else {
                    this.parent();
                }
            },
            reloadLevel: function () {
                if (this.exitedLevel) {
                    ig.system.setGame(StartScreen);
                } else {
                    this.parent();
                }
            },
            onPause: function(){
                this.parent();
                this.showMiniMap = false;
            },
            onResume: function(){
                this.parent();
                this.showMiniMap = true;
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

    });
