/**
 *  @levelexit.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

ig.module(
    'bootstrap.entities.weapons'
)
    .requires(
    'impact.entity',
    'impact.sound',
    'bootstrap.entities.base-actor'
)
    .defines(function ()
    {

        //TODO need to add logic that if the weapon is on the map it shows an icon and can be picked up, if equipped then it doesn't display any graphics
        EntityWeapons = ig.Entity.extend({
            automatic:false,
            recoil:1,
            maxPool:-1,
            distance:-1,
            parentEntity:null,
            kill:function ()
            {
                this.parent();
                //TODO this should also check that it is the active weapon?
                if (this.parentEntity && this.parentEntity.removeWeaponFromPool)
                    this.parentEntity.removeWeaponFromPool();
            },
            outOfBounds:function ()
            {
                this.kill();
            }
        })

        EntityBullet = EntityWeapons.extend({
            size:{x:5, y:3},
            animSheet:new ig.AnimationSheet('media/bootstrap/images/bullet.png', 5, 3),
            maxVel:{x:200, y:0},
            type:ig.Entity.TYPE.NONE,
            checkAgainst:ig.Entity.TYPE.BOTH,
            collides:ig.Entity.COLLIDES.PASSIVE,
            maxPool:2,
            gunFireSFX:new ig.Sound('media/bootstrap/sounds/GunFire.*'),
            init:function (x, y, settings)
            {
                this.parent(x + (settings.flip ? -4 : 8), y + 8, settings);
                this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.addAnim('idle', 0.2, [0]);
                this.gunFireSFX.play();
            },
            handleMovementTrace:function (res)
            {
                this.parent(res);
                if (res.collision.x || res.collision.y)
                {
                    this.kill();
                }
            },
            check:function (other)
            {
                other.receiveDamage(3, this);
                this.kill();
            }
        });

        EntityShotgunShell = EntityWeapons.extend({
            size:{x:5, y:3},
            animSheet:new ig.AnimationSheet('media/bootstrap/images/bullet.png', 5, 3),
            maxVel:{x:200, y:0},
            type:ig.Entity.TYPE.NONE,
            checkAgainst:ig.Entity.TYPE.BOTH,
            collides:ig.Entity.COLLIDES.PASSIVE,
            recoil:3,
            distance:20,
            maxPool:1,
            shotgunFireSFX:new ig.Sound('media/bootstrap/sounds/ShotgunFire.*'),
            init:function (x, y, settings)
            {
                this.parent(x + (settings.flip ? -4 : 8), y + 8, settings);
                this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.addAnim('idle', 0.2, [0]);

                this.shotgunFireSFX.play();
            },
            handleMovementTrace:function (res)
            {
                this.parent(res);
                if (res.collision.x || res.collision.y)
                {
                    this.kill();
                }
            },
            update:function ()
            {
                this.parent();
                this.distance--;
                if (this.distance < 0)
                {
                    this.kill();
                }
            },
            check:function (other)
            {
                other.receiveDamage(8, this);
                this.kill();
            }
        });

        EntityMachineGun = EntityWeapons.extend({
            size:{x:5, y:3},
            animSheet:new ig.AnimationSheet('media/bootstrap/images/bullet.png', 5, 3),
            maxVel:{x:300, y:0},
            type:ig.Entity.TYPE.NONE,
            checkAgainst:ig.Entity.TYPE.BOTH,
            collides:ig.Entity.COLLIDES.PASSIVE,
            automatic:true,
            fireRate:.1,
            recoil:5,
            maxPool:4,
            machineGunFireSFX:new ig.Sound('media/bootstrap/sounds/MachineGunFire.*'),
            init:function (x, y, settings)
            {
                this.parent(x + (settings.flip ? -4 : 8), y + 6, settings);
                this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.addAnim('idle', 0.2, [0]);
                this.machineGunFireSFX.play();
            },
            handleMovementTrace:function (res)
            {
                this.parent(res);
                if (res.collision.x || res.collision.y)
                {
                    this.kill();
                }
            },
            check:function (other)
            {
                other.receiveDamage(3, this);
                this.kill();
            }
        });

        EntityGrenade = EntityWeapons.extend({
            size:{x:4, y:4},
            offset:{x:2, y:2},
            animSheet:new ig.AnimationSheet('media/bootstrap/images/grenade.png', 8, 8),
            type:ig.Entity.TYPE.A,
            checkAgainst:ig.Entity.TYPE.BOTH,
            collides:ig.Entity.COLLIDES.ACTIVE,
            maxVel:{x:200, y:200},
            bounciness:0.6,
            bounceCounter:0,
            automatic:false,
            recoil:0,
            blastRadius:30,
            maxPool:1,
            granadeBounceSFX:new ig.Sound('media/bootstrap/sounds/GranedeBounce.*'),
            granadeExplodeSFX:new ig.Sound('media/bootstrap/sounds/GrenedeExplosion.*'),
            init:function (x, y, settings)
            {
                this.parent(x + (settings.flip ? -4 : 7), y, settings);
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.vel.y = -(50 + (Math.random() * 100));
                this.addAnim('idle', 0.2, [0, 1]);
            },
            handleMovementTrace:function (res)
            {
                this.parent(res);
                if (res.collision.x || res.collision.y)
                {
                    this.bounce();
                }
            },
            check:function (other)
            {
                this.bounce();
            },
            bounce:function ()
            {
                this.granadeBounceSFX.play();
                this.bounceCounter++;
                if (this.bounceCounter > 3)
                {
                    this.kill();
                }
            },
            kill:function ()
            {
                this.granadeExplodeSFX.play();
                var entity;
                var entities = ig.game.entities;
                for (var i = 0; i < entities.length; i++)
                {
                    entity = entities[i];
                    if (entity.type == ig.Entity.TYPE.B)
                    {
                        var distance = this.distanceTo(entity);
                        if (distance < this.blastRadius)
                            entity.receiveDamage(this.blastRadius - distance, this);
                    }
                }

                for (var i = 0; i < 10; i++)
                    ig.game.spawnEntity(EntityGrenadeParticle, this.pos.x, this.pos.y);
                this.parent();
                ig.game.shakeScreen();
            }
        });

        //TODO this has a dependency on EntityDeathExplosionParticle
        EntityGrenadeParticle = EntityDeathExplosionParticle.extend({
            size:{x:1, y:1},
            maxVel:{x:160, y:200},
            delay:1,
            fadetime:1,
            bounciness:0.3,
            vel:{x:40, y:50},
            friction:{x:20, y:20},
            checkAgainst:ig.Entity.TYPE.B,
            collides:ig.Entity.COLLIDES.LITE,
            baseVelocity:{x:4, y:10},
            animSheet:new ig.AnimationSheet('media/bootstrap/images/explosion.png', 1, 1)
        });

        EntityMine = EntityWeapons.extend({
            size:{x:6, y:5},
            offset:{x:0, y:0},
            animSheet:new ig.AnimationSheet('media/bootstrap/images/mine.png', 6, 5),
            type:ig.Entity.TYPE.A,
            checkAgainst:ig.Entity.TYPE.B,
            collides:ig.Entity.COLLIDES.ACTIVE,
            maxVel:{x:50, y:100},
            bounciness:0,
            automatic:false,
            recoil:0,
            blastRadius:25,
            friction:{x:100, y:0},
            maxPool:1,
            mineBeepSFX:new ig.Sound('media/bootstrap/sounds/MineBeep.*'),
            mineExplosionSFX:new ig.Sound('media/bootstrap/sounds/MineExplosion.*'),
            init:function (x, y, settings)
            {
                this.parent(x + (settings.flip ? -10 : 15), y, settings);
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.vel.y = -(50 + (Math.random() * 50));
                this.addAnim('idle', 0.2, [0, 1]);
                this.mineBeepSFX.play();
            },
            check:function (other)
            {
                //TODO need to look into this when in elevators that are moving
                if (this.vel.x == 0 && this.vel.y == 0)
                {
                    other.receiveDamage(10, this);
                    this.kill();
                }
            },
            kill:function ()
            {
                var entity;
                var entities = ig.game.entities;
                for (var i = 0; i < entities.length; i++)
                {
                    entity = entities[i];
                    if (entity.type == ig.Entity.TYPE.B)
                    {
                        var distance = this.distanceTo(entity);
                        if (distance < this.blastRadius)
                            entity.receiveDamage(this.blastRadius - distance, this);
                    }
                }

                for (var i = 0; i < 10; i++)
                    ig.game.spawnEntity(EntityGrenadeParticle, this.pos.x, this.pos.y);
                this.parent();
                ig.game.shakeScreen();
                this.mineExplosionSFX.play();
            }
        });

        //TODO Inject equip and fire logic into player class


    });
