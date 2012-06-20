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
            meters: new ig.Image("media/bootstrap/demos/jetroid/images/meters.png"),
            icons: new ig.Image("media/bootstrap/demos/jetroid/images/powerups.png"),
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
            invalidate: true,
            collection: {},
            collectionKey: [],
            draw: function()
            {
                this.drawModal();

                //TODO this should be moved into the utils
                var x = ig.system.width * .5;
                var y = ig.system.height * .5;
                this.menuFont.draw(this.title, x, y - 30, ig.Font.ALIGN.CENTER);
                this.menuFont.draw("Time: "+Math.round(ig.game.levelTimer.delta()), x, y - 10, ig.Font.ALIGN.CENTER);
                this.menuFont.draw("~ Collected Items ~", x, y+10, ig.Font.ALIGN.CENTER);
                //TODO calculate score

                var i;
                var total;

                if(this.invalidate)
                {
                    if(ig.game.player)
                    {
                        var inventory = ig.game.player.equipment;
                        total = inventory.length;

                        //TODO this could be optimized a little better
                        this.collection = {};
                        this.collectionKeys = [];
                        var item;
                        for (i = 0 ; i < total; i++)
                        {
                            item = inventory[i];

                            if(!this.collection[item.name])
                            {
                                this.collection[item.name] = 0;
                                console.log("New Collection", item.name)
                                //TODO need to push in name and value
                                this.collectionKeys.push({name:item.name, value: item.value});
                            }
                            this.collection[item.name] += item.id;
                        }

                        this.invalidate = false;

                        //TODO sort collection keys alphabetically
                        this.collectionKeys.sort();

                        console.log("this.collectionKey", this.collectionKeys);

                    }
                }


                total = this.collectionKeys.length;

                for (i = 0 ; i < total; i++)
                {
                    var name =  this.collectionKeys[i].name;
                    var totalItems =  this.collection[name];
                    //TODO need to come up with a better way to handle the score but this is a good hack for now
                    var points =  totalItems * this.collectionKeys[i].value * (i+1);
                    this.menuFont.draw(name+((totalItems > 1) ? "s" : "")+": "+ points, x, y+(10 * (i+1))+10, ig.Font.ALIGN.CENTER);
                }
            }


        })

    });
