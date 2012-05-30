/**
 *  @levelexit.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  This class will render a strip of text which can be used for caption in your
 *  game. This injects the following method displayCaption to your game class.
 *
 *  If you want to display caption text at any time, simply call
 *  ig.game.displayInstructions and pass in the text along with the time it should
 *  show for in seconds
 *
 *  ig.game.displayCaption("Level Up", 3);
 *
 */

ig.module(
    'bootstrap.plugins.impact.caption'
)
    .requires(
    'impact.game',
    'impact.font'
)
    .defines(function ()
    {

        Caption = ig.Class.extend({
            captionDelay:-1,
            captionTimer:null,
            captionText:"",
            captionFont:new ig.Font('media/bootstrap/images/04b03.font.png'),

            init:function (alignment)
            {
                this.captionTimer = new ig.Timer();
            },

            draw:function ()
            {
                //TODO need to support multi-line text
                if (this.captionDelay == -1)
                {
                    return;
                }

                ig.system.context.fillStyle = 'rgba(0,0,0,0.8)';
                ig.system.context.fillRect(0 * ig.system.scale, (ig.system.height - 16) * ig.system.scale, ig.system.width * ig.system.scale, ig.system.height * ig.system.scale);

                var x = ig.system.width / 2,
                    y = ig.system.height - 10;

                this.captionFont.draw(this.captionText, x, y, ig.Font.ALIGN.CENTER);

                if (this.captionTimer.delta() > this.captionDelay)
                {
                    this.captionDelay = -1;
                }
            },
            show:function (value, delay)
            {
                this.captionText = value;
                this.captionDelay = delay;

                console.log("showing", this.captionDelay);

                this.captionTimer.reset();
            },
            hide:function ()
            {
                console.log("hide instructions")
                this.captionDelay = -1;
            }


        });

        ig.Game.inject({
            captionInstance:new Caption(),

            displayCaption:function (value, delay)
            {
                this.captionInstance.show(value, delay);
            },
            hideCaption:function ()
            {
                this.captionInstance.hide();
            },
            draw:function ()
            {
                this.parent();

                if (this.captionInstance.captionDelay > -1)
                {
                    this.captionInstance.draw();
                }
            }
        });

    });
