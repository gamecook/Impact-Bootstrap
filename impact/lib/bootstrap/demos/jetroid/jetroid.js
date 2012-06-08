ig.module(
    'bootstrap.demos.jetroid.jetroid'
)
    .requires(
    'bootstrap.demos.jetroid.config', // All of the game's settings
    'bootstrap.demos.demo-harness',
    'bootstrap.demos.jetroid.levels.demo', // Make sure you import all of your levels here
    'bootstrap.demos.jetroid.plugins.meters',
    'bootstrap.demos.jetroid.plugins.stats'
)

    .defines(function ()
    {

        /* Empty module to require all bootstrap plugins */

        MyGame.inject({
            lightMask: new ig.Image('lib/bootstrap/demos/jetroid/media/lighting.png'), //TODO need to move this into the specific game

            init: function()
            {
                this.parent();

                // Setup camera trap and light mask
                this.camera.trap.size.x = ig.system.width / 3;
                this.camera.trap.size.y = ig.system.height / 3;
                this.camera.lightMask = this.lightMask;
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
