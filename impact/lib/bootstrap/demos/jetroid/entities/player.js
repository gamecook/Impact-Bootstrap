ig.module(
    'bootstrap.demos.jetroid.entities.player'
)
    .requires(
    'bootstrap.entities.base-player',
    'impact.sound'
)
    .defines(function () {
        EntityPlayer = EntityBasePlayer.extend({
            _wmIgnore: false,
            animSheet:new ig.AnimationSheet('lib/bootstrap/demos/jetroid/media/player.png', 16, 16),
            size:{x:8, y:14},
            offset:{x:4, y:2},
            emptySFX:new ig.Sound('media/bootstrap/sounds/Empty.*'),
            jumpSFX:new ig.Sound('media/bootstrap/sounds/Jump.*'),
            deathSFX:new ig.Sound('media/bootstrap/sounds/Death.*'),
            fallOutOfBoundsSFX:new ig.Sound('media/bootstrap/sounds/PlayerMonsterFall.*'),
            powerUpSFX:new ig.Sound('media/bootstrap/sounds/PowerUp.*'),
            powerUp2SFX:new ig.Sound('media/bootstrap/sounds/PowerUp2.*'),
            idleAnimationTimer: new ig.Timer(),
            idleAnimationDelay: 4,

            powerMax: 100,
            power: 0,
            powerTimer:null,
            powerDelay:.07,
            powerDownRate: 2,
            powerRechargeRate: 1,

            airMax: 10,
            air: 0,
            airTimer:null,
            airDelay:1,
            airDownRate: 1,

            powerTimer: new ig.Timer(),
            airTimer: new ig.Timer(),

            healthMax: 10,
            health: 10,

            fallDistance: 0,
            maxFallDistance: 10000,

            bounciness: 0.2,

            init:function (x, y, settings)
            {
                this.parent(x, y, settings);
                this.setupAnimation();

                this.power = this.powerMax;
                this.air = this.airMax;
            },
            setupAnimation:function (offset) {
                this.addAnim('idle', 1, [0]);
                this.addAnim('waiting',.05, [0,1,2,3,4,5,6,7,8,9,0], true);
                this.addAnim('run', .07, [10, 11, 12, 13, 14, 15, 16]);
                this.addAnim('jump', .07, [18, 19, 20]);
                this.addAnim('jumpEmpty', 1, [21]);
                this.addAnim('fall', 1, [21]);
            },
            onDeathAnimation:function () {
                this.parent();
                this.deathSFX.play();
            },
            outOfBounds:function () {
                this.fallOutOfBoundsSFX.play();
                this.parent();
            },
            updateAnimation: function()
            {
                //TODO break this down into smaller method calls and move into mob class
                // set the current animation, based on the player's speed
                if (this.vel.y < 0) {
                    this.currentAnim = this.anims.jump;
                    //TODO this needs to be cleaned up since fallDistance is reset
                    this.fallDistance = 0;
                } else if (this.vel.y > 0) {
                    this.currentAnim = this.anims.fall;
                    this.fallDistance += this.vel.y;
                } else if (this.vel.x != 0 && this.standing) {
                    this.currentAnim = this.anims.run;
                    this.fallDistance = 0;
                } else {

                    this.fallDistance = 0;

                    if(this.currentAnim != this.anims.waiting)
                    {
                        this.currentAnim = this.anims.idle;
                    }

                    if(this.idleAnimationTimer.delta() > this.idleAnimationDelay)
                    {
                        this.currentAnim = this.anims.waiting;
                        this.currentAnim.rewind();
                        this.idleAnimationTimer.reset();
                    }
                }
            },
            update: function()
            {

                this.parent();

                if( this.powerTimer.delta() > this.powerDelay ) {
                    //TODO maybe this can be cleaned up?
                    if(ig.input.state("jump"))
                    {
                        if(this.power > 0)
                            this.power -= this.powerDownRate;
                    }
                    else
                    {
                        if(this.power <= this.powerMax)
                            this.power += this.powerRechargeRate;
                    }

                    this.powerTimer.reset();
                }

                if( this.airTimer.delta() > this.airDelay ) {
                    if(this.air > 0)
                        this.air -= this.powerDownRate;
                    else
                        this.receiveDamage(1);

                    this.airTimer.reset();
                }


                   // console.log("IDLE", this.idleAnimationTimer.delta());
            },
            draw: function()
            {
                this.parent();
            },
            jumpDown:function ()
            {
                if(this.power > 0)
                {
                    this.vel.y -= 9;
                    this.fallDistance -= this.vel.y;
                }
                else
                {
                    ig.game.displayCaption("Out Of Energy", 1);
                    //TODO need to show animation out of energy?
                }



            },
            rightDown:function ()
            {
                var accel = this.standing ? this.accelGround : this.accelAir;

                this.accel.x = accel;
                this.flip = false;
            },
            rightReleased:function ()
            {
                this.accel.x = 0;
            },
            leftDown:function ()
            {
                var accel = this.standing ? this.accelGround : this.accelAir;
                this.accel.x = -accel;
                this.flip = true;
            },
            leftReleased:function ()
            {
                this.accel.x = 0;
            },
            shootPressed:function ()
            {
                ig.game.shakeScreen();
            }
        });

    });
