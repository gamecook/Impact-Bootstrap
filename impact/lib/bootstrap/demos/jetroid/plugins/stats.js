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
                this.menuFont.draw("Time: "+Math.round(ig.game.levelTimer.delta()), x, y, ig.Font.ALIGN.CENTER);
                //this.menuFont.draw("Collected Items: "+total, x, y+(10 * i), ig.Font.ALIGN.CENTER);
                //TODO calculate score

                if(this.invalidate)
                {
                    if(ig.game.player)
                    {
                        var inventory = ig.game.player.equipment;
                        var total = inventory.length;



                        //TODO this could be optimized a little better
                        this.collection = {};
                        this.collectionKeys = [];
                        var item;
                        var i;
                        for (i = 0 ; i < total; i++)
                        {
                            item = inventory[i];

                            if(!this.collection[item.name])
                            {
                                this.collection[item.name] = 0;
                                console.log("New Collection", item.name)
                                //TODO need to push in name and value
                                this.collectionKeys.push(item.name);
                            }
                            this.collection[item.name] += item.id;
                        }

                        this.invalidate = false;

                        console.log("collection", this.collection)

                        //TODO sort collection keys alphabetically

                        this.collectionKey.sort();


                    }
                }



                for (var i = 0 ; i < this.collectionKeys.length; i++)
                {
                    var name =  this.collectionKeys[i];
                    var total =  this.collection[this.collectionKeys[i]];
                    //TODO need to come up with a better way to handle the score but this is a good hack for now
                    var points =  total * 100 * (i+1);
                    this.menuFont.draw(total + " " +name+((total > 1) ? "s" : "")+": "+ points, x, y+(10 * (i+1)), ig.Font.ALIGN.CENTER);
                }
            }


        })

    });
