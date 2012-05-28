/**
 *  @levelexit.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 Simpler spawner that will create an instance of a class based on a delay


 Keys for Weltmeister:

 delay
 Delay between each spawn in seconds. Default value is 4.

 spawnEntity
 Name of the Entity class to spawn. Example:
 spawnEntity: EntityZombie

 */
ig.module(
    'game.bootstrap.entities.spawner'
)
    .requires(
    'impact.entity'
)
    .defines(function ()
    {

        EntitySpawner = ig.Entity.extend({
            idleTimer:null,
            _wmDrawBox:true,
            _wmBoxColor:'rgba(0, 0, 255, 0.7)',
            _wmScalable:true,
            delay:4,
            maxVel:{x:0, y:0},
            spawnEntity:null,
            target:null,
            targets:[],
            randomSpawnPoint:false,
            pool:0,
            maxPool:-1,
            init:function (x, y, settings)
            {
                this.parent(x, y, settings);
                this.idleTimer = new ig.Timer();
                // Transform the target object into an ordered array of targets
                this.targets = ig.ksort(this.target);
            },
            update:function ()
            {
                if (this.idleTimer.delta() > this.delay)
                {
                    this.idleTimer.reset();
                    this.spawnNewEntity();
                }
                this.parent();
            },
            spawnNewEntity:function (settings)
            {
                if (this.pool < this.maxPool || this.maxPool == -1)
                {
                    if (!settings) settings = {spawner:this};
                    var x = this.pos.x;
                    var y = this.pos.y;
                    if (this.targets.length > 0)
                    {
                        //TODO make sure this is always in bounds
                        var index = Math.floor(Math.random() * (this.targets.length - 1));
                        var newTarget = ig.game.getEntityByName(this.targets[index]);
                        x = this.randomSpawnPoint ? Math.round(Math.random() * newTarget.size.x) + newTarget.pos.x : newTarget.pos.x;
                        y = newTarget.pos.y;
                    }
                    if (this.spawnEntity)
                        ig.game.spawnEntity(this.spawnEntity, x, y, settings);

                    // Sort entites to make sure newly spawned entites are at the correct Z index
                    ig.game.sortEntitiesDeferred();
                    this.pool++;
                }
            },
            draw:function ()
            {
            },
            removeItem:function ()
            {
                this.pool--;
            }
        });

    });
