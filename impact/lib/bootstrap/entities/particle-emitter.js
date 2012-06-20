/**
 *  @particle-emitter.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  This entity is useful for spawning particles on an entity. The class
 *  comes with a few standard particles such as fire, water and snow.
 */
ig.module(
    'bootstrap.entities.particle-emitter'
)
    .requires(
    'impact.entity'
)
    .defines(function(){

        EntityParticleEmitter = ig.Entity.extend({
            _wmIgnore: false,
            _wmDrawBox: true,
            _wmBoxColor:'rgba(128, 28, 230, 0.7)',
            _wmScalable:true,
            lifetime: .1,
            particles: 3,
            colorOffset: 0,
            size: {x: 8, y: 8},
            instances: [],
            pool: [],
            maxInstances: 10,
            target:null,
            targets:[],
            spawnEntity:null,
            particleLifeTime: 1,
            fadetime: 1,
            init: function( x, y, settings ) {
                if(settings.width)
                    this.size.x = settings.width;
                this.parent( x, y, settings );
                this.idleTimer = new ig.Timer();
                this.targets = ig.ksort(this.target);
            },
            update: function() {
                if(this.targets.length < 1 || !this.spawnEntity)
                    return;

                if( this.idleTimer.delta() > this.lifetime ) {
                    var newParticle = this.createParticle();
                    if(newParticle)
                        this.idleTimer.reset();
                }
            },
            createParticle: function()
            {
                var instance;
                var instanceName = this.targets.random();
                //Find random target
                var newTarget = ig.game.getEntityByName(instanceName);

                if(!newTarget)
                {
                    this.instances.splice(this.instances.indexOf(instanceName), 1);
                    return;
                }

                var x = (Math.random() * newTarget.size.x-2) + newTarget.pos.x;
                var y = newTarget.pos.y + (newTarget.size.y - 5);
                if(this.instances.length < this.maxInstances)
                {
                    instance = ig.game.spawnEntity(this.spawnEntity, x, y, {spawner: this, lifetime: this.particleLifeTime, fadetime: this.fadetime});
                    this.instances.push(instance);
                    this.pool.push(instance);
                }
                else
                {
                    instance = this.pool.pop();
                    if(instance)
                        instance.reset(x, y);
                }
                return instance;
            }
        });


        EntityBaseParticle = ig.Entity.extend({
            size: {x: 2, y: 2},
            lifetime: 1,
            fadetime: 1,
            bounciness: 0,
            collides: ig.Entity.COLLIDES.NONE,
            colorOffset: 0,
            totalColors: 7,
            idleTimer: null,
            animSheet: new ig.AnimationSheet( 'media/bootstrap/images/blood.png', 2, 2 ), //TODO need to create element particle sprite sheet
            init: function( x, y, settings ) {
                this.parent( x, y, settings );
                var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
                this.addAnim( 'idle', 0.2, [frameID] );
                this.idleTimer = new ig.Timer();
            },
            update: function() {
                /*if(this.currentAnim.alpha < .1)
                    return;*/

                if( this.idleTimer.delta() > this.lifetime ) {
                    this.kill();
                    return;
                }
                this.currentAnim.alpha = this.idleTimer.delta().map(
                    this.lifetime - this.fadetime, this.lifetime,
                    1, 0
                ) -.2;

                this.parent();
            },
            reset: function(x, y)
            {
                this.pos.x = x;
                this.pos.y = y;
                this.currentAnim.alpha = 1;
                this.idleTimer.reset();
            },
            kill: function()
            {
                this.currentAnim.alpha = 0;
                this.spawner.pool.push(this);
            },

            draw:function()
            {
                if(this.currentAnim.alpha < .1)
                    return;

                this.parent();

            },
            handleMovementTrace:function (res)
            {
                this.parent(res);

                if (res.collision.x || res.collision.y)
                {
                    this.kill();
                }
            }
        });

        EntityFlameParticle = EntityBaseParticle.extend({

            maxVel: {x: 20, y: -20},
            vel: {x: 10, y: 30},
            friction: {x:10, y: 0},
            colorOffset: 2,
            init: function( x, y, settings ) {
                this.parent( x, y, settings );
                this.vel.x = (Math.random() * 1) * this.vel.x;
                this.vel.y = (Math.random() * 5 - 1) * this.vel.y;
            }


        });

        EntityWaterParticle = EntityFlameParticle.extend({
            maxVel: {x: 50, y: 150},
            vel: {x: 40, y: 0},
            friction: {x:10, y: 100},
            colorOffset: 5,
            init: function( x, y, settings ) {
                this.parent( x, y, settings );
                this.vel.x = (Math.random() * 5) * this.vel.x;
                //TODO need to fix the reset so these particles shoot out
            }
        });

        EntitySnowParticle = EntityFlameParticle.extend({
            maxVel: {x: 160, y: 200},
            vel: {x: 100, y: 30},
            friction: {x:100, y: 100},
            lifetime: 3,
            fadetime: 3,
            colorOffset: 4,
            totalColors: 7,
            init: function( x, y, settings ) {
                this.parent( x, y, settings );
                this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
                this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            }
        });
    });

