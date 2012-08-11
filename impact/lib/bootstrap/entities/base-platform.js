/**
 *  @door.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  Simple Mover based on Dominic Szablewski's mover entity that visits all its
 *  targets in an ordered fashion. You can use the void entities (or any other)
 *  as targets.
 *
 *  Keys for Weltmeister:
 *
 *  speed
 *  Traveling speed of the mover in pixels per second.
 *  Default: 20
 *
 *  target.1, target.2 ... target.n
 *  Names of the entities to visit.
 */

ig.module(
    'bootstrap.entities.base-platform'
)
    .requires(
    'impact.entity',
    'impact.sound'

)
    .defines(function ()
    {
        EntityBasePlatform = ig.Entity.extend({
            /*animSheet:new ig.AnimationSheet('media/bootstrap/images/elevator.png', 32, 10),
            size:{x:32, y:10},*/
            _wmIgnore: true,
            type:ig.Entity.TYPE.B,
            checkAgainst:ig.Entity.TYPE.BOTH,
            collides:ig.Entity.COLLIDES.FIXED,
            target:null,
            targets:[],
            currentTarget:0,
            speed:20,
            gravityFactor:0,
            delay:1,
            delayTimer:null,
            angle:0,
            init:function (x, y, settings)
            {
                //TODO setup graphic
                this.parent(x, y, settings);
                this.targets = ig.ksort(this.target);
                this.delayTimer = new ig.Timer();
            }, update:function ()
            {
                if (this.targets.length > 0)
                {
                    if (this.delayTimer.delta() > this.delay)
                    {
                        var oldDistance = 0;
                        var target = ig.game.getEntityByName(this.targets[this.currentTarget]);
                        if (target)
                        {
                            oldDistance = this.distanceTo(target);
                            this.angle = this.angleTo(target);
                            this.vel.x = Math.cos(this.angle) * this.speed;
                            this.vel.y = Math.sin(this.angle) * this.speed;
                        }
                        else
                        {
                            this.vel.x = 0;
                            this.vel.y = 0;
                        }
                        this.parent();
                        var newDistance = this.distanceTo(target);
                        if (target && (newDistance > oldDistance || newDistance < 0.5))
                        {
                            this.angle = 0;
                            this.pos.x = target.pos.x + target.size.x / 2 - this.size.x / 2;
                            this.pos.y = target.pos.y + target.size.y / 2 - this.size.y / 2;
                            this.currentTarget++;
                            if (this.currentTarget >= this.targets.length && this.targets.length > 1)
                            {
                                this.currentTarget = 1;
                                this.targets.reverse();
                            }
                            this.onReachTarget();
                        }
                    }
                }
                else
                {
                    this.parent();
                }
            },
            onReachTarget:function ()
            {
                this.vel.y = 0;
                this.delayTimer.set(this.delay);
            },
            receiveDamage:function (amount, from)
            {
            }
        });
    });