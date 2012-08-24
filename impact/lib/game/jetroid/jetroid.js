ig.module(
    'game.jetroid.jetroid'
)
    .requires(
    'game.jetroid.config', // All of the game's settings
    'bootstrap.game-harness',
    'game.jetroid.levels.demo', // Make sure you import all of your levels here
    'game.jetroid.plugins.meters',
    'game.jetroid.plugins.stats'
)

    .defines(function ()
    {

        /* Empty module to require all bootstrap plugins */

        MyGame.inject({
            lightMask: new ig.Image('media/games/jetroid/images/lighting.png'), //TODO need to move this into the specific game
            exitedLevel: false,
            showMiniMap: true,
            init: function()
            {
                this.parent();

                // Setup camera trap and light mask
                this.camera.trap.size.x = ig.system.width / 3;
                this.camera.trap.size.y = ig.system.height / 3;
                this.camera.lightMask = this.lightMask;
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
            drawScreen:function ()
            {
                //TODO this should be coming from the config
                var text = !ig.ua.mobile ? 'Press Spacebar To Start!' : 'Press Anywhere To Start!'

                this.instructText.draw("Welcome To Jetroid", ig.system.width * .5, ig.system.height * .5, ig.Font.ALIGN.CENTER);
                this.instructText.draw(text, ig.system.width * .5, ig.system.height * .5 + 10, ig.Font.ALIGN.CENTER);
            }

        })

    });
