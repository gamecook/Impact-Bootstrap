ig.module(
    'bootstrap.demos.jetroid.plugins.meters'
)
    .requires(
    'impact.image',
    'bootstrap.demos.demo-harness'

)

    .defines(function ()
    {

        /* Empty module to require all bootstrap plugins */

        MyGame.inject({
            meters: new ig.Image("lib/bootstrap/demos/jetroid/media/meters.png"),
            icons: new ig.Image("lib/bootstrap/demos/jetroid/media/powerups.png"),
            meterWidth: 60,
            meterHeight: 9,
            meterPadding: 10,
            meterIconSize: {x: 10, y: 9},
            meterNames: ["health", "power", "air"],
            draw: function()
            {
                this.parent();

                if(this.player && !this.isGameOver)
                {
                    var offset = {x: 10, y: 5};
                    var x = 0;
                    var y = 0;
                    for (var i = 0; i < 3; i++)
                    {
                        var propName = this.meterNames[i];
                        var percent = (this.player[propName]/this.player[propName+"Max"]);

                        //TODO look into ways of making this cleaner
                        if(percent > 1) percent = 1;
                        x = ((this.meterWidth + this.meterPadding) * i) + offset.x;
                        y = offset.y;

                        this.icons.draw(x,y,0,this.meterIconSize.x * i, this.meterIconSize.x, this.meterIconSize.y);

                        x += this.meterIconSize.x + 2;
                        //y += this.meterIconSize.y;

                        //TODO also need to draw icons next to each bar
                        // Draw background
                        this.meters.draw(x,y,0,this.meterHeight * 3, this.meterWidth, this.meterHeight);


                        if(percent > 0)
                            this.meters.draw(x,y,0,this.meterHeight * i, percent * this.meterWidth, this.meterHeight);
                    }
                }
            }

        })

    });
