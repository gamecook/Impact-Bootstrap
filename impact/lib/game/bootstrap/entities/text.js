/**
 *  @levelexit.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

ig.module(
    'game.bootstrap.entities.text'
)
    .requires(
    'impact.entity',
    'impact.font'
)
    .defines(function ()
    {

        EntityText = ig.Entity.extend({
            font:new ig.Font('media/04b03.font.png'),
            text:"undefined",
            alpha:1,
            alignment:ig.Font.ALIGN.LEFT,
            maxVel:{x:0, y:0},
            zIndex:-1,
            cache:true,
            draw:function ()
            {
                if (this.alpha != 1)
                {
                    ig.system.context.globalAlpha = this.alpha;
                }
                this.parent();
                this.size = {x:this.font.widthForString(this.text), y:8};
                this.font.draw(this.text,
                    Math.round(this.pos.x) - this.offset.x - ig.game.screen.x,
                    Math.round(this.pos.y) - this.offset.y - ig.game.screen.y,
                    this.alignment);
                if (this.alpha != 1)
                {
                    ig.system.context.globalAlpha = 1;
                }
            }
        });

    });

