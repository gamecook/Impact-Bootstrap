/**
 *  @base-actor.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */
ig.module(
    'game.bootstrap.entities.core.base-actor'
)
    .requires(
    'impact.entity',
    'impact.sound'
)
    .defines(function ()
    {

        EntityMob = ig.Entity.extend({
            visible:true,
            weapon:0,
            activeWeapon:"none",
            startPosition:null,
            invincible:false,
            invincibleDelay:2,
            captionTimer:null,
            healthMax:10,
            health:10,
            markedForDeath:false,
            fallDistance:0,
            maxFallDistance:10000,
            shotPressed:false,
            fireDelay:null,
            fireRate:0,
            bloodColorOffset:0,
            init:function (x, y, settings)
            {
                this.parent(x, y, settings);
                this.spawner = settings.spawner;
                //TODO need to figure out if we should call this here?
                this.setupAnimation(settings.spriteOffset ? settings.spriteOffset : 0);
                this.startPosition = {x:x, y:y};
                this.captionTimer = new ig.Timer();
                this.fireDelay = new ig.Timer();
            },
            setupAnimation:function (offset)
            {
            },
            receiveDamage:function (value, from)
            {
                if (this.invincible || !this.visible)
                    return;

                this.parent(value, from);

                if (this.health > 0)
                {
                    this.spawnParticles(2);
                }
            },
            kill:function (noAnimation)
            {
                this.parent();
                //TODO need to rename all this to make more sense
                if (!noAnimation)
                {
                    this.markedForDeath = true;
                    this.onDeathAnimation();
                }
                else
                {
                    this.onKill();
                }
            },
            onKill:function ()
            {
                //Handler for when the entity is killed
            },
            onDeathAnimation:function ()
            {
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack:this.onKill});

                //TODO need to think through this better

            },
            outOfBounds:function ()
            {
                this.kill(true);
            },
            collideWith:function (other, axis)
            {

                // check for crushing damage from a moving platform (or any FIXED entity)
                if (other.collides == ig.Entity.COLLIDES.FIXED && this.touches(other))
                {
                    // we're still overlapping, but by how much?
                    var overlap;
                    var size;
                    if (axis == 'y')
                    {
                        size = this.size.y;
                        if (this.pos.y < other.pos.y) overlap = this.pos.y + this.size.y - other.pos.y;
                        else overlap = this.pos.y - (other.pos.y + other.size.y);
                    } else
                    {
                        size = this.size.x;
                        if (this.pos.x < other.pos.x) overlap = this.pos.x + this.size.x - other.pos.x;
                        else overlap = this.pos.x - (other.pos.x + other.size.x);
                    }
                    overlap = Math.abs(overlap);

                    // overlapping by more than 1/2 of our size?
                    if (overlap > 3)
                    {
                        // we're being crushed - this is damage per-frame, so not 100% the same at different frame rates
                        this.kill();
                    }
                }
            },
            spawnParticles:function (total)
            {
                for (var i = 0; i < total; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {colorOffset:this.bloodColorOffset});
            },
            makeInvincible:function ()
            {
                this.invincible = true;
                this.captionTimer.reset();
            },
            equip:function (id, message)
            {

            },
            update:function ()
            {
                //TODO maybe we need to add invincible to draw or consolidate the two
                if (this.captionTimer.delta() > this.invincibleDelay)
                {
                    this.invincible = false;
                    this.currentAnim.alpha = 1;
                }
                this.parent();
            },
            draw:function ()
            {

                // Exit draw call if the entity is not visible
                if (!this.visible)
                    return;

                if (this.invincible)
                    this.currentAnim.alpha = this.captionTimer.delta() / this.invincibleDelay * 1;


                //TODO alpha is not showing up correctly on the player now when a level starts
                //Hack to allow you to override invincible effect
                if (!this.visible)
                    this.currentAnim.alpha = false;
                else
                    this.currentAnim.alpha = true;

                this.parent();
            },
            handleMovementTrace:function (res)
            {

                this.parent(res);

                //TODO need to add some kind of check to make sure we are not calling this too many times
                if ((res.collision.y) && (this.fallDistance > this.maxFallDistance))
                {
                    this.onFallToDeath();
                }
            },
            onFallToDeath:function ()
            {
                this.kill();
            },
            repel:function (direction, force)
            {

            },
            fireWeapon:function ()
            {
                //TODO need to flesh thsi out to support ammo and what not
                if (this.activeWeapon == "none")
                    return;

                var entity = ig.game.spawnEntity(this.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip});
                //this.shootSFX.play();
                this.shotPressed = entity.automatic;

                this.fireRate = entity.automatic ? entity.fireRate : 0;

                var accel = this.standing ? this.accelGround : this.accelAir;
                if (!this.flip)
                {
                    this.accel.x = -accel * entity.recoil;
                } else
                {
                    this.accel.x = accel * entity.recoil;
                }
                this.fireDelay.reset();

                //TODO need to let each weapon have its own power drain
                this.power--;
                /*if(ig.game.stats.ammo < 1)
                 {
                 this.equip(0);
                 this.emptySFX.play();
                 }*/
            }
        });

        EntityDeathExplosion = ig.Entity.extend({
            delay:1,
            callBack:null,
            particles:25,
            init:function (x, y, settings)
            {
                this.parent(x, y, settings);
                for (var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset:settings.colorOffset ? settings.colorOffset : 0});
                this.idleTimer = new ig.Timer();
            },
            update:function ()
            {
                if (this.idleTimer.delta() > this.delay)
                {
                    this.kill();
                    if (this.callBack)
                        this.callBack();
                    return;
                }
            }
        });

        EntityDeathExplosionParticle = ig.Entity.extend({
            size:{x:2, y:2},
            maxVel:{x:160, y:200},
            delay:1,
            fadetime:1,
            bounciness:0,
            vel:{x:100, y:30},
            friction:{x:100, y:0},
            collides:ig.Entity.COLLIDES.LITE,
            colorOffset:0,
            totalColors:7,
            baseVelocity:{x:2, y:2},
            animSheet:new ig.AnimationSheet('media/blood.png', 2, 2),
            init:function (x, y, settings)
            {
                this.parent(x, y, settings);
                var frameID = Math.round(Math.random() * this.totalColors) + (this.colorOffset * (this.totalColors + 1));
                this.addAnim('idle', 0.2, [frameID]);
                this.vel.x = (Math.random() * this.baseVelocity.x - 1) * this.vel.x;
                this.vel.y = (Math.random() * this.baseVelocity.y - 1) * this.vel.y;
                this.idleTimer = new ig.Timer();
            },
            update:function ()
            {
                if (this.idleTimer.delta() > this.delay)
                {
                    this.kill();
                    return;
                }
                this.currentAnim.alpha = this.idleTimer.delta().map(
                    this.delay - this.fadetime, this.delay,
                    1, 0
                );
                this.parent();
            }
        });

    });
