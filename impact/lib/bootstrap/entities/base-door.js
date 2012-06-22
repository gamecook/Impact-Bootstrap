/**
 *  @door.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

ig.module(
    'bootstrap.entities.base-door'
)
    .requires(
    'impact.entity',
    'impact.sound',
    'bootstrap.entities.base-player'
)
    .defines(function ()
    {

        EntityBaseDoor = ig.Entity.extend({
            _wmIgnore: true,
            checkAgainst:ig.Entity.TYPE.A,
            zIndex:-1,
            locked:false,
            isClosing:false,
            isOpening:false,

            init:function (x, y, settings)
            {
                this.parent(x, y, settings);
                this.activate(this.locked);
            },
            check:function (other)
            {
                if (this.locked || this.isClosing || this.isOpening)
                    return;

                if (other.atDoor && (other.pos.x > (this.pos.x)))
                    this.entityCanOpenDoor(other);

            },
            entityCanOpenDoor:function (other)
            {
                other.atDoor(this);
            },
            receiveDamage:function (value)
            {
                // Do nothing
            },
            open:function (target)
            {
                this.isOpening = true;
                this.target = target;
            },
            onOpen:function ()
            {
                this.isOpening = false;
            },
            close:function ()
            {
                this.isClosing = true;
            },
            onClose:function ()
            {
                this.isClosing = false;
            },
            activate:function (value)
            {
                this.locked = value;
            }
        });

        EntityBasePlayer.inject({
            currentDoor:null,
            update:function ()
            {
                this.parent();

                // Logic for entering doors
                if (ig.input.pressed('open') && this.standing)
                {
                    if (this.currentDoor && this.visible)
                    {
                        this.openDoor();
                    }
                    else
                    {
                        this.exitDoor();
                    }
                }

                this.currentDoor = null;
            },
            atDoor:function (door)
            {
                this.currentDoor = door;
            },
            openDoor:function ()
            {
                if (this.currentDoor)
                {
                    this.currentDoor.open(this);
                    this.visible = false;
                    this.vel.x = this.vel.y = 0;
                    this.accel.x = this.accel.y = 0;
                }
            },
            exitDoor:function ()
            {
                if (this.currentDoor)
                {
                    this.currentDoor.close();
                    this.visible = true;
                }
            }
        })
    });
