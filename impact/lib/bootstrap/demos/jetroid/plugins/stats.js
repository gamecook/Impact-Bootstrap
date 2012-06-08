ig.module(
    'bootstrap.demos.jetroid.plugins.stats'
)
    .requires(
    'impact.font',
    'bootstrap.demos.demo-harness',
    'bootstrap.plugins.impact.menu'

)

    .defines(function ()
    {

        /* Empty module to require all bootstrap plugins */

        MyGame.inject({
            meters: new ig.Image("lib/bootstrap/demos/jetroid/media/meters.png"),
            icons: new ig.Image("lib/bootstrap/demos/jetroid/media/powerups.png"),
            meterWidth: 60,
            meterHeight: 9,
            meterPadding: 5,
            meterIconSize: {x: 10, y: 9},
            meterNames: ["health", "energy", "air"],
            onShowPauseMenu: function()
            {
                this.showMenu(new StatMenu("Pause"));
            }

        })

        StatMenu = Menu.extend({
            draw: function()
            {
                this.drawModal();

                //TODO this should be moved into the utils
                var x = ig.system.width * .5;
                var y = ig.system.height * .5;
                this.menuFont.draw("Paused", x, y - 30, ig.Font.ALIGN.CENTER);
                this.menuFont.draw("Time: "+Math.round(ig.game.levelTimer.delta()), x, y, ig.Font.ALIGN.CENTER);

                //TODO calculate score

                if(ig.game.player)
                this.menuFont.draw("Collected Items: "+ig.game.player.equipment.length, x, y+10, ig.Font.ALIGN.CENTER);

            }


        })

    });
