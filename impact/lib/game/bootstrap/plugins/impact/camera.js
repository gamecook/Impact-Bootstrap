/**
 *  @camera.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  Camera is based on Dominic Szablewski's Biolab camera. It is an advanced
 *  camera which supports easing the camera's movements based on the target
 *  and a boundary call the trap which you can problematically define.
 *
 *  When you include the Camera in your project it will automatically patch
 *  the ig.Game class to handle update and draw calls. A reference to the camera
 *  is also automatically set up and configured for you. The camera will attempt
 *  to automatically find an Entity named 'player' (which is automatically setup
 *  for you if you extend the base-player.js) and uses that as it's target. If
 *  you don't have an entity named 'player' you can set the target manually.
 *
 *  You can customize the camera manually in your game class:
 *
 *  // Change the default x,y offset of the camera
 *  this.camera.offset.x = (ig.system.width - 100) * .5
 *  this.camera.offset.y = (ig.system.height / 3)
 *
 *  // Customize the camera's dampening
 *  this.camera.damping = 5
 *
 *  // Add a lighting mask (png image rendered on top of display)
 *  this.camera.lightMask = new ig.Image("media/lighting.png");
 *
 *  // Customize the size of the trap around the player
 *  this.camera.trap.size.x = ig.system.width / 3;
 *  this.camera.trap.size.y = ig.system.height / 3;
 *
 *  // To see the trap, set the camera to debug
 *  this.camera.debug = true;
 *
 *  // Setting a target for the camera
 *  this.camera.set(this.getEntityByName("player"));
 *
 **/

ig.module(
    'game.bootstrap.plugins.impact.camera'
)
    .requires(
    'impact.game',
    'impact.image'
)
    .defines(function ()
    {

        Camera = ig.Class.extend({
            trap:{
                pos:{x:0, y:0},
                size:{x:16, y:16}},
            min:{x:0, y:0},
            max:{x:0, y:0},
            offset:{x:0, y:0},
            pos:{x:0, y:0},
            damping:5,
            lookAhead:{x:0, y:0},
            lightOffset:{x:0, y:0},
            currentLookAhead:{x:0, y:100},
            debug:false,
            lightMask:null,
            duration:1,
            strength:3,
            init:function (offsetX, offsetY, damping, lightMask)
            {
                this.offset.x = offsetX;
                this.offset.y = offsetY;
                this.damping = damping;
                this.quakeTimer = new ig.Timer();
                this.lightMask = lightMask;
            },
            set:function (entity)
            {
                this.entity = entity;

                this.pos.x = this.entity.pos.x - this.offset.x;
                this.pos.y = this.entity.pos.y - this.offset.y;
                this.trap.pos.x = this.entity.pos.x - this.trap.size.x / 2;
                this.trap.pos.y = this.entity.pos.y - this.trap.size.y;
            },
            update:function ()
            {
                if(this.entity)
                {
                    this.pos.x = this.move('x', this.entity.pos.x, this.entity.size.x);

                    this.pos.y = this.move('y', this.entity.pos.y, this.entity.size.y);
                    ig.game.screen.x = this.pos.x;
                    ig.game.screen.y = this.pos.y;
                }

                // Handle screen shake
                var delta = this.quakeTimer.delta();
                if (delta < -0.1)
                {
                    this.quakeRunning = true;
                    var s = this.strength * Math.pow(-delta / this.duration, 2);
                    if (s > 0.5)
                    {
                        ig.game.screen.x += Math.random().map(0, 1, -s, s);
                        ig.game.screen.y += Math.random().map(0, 1, -s, s);
                    }
                }
                else
                {
                    this.quakeRunning = false;
                }

                if (this.lightMask)
                {
                    this.lightOffset.x = (this.entity.pos.x - this.pos.x) - this.lightMask.width * .5;
                    this.lightOffset.y = (this.entity.pos.y - this.pos.y) - this.lightMask.height * .5;
                }
            },
            move:function (axis, pos, size)
            {
                //var lookAhead = 0;
                if (pos < this.trap.pos[axis])
                {
                    this.trap.pos[axis] = pos;
                    this.currentLookAhead[axis] = this.lookAhead[axis];
                }
                else if (pos + size > this.trap.pos[axis] + this.trap.size[axis])
                {
                    this.trap.pos[axis] = pos + size - this.trap.size[axis];
                    this.currentLookAhead[axis] = -this.lookAhead[axis];
                }
                return(this.pos[axis] - (this.pos[axis] - this.trap.pos[axis] + this.offset[axis]
                    + this.currentLookAhead[axis]) * ig.system.tick * this.damping).limit(this.min[axis], this.max[axis]);
            },
            draw:function ()
            {
                if (this.debug)
                {
                    ig.system.context.fillStyle = 'rgba(255,0,255,0.3)';
                    ig.system.context.fillRect((this.trap.pos.x - this.pos.x) * ig.system.scale, (this.trap.pos.y - this.pos.y) * ig.system.scale, this.trap.size.x * ig.system.scale, this.trap.size.y * ig.system.scale);
                }
                if (this.lightMask)
                    this.lightMask.draw(this.lightOffset.x, this.lightOffset.y);

            },
            shake:function (duration, strength, ignoreShakeLock)
            {
                this.duration = duration;
                this.strength = strength;

                if (!ignoreShakeLock && this.quakeRunning)
                {
                    return;
                }

                this.quakeTimer.set(this.duration);
            }

        });

        ig.Game.inject({
            camera: new Camera(50, 25, 5),
            loadLevel: function(data)
            {
                this.parent(data);

                //TODO need to explain this better
                // This sets the camera's max x to the width of the screen
                this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
                this.camera.min.y = 0;
                this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;

                // Attempt to automatically find the player by name
                var playerInstance = this.getEntityByName("player");

                // If player instance exists, set it as the camera's target
                if(playerInstance)
                    this.camera.set(playerInstance);
            },
            shakeScreen:function (ignoreShakeLock)
            {
                if (this.camera)
                    this.camera.shake(1, 3, ignoreShakeLock);
            },
            updateEntities:function ()
            {
                this.parent();

                // If the pause plugin is loaded, don't update the camera when paused
                if (this.camera && !this.paused)
                    this.camera.update();
            },
            drawEntities:function ()
            {
                this.parent();
                if (this.camera)
                    this.camera.draw();
            }
        });
    });
