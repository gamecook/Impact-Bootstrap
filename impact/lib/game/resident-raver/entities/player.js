ig.module(
    'game.resident-raver.entities.player'
)
    .requires(
    'bootstrap.entities.base-player',
    'impact.sound',
    'bootstrap.plugins.impact.caption',
    'bootstrap.entities.base-weapons',
    'game.resident-raver.entities.ammo'
)
    .defines(function () {
        EntityPlayer = EntityBasePlayer.extend({
            _wmIgnore: false,
            animSheet:new ig.AnimationSheet('media/games/resident-raver/images/player.png', 16, 16),
            size:{x:8, y:14},
            offset:{x:4, y:2},
            maxVel: {x: 100, y: 150},
            friction: {x: 600, y: 0},
            accelGround: 400,
            accelAir: 200,
            jump: 200,
            health: 1,
            emptySFX:new ig.Sound('media/bootstrap/sounds/Empty.*'),
            jumpSFX:new ig.Sound('media/bootstrap/sounds/Jump.*'),
            deathSFX:new ig.Sound('media/bootstrap/sounds/Death.*'),
            fallOutOfBoundsSFX:new ig.Sound('media/bootstrap/sounds/PlayerMonsterFall.*'),
            powerUpSFX:new ig.Sound('media/bootstrap/sounds/PowerUp.*'),
            powerUp2SFX:new ig.Sound('media/bootstrap/sounds/PowerUp2.*'),

            init:function (x, y, settings)
            {
                this.parent(x, y, settings);

                this.setupAnimation(this.weapon);
                this.startPosition = {x:x,y:y};
            },
            setupAnimation: function(offset){
                offset = offset * 10;
                this.addAnim('idle', 1, [0+offset]);
                this.addAnim('run', .07, [0+offset,1+offset,2+offset,3+offset,4+offset,5+offset]);
                this.addAnim('jump', 1, [9+offset]);
                this.addAnim('fall', 0.4, [6+offset,7+offset]);
            },
            onDeathAnimation:function () {
                this.parent();
                this.deathSFX.play();
            },
            outOfBounds:function () {
                this.fallOutOfBoundsSFX.play();
                this.parent();
            },
            updateAnimation: function()
            {
                if( this.vel.x != 0 ) {
                    this.currentAnim = this.anims.run;
                }else{
                    this.currentAnim = this.anims.idle;
                }
                this.currentAnim.flip.x = this.flip;
            },
            draw: function()
            {
                this.parent();
            },
            jumpDown:function ()
            {
                if( this.standing && ig.input.pressed('jump') ) {
                    this.vel.y = -this.jump;
                    //this.jumpSFX.play();
                }
            },
            rightDown:function ()
            {
                var accel = this.standing ? this.accelGround : this.accelAir;

                this.accel.x = accel;
                this.flip = false;
            },
            rightReleased:function ()
            {
                this.accel.x = 0;
            },
            leftDown:function ()
            {
                var accel = this.standing ? this.accelGround : this.accelAir;
                this.accel.x = -accel;
                this.flip = true;
            },
            leftReleased:function ()
            {
                this.accel.x = 0;
            },
            shootPressed:function ()
            {
                this.fireWeapon();
            },
            shootReleased:function ()
            {
                this.fireWeaponRelease();
            },
            addPowerUp: function(property, value, message)
            {
                if(this[property])
                {
                    this[property] += value;
                    if(this[property] > this[property+"Max"])
                        this[property] = this[property +"Max"];
                    else if(this[property] < 0)
                    {
                        this[property] = 0;
                    }

                    if(message)
                        ig.game.displayCaption(message, 2);
                }
            },
            equip:function(id, hideMessage)
            {
                //TODO need to create a weapon based on what is passed in from the door
                //this.parent(target);
                //ig.game.displayCaption("You Have Picked Up A "+id.toString().capitalize()+".", 2);

                if(this.weapon == id)
                {
                    ig.game.stats.ammo += 10;
                    //text = "You Found More Ammo";
                    text = "You Didn't Find A New Weapon";
                }
                else
                {

                    this.weapon = id;
                    if(this.weapon != 0)
                    {
                        this.powerUpSFX.play();

                        ig.game.stats.ammo = 10;

                        switch(this.weapon){
                            case(1): default:
                            this.activeWeapon = "EntityBullet";
                            text = "You Found A Gun!";
                            break;
                            case(2):
                                this.activeWeapon = "EntityShotgunShell";
                                text = "You Found A Shotgun!";
                                break;
                            case(3):
                                this.activeWeapon = "EntityMachineGun";
                                text = "You Found A Machine Gun!";
                                break;
                            case(4):
                                this.activeWeapon = "EntityGrenade";
                                text = "You Found Grenades!";
                                break;
                            case(5):
                                this.activeWeapon = "EntityMine";
                                text = "You Found Land Mines!";
                                break;
                        }


                        this.clearWeaponPool();
                    }
                    else
                    {
                        this.activeWeapon = "none";
                        text = "You Are Out Of Ammo, Find A Door!";
                    }
                    this.setupAnimation(this.weapon);
                }

                if(!hideMessage && text != "")
                    ig.game.displayCaption(text, 2);
            },
            receiveDamage: function(value, from)
            {
                if(!this.invincible)
                    ig.game.shakeScreen(1, 2);

                this.parent(value, from);

            },
            onFallToDeath:function ()
            {
                this.parent();
                ig.game.shakeScreen(1, 4);
            }
        });

    });
