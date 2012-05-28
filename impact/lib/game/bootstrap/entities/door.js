/**
 *  @door.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

ig.module(
    'game.bootstrap.entities.door'
)
    .requires(
    'impact.entity',
    'impact.sound',
    'game.bootstrap.entities.core.base-player'
)
    .defines(function ()
    {

        EntityDoor = ig.Entity.extend({
            animSheet:new ig.AnimationSheet('media/door.png', 16, 32),
            size:{x:16, y:32},
            checkAgainst:ig.Entity.TYPE.A,
            zIndex:-1,
            locked:false,
            isClosing:false,
            isOpening:false,
            doorSFX:new ig.Sound('media/sounds/OpenDoor.*'),
            init:function (x, y, settings)
            {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0], true);
                this.addAnim('open', .1, [0, 1, 2, 3, 2, 1, 0], true);
                this.addAnim('locked', 1, [4], true);
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
                this.currentAnim = this.anims.open;
                this.currentAnim.rewind();
                this.doorSFX.play();
            },
            onOpen:function ()
            {
                this.isOpening = false;
            },
            update:function ()
            {
                this.parent();
                if (this.currentAnim == this.anims.open)
                {
                    if (this.currentAnim.loopCount)
                    {
                        if (this.isClosing)
                            this.onClose();
                        if (this.isOpening)
                            this.onOpen()
                    }
                }
            },
            close:function ()
            {
                this.isClosing = true;
                this.currentAnim = this.anims.open;
                this.currentAnim.rewind();
                this.doorSFX.play();
            },
            onClose:function ()
            {
                this.isClosing = false;
            },
            activate:function (value)
            {
                if (!value)
                {
                    this.currentAnim = this.anims.idle;
                } else
                {
                    this.currentAnim = this.anims.locked;
                }
                this.locked = value;
            },
            kill:function ()
            {
                this.parent();
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
                    console.log("Open Door");
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
