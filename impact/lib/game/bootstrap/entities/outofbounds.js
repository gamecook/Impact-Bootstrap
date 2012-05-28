/**
 *  @levelexit.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  This entity is useful for pits or areas off screen where you need to
 *  instantlt kill
 */

ig.module(
    'game.bootstrap.entities.outofbounds'
)
    .requires(
    'impact.entity'
)
    .defines(function ()
    {

        EntityOutofbounds = ig.Entity.extend({
            size:{x:16, y:16},
            _wmScalable:true,
            _wmDrawBox:true,
            _wmBoxColor:'rgba(196, 255, 0, 0.7)',
            type:ig.Entity.TYPE.NONE,
            checkAgainst:ig.Entity.TYPE.BOTH,
            collides:ig.Entity.COLLIDES.NEVER,

            init:function (x, y, settings)
            {
                if (settings.checks)
                {
                    this.checkAgainst = ig.Entity.TYPE[settings.checks.toUpperCase()] || ig.Entity.TYPE.A;
                    delete settings.check;
                }
                this.parent(x, y, settings);
            },
            check:function (other)
            {
                if (other.outOfBounds)
                    other.outOfBounds();
            },
            update:function ()
            {
            }
        });

        //TODO make sure this didn't break anything in the base actor class
        ig.Entity.inject({
            outOfBounds: function()
            {
                this.kill();
            }
        })

    });