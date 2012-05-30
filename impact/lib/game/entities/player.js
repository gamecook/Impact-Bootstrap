ig.module(
    'game.entities.player'
)
    .requires(
    'bootstrap.entities.base-player',
    'impact.sound'
)
    .defines(function () {
        EntityPlayer = EntityBasePlayer.extend({
            _wmIgnore: false,
            animSheet:new ig.AnimationSheet('media/bootstrap/images/player.png', 16, 16),
            size:{x:8, y:14},
            offset:{x:4, y:2},
            emptySFX:new ig.Sound('media/bootstrap/sounds/Empty.*'),
            jumpSFX:new ig.Sound('media/bootstrap/sounds/Jump.*'),
            deathSFX:new ig.Sound('media/bootstrap/sounds/Death.*'),
            fallOutOfBoundsSFX:new ig.Sound('media/bootstrap/sounds/PlayerMonsterFall.*'),
            powerUpSFX:new ig.Sound('media/bootstrap/sounds/PowerUp.*'),
            powerUp2SFX:new ig.Sound('media/bootstrap/sounds/PowerUp2.*'),
            init:function (x, y, settings)
            {
                this.parent(x, y, settings);

                this.setupAnimation(0);//this.weapon);
            },
            setupAnimation:function (offset) {
                //TODO this is doing nothing
                offset = offset * 14;
                this.addAnim('idle', 1, [0]);
                this.addAnim('run', .07, [0, 1, 2, 3, 4, 5]);
                this.addAnim('jump', .07, [9, 10, 11, 12]);
                this.addAnim('jumpEmpty', 1, [13]);
                this.addAnim('fall', 0.4, [6, 7]);
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
                    this.currentAnim = this.anims.idle;
                    this.fallDistance = 0;
                }
            },
            jumpDown:function ()
            {
                this.vel.y -= 9;
                this.fallDistance -= this.vel.y;
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
