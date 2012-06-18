/**
 *  @base-item.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: June 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  This is a simple base class which represents an item an actor can pick up. It
 *  keeps track of whether it has been equipped and will not call draw or update in
 *  order to free up resources but still allow the actor to drop it as needed.
 */

ig.module(
    'bootstrap.entities.base-item'
)
    .requires(
    'impact.entity'
)
    .defines(function ()
    {

        EntityBaseItem = ig.Entity.extend({
            _wmIgnore: true,
            checkAgainst:ig.Entity.TYPE.A,
            collides:ig.Entity.COLLIDES.LITE,
            equipable: false,
            equipped: false,
            init:function (x, y, settings)
            {
                this.parent(x, y, settings);
            },
            update: function()
            {
                // Don't call update if this item is equipped
                if(this.equipped)
                    return;

                this.parent();
            },
            draw: function()
            {
                // Don't draw update if this item is equipped
                if(this.equipped)
                    return;

                this.parent();
            },
            check:function (other)
            {
                if(this.equipped)
                    return;

                this.onPickup(other)
            },
            onPickup: function(target)
            {
                if(this.equipable && target.equip)
                {
                    target.equip(this);
                    this.equipped = true;
                }
                else
                {
                    this.kill();
                }
            }
        });

    });
