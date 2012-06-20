/**
 *  @teleporter.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: June 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  This is a simple teleporter class to move the player to other parts of
 *  the map..
 */

ig.module(
    'bootstrap.demos.jetroid.entities.teleporter'
)
    .requires(
    'impact.entity'
)
    .defines(function ()
    {

        EntityTeleporter = ig.Entity.extend({
            _wmIgnore: false,
            _wmDrawBox:true,
            _wmBoxColor:'rgba(128, 28, 230, 0.7)',
            _wmScalable:true,
            size:{x:16, y:16},
            checkAgainst:ig.Entity.TYPE.A,
            target:null,
            targets:[],
            debug: true,
            init:function (x, y, settings)
            {
                this.parent(x, y, settings);
                this.targets = ig.ksort(this.target);
            },
            check:function (other)
            {
                var newTarget = ig.game.getEntityByName(this.targets.random());

                if(newTarget)
                {
                    this.onTeleport(other, newTarget.pos.x, newTarget.pos.y);
                }
            },
            onTeleport: function(target, x, y)
            {
                target.pos.x = x;
                target.pos.y = y;
            },
            draw: function()
            {
                if (this.debug)
                {
                    ig.system.context.fillStyle = 'rgba(255,0,255,0.3)';
                    ig.system.context.fillRect(ig.system.getDrawPos( this.pos.x ), ig.system.getDrawPos( this.pos.y ), this.size.x, this.size.y);
                }
            }
        });

    });
