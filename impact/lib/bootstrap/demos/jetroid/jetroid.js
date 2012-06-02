ig.module(
    'bootstrap.demos.jetroid.jetroid'
)
    .requires(
    'bootstrap.demos.jetroid.config', // All of the game's settings
    'bootstrap.demos.demo-harness',
    'bootstrap.demos.jetroid.levels.demo' // Make sure you import all of your levels here
)

    .defines(function ()
    {

        /* Empty module to require all bootstrap plugins */

    });
