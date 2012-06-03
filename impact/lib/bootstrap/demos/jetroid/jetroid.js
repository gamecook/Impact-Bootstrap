ig.module(
    'bootstrap.demos.jetroid.jetroid'
)
    .requires(
    'bootstrap.demos.jetroid.config', // All of the game's settings
    'bootstrap.demos.demo-harness',
    'bootstrap.demos.jetroid.levels.demo', // Make sure you import all of your levels here
    'bootstrap.demos.jetroid.plugins.meters'
)

    .defines(function ()
    {

        /* Empty module to require all bootstrap plugins */

        MyGame.inject({

            loadLevel: function(data)
            {
                this.parent(data);
            }

        })

    });
