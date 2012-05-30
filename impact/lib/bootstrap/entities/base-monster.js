/**
 *  @base-monster.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

ig.module(
    'bootstrap.entities.base-monster'
)
    .requires(
    'bootstrap.entities.base-actor',
    'impact.sound'

)
    .defines(function ()
    {

        EntityBaseMonster = EntityBaseActor.extend({
            _wmIgnore: true,
            maxVel:{x:100, y:100},
            friction:{x:150, y:0},
            speed:14,
            type:ig.Entity.TYPE.B,
            checkAgainst:ig.Entity.TYPE.A,
            collides:ig.Entity.COLLIDES.PASSIVE,
            init:function (x, y, settings)
            {
                this.parent(x, y, settings);
                this.spawner = settings.spawner;
                this.setupAnimation(settings.spriteOffset ? settings.spriteOffset : 0);
            },
            update:function ()
            {
                // near an edge? return!
                if (ig.game.collisionMap.getTile(
                    this.pos.x + (this.flip ? +4 : this.size.x - 4),
                    this.pos.y + this.size.y + 1
                ) == 0
                    && this.standing)
                {
                    this.flip = !this.flip;
                }
                var xdir = this.flip ? -1 : 1;
                this.vel.x = this.speed * xdir;
                this.currentAnim.flip.x = this.flip;
                this.parent();
            },
            handleMovementTrace:function (res)
            {
                this.parent(res);
                // collision with a wall? return!
                if (res.collision.x)
                {
                    this.flip = !this.flip;
                }
            },
            check:function (other)
            {
                other.receiveDamage(10, this);
            }
        });

    });
