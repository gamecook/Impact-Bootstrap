/**
 *  @door.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 Simple Mover that visits all its targets in an ordered fashion. You can use
 the void entities (or any other) as targets.


 Keys for Weltmeister:

 speed
 Traveling speed of the mover in pixels per second.
 Default: 20

 target.1, target.2 ... target.n
 Names of the entities to visit.
 */

ig.module(
    'bootstrap.entities.elevator'
)
    .requires(
    'impact.entity',
    'bootstrap.entities.platform'

)
    .defines(function ()
    {

        EntityElevator = EntityPlatform.extend({
            size:{x:32, y:48},
            type:ig.Entity.TYPE.NONE,
            collides:ig.Entity.COLLIDES.NONE,
            cord:null,
            cords:[],
            zIndex:-1,
            animSheet:new ig.AnimationSheet('media/bootstrap/images/elevator.png', 32, 48),
            init:function (x, y, settings)
            {
                this.parent(x, y, settings);

                this.addAnim('idle', 1, [0]);
                this.addAnim('up', 1, [1]);
                this.addAnim('down', 1, [2]);

                this.cords = ig.ksort(this.cord);

                if (typeof wm == "undefined")
                {
                    this.topEntity = ig.game.spawnEntity("EntityElevatorPlatform", this.pos.x, this.pos.y, {name:"top"});
                    this.bottomEntity = ig.game.spawnEntity("EntityElevatorPlatform", this.pos.x, this.pos.y + this.size.y - 8, {name:"bottom"});
                }
            },
            update:function ()
            {
                this.parent();
                if (this.topEntity && this.bottomEntity)
                {
                    this.topEntity.vel.y = this.vel.y;
                    this.bottomEntity.vel.y = this.vel.y;
                }

                if (this.angle < 0)
                    this.currentAnim = this.anims.up;
                else if (this.angle > 0)
                    this.currentAnim = this.anims.down;
                else
                    this.currentAnim = this.anims.idle;
            },
            onReachTarget:function ()
            {
                this.parent();
                if (this.topEntity && this.bottomEntity)
                {
                    this.topEntity.pos.y = this.pos.y;
                    this.bottomEntity.pos.y = this.pos.y + this.size.y - 8;
                }
            },
            draw:function ()
            {
                //TODO need to optimize this, it should probably just be a set of tiles.
                if (this.cords.length == 2)
                {
                    for (var t in this.cords)
                    {
                        this.drawLineToTarget(this, this.cords[t]);
                    }
                }
                this.parent();
            },
            drawLineToTarget:function (ent, target)
            {
                target = ig.game.getEntityByName(target);
                if (!target)
                {
                    return;
                }

                ig.system.context.strokeStyle = '#000';
                ig.system.context.lineWidth = 3;

                ig.system.context.beginPath();
                ig.system.context.moveTo(
                    ig.system.getDrawPos(ent.pos.x + ent.size.x / 2 - ig.game.screen.x),
                    ig.system.getDrawPos(ent.pos.y + ent.size.y / 2 - ig.game.screen.y)
                );
                ig.system.context.lineTo(
                    ig.system.getDrawPos(target.pos.x + target.size.x / 2 - ig.game.screen.x),
                    ig.system.getDrawPos(target.pos.y + target.size.y / 2 - ig.game.screen.y)
                );
                ig.system.context.stroke();
                ig.system.context.closePath();
            }
        });


        EntityElevatorPlatform = ig.Entity.extend({
            type:ig.Entity.TYPE.B,
            checkAgainst:ig.Entity.TYPE.BOTH,
            collides:ig.Entity.COLLIDES.FIXED,
            size:{x:32, y:8},
            speed:20,
            gravityFactor:0,
            maxVel:{x:100, y:100},
            debug:false,
            draw:function ()
            {
                if (this.debug)
                {
                    this.parent();
                    var ctx = ig.system.context;
                    var s = ig.system.scale;
                    var x = this.pos.x * s - ig.game.screen.x * s;
                    var y = this.pos.y * s - ig.game.screen.y * s;
                    var sizeX = this.size.x * s;
                    var sizeY = this.size.y * s;
                    ctx.save();
                    ctx.fillStyle = "rgba(128, 28, 230, 0.7)";
                    ctx.fillRect(x, y, sizeX, sizeY);
                    //this.parent();
                    ctx.restore();
                }
            },
            receiveDamage:function (amount, from)
            {
                // Takes no damage
            }
        });
    });