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
                {
                    this.entityCanOpenDoor(other);
                }
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
                this.target = null;
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
            atDoor:function (door)
            {
                if(this.standing)
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

                    //this.type = ig.Entity.TYPE.NONE;
                    this.collides = ig.Entity.COLLIDES.NONE;

                    if(this.inputFilter.indexOf("open") == -1)
                    {
                        this.inputFilter.push("open");
                        //console.log("Add open to filter", this.inputFilter, this.inputFilter.indexOf("open"));
                    }
                }
            },
            exitDoor:function ()
            {
                if (this.currentDoor)
                {
                    this.currentDoor.close();
                    this.currentDoor = null;
                    this.visible = true;

                    //this.type = ig.Entity.TYPE.A;
                    this.collides = ig.Entity.COLLIDES.ACTIVE;

                    var index = this.inputFilter.indexOf("open");

                    if(index != -1)
                    {
                        this.inputFilter.splice(index, 1);

                        //console.log("remove open from filter", this.inputFilter);

                    }
                }
            },
            openPressed: function(){

                //console.log("isOpening", this.isOpening, "isClosing", this.isClosing);

                if(this.currentDoor)
                {
                    if(this.currentDoor.isOpening || this.currentDoor.isClosing)
                        return;

                    //console.log("Open Down", this.currentDoor);
                    if (this.visible)
                    {

                        this.openDoor();
                    }
                    else
                    {
                        this.exitDoor();
                    }
                }
            },
            openReleased: function(){
                // Does nothing
            },
            update: function()
            {
                // Clear out any current door value

                this.parent();

                this.currentDoor = null;

            }
        })
    });
