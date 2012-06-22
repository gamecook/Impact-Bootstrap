ig.module(
    'game.menus.menu'
)
    .requires(
    'impact.entity',
    'game.plugins.impact-storage'
)
    .defines(function(){

        EntityPauseMenu = ig.Entity.extend({
            statText:new ig.Font('media/04b03.font.png'),
            init:function (x, y, settings) {
                this.parent(x, y, settings);
                this.addKeyListeners();
            },
            addKeyListeners:function () {

            }
        })

        EntityPauseMenu = EntityPauseMenu.extend({
            stats:null,
            ignorePause:true,
            title:"Pause",
            //TODO need to figure out how to best quit the game
            instructions: !ig.ua.mobile ? "Press Escape To Resume Or Q To Quit." : "Press Anywhere To Resume.",
            draw:function () {
                // Draw all entities and backgroundMaps
                this.parent();
                //if(this.showStats){
                ig.system.context.fillStyle = 'rgba(0,0,0,0.8)';
                ig.system.context.fillRect(0 * ig.system.scale, 0 * ig.system.scale, ig.system.width * ig.system.scale, ig.system.height * ig.system.scale);
                var x = ig.system.width / 2;
                var y = ig.system.height / 2 - 40;
                this.statText.draw(this.title, x, y, ig.Font.ALIGN.CENTER);
                if (this.stats) {
                    this.statText.draw('Time: ' + this.stats.time, x, y + 30, ig.Font.ALIGN.CENTER);
                    this.statText.draw('Kills: ' + this.stats.kills.toString().padString(3), x, y + 40, ig.Font.ALIGN.CENTER);
                    this.statText.draw('Doors: ' + this.stats.doors.toString().padString(3), x, y + 50, ig.Font.ALIGN.CENTER);
                    this.statText.draw('Score: ' + this.stats.score.toString().padString(6), x, y + 60, ig.Font.ALIGN.CENTER);
                }

                this.statText.draw(this.instructions, x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
            }

        })

        EntityGameOverMenu = EntityPauseMenu.extend({
            //TODO need to figure out how to best quit the game
            instructions: !ig.ua.mobile ? "Press Spacebar To Restart Or Q To Quit." : "Press Anywhere To Restart",
            displayHiScore: false,
            init:function (x, y, settings) {
                this.parent(x, y, settings);
                //TODO this should be passed in and not taken from the game class
                this.title = ig.game.deathMessage;
            },
            addKeyListeners:function () {

            },

            draw: function()
            {
                this.parent();
                if(this.displayHiScore)
                {
                    var x = ig.system.width / 2;
                    var y = ig.system.height / 2 - 25;
                    this.statText.draw("New Hi-Score!", x, y, ig.Font.ALIGN.CENTER);
                }
            }

        })
    }
)