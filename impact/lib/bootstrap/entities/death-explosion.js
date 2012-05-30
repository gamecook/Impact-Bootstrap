/**
 *  @death-explosion.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */
ig.module(
    'bootstrap.entities.death-explosion'
)
    .requires(
    'impact.entity'
)
    .defines(function ()
    {

        EntityDeathExplosion = ig.Entity.extend({
            _wmIgnore: true,
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
            _wmIgnore: true,
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
            animSheet:new ig.AnimationSheet('media/bootstrap/images/blood.png', 2, 2),
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
