/**
 *  @door.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

ig.module(
    'game.resident-raver.entities.door'
)
    .requires(
    'impact.entity',
    'impact.sound',
    'bootstrap.entities.base-door',
    'bootstrap.entities.base-player'
)
    .defines(function ()
    {
        EntityDoor = EntityBaseDoor.extend({
            _wmIgnore: false,
            animSheet:new ig.AnimationSheet('media/games/resident-raver/images/door.png', 16, 32),
            size:{x:16, y:32},
            doorSFX:new ig.Sound('media/bootstrap/sounds/OpenDoor.*'),
            weapons: 5,
            doorDelay: 10,
            doorDelayTimer:null,
            spawner: null,
            init: function(x, y, settings)
            {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [0], true);
                this.addAnim('open', .1, [0, 1, 2, 3, 2, 1, 0], true);
                this.addAnim('locked', 1, [4], true);

            },
            open: function(value)
            {
                this.parent(value);
                this.currentAnim = this.anims.open;
                this.currentAnim.rewind();
                this.doorSFX.play();
            },
            onOpen: function(value)
            {
                this.parent(value);
                // Randomly pick a weapon
                var wid = Math.floor(Math.random() * this.weapons) + 1;
                this.target.equip(wid);



                //TODO this is probably expensive, we can just reset it
                this.doorDelayTimer = new ig.Timer();
            },
            update: function()
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

                if(this.doorDelayTimer)
                {
                    var timeLeft = Math.round(this.doorDelay - this.doorDelayTimer.delta())
                    if ((this.doorDelayTimer.delta() > this.doorDelay/2) && timeLeft >= 0){
                        ig.game.displayCaption("Exit Door In " + timeLeft,.1);
                    }
                    if (this.doorDelayTimer.delta() > this.doorDelay) {
                        this.target.exitDoor();
                    }
                }
            },
            close:function ()
            {
                this.parent();
                this.currentAnim = this.anims.open;
                this.currentAnim.rewind();
                this.doorSFX.play();
                this.doorDelayTimer = null;
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
                this.parent(value);
            },
            onClose: function()
            {
                this.parent();
                this.kill();
            },
            kill: function()
            {
                this.parent();
                if(this.spawner)
                    this.spawner.removeItem();
            }
        })

    });