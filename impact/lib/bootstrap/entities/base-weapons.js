/**
 *  @weapons.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

ig.module(
    'bootstrap.entities.base-weapons'
)
    .requires(
    'bootstrap.entities.base-player'
)
    .defines(function ()
    {

        //TODO need to add logic that if the weapon is on the map it shows an icon and can be picked up, if equipped then it doesn't display any graphics
        EntityBaseWeapons = ig.Entity.extend({
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

        EntityBasePlayer.inject({
            weapon: 0,
            activeWeapon: "none",
            shotPressed: false,
            fireDelay: null,
            fireRate: 0,
            maxPool: 2,
            update: function()
            {

                if(this.shotPressed)
                {
                    if( this.fireDelay.delta() > this.fireRate ) {
                        this.fireWeapon();
                        this.fireDelay.reset();
                    }
                }

                this.parent();

            },
            fireWeapon: function(){

                if(this.activeWeapon == "none")
                    return;

                if(this.maxPool == -1 || this.pool < this.maxPool )
                {
                    //console.log("Pool", this.pool, this.pool < this.maxPool)
                    var entity = ig.game.spawnEntity( this.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip, parentEntity: this} );
                    this.addWeaponToPool();
                    this.maxPool = entity.maxPool;
                    this.shotPressed = entity.automatic;

                    this.fireRate = entity.automatic ? entity.fireRate : 0;

                    var accel = this.standing ? this.accelGround : this.accelAir;
                    if( !this.flip ) {
                        this.accel.x = -accel * entity.recoil;
                    }else {
                        this.accel.x = accel * entity.recoil;
                    }
                    this.fireDelay.reset();
                }
            },
            fireWeaponRelease: function()
            {
                this.shotPressed = false;
            },
            addWeaponToPool: function()
            {
                this.pool ++;
            },
            removeWeaponFromPool: function()
            {
                this.pool --;
                if(this.pool < 0) this.pool = 0;
            },
            clearWeaponPool:function()
            {
                this.pool = 0;
                this.maxPool = -1;
            }

        })

    });
