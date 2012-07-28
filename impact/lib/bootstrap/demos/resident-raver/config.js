ig.module(
    'bootstrap.demos.resident-raver.config'
)
    .defines(function ()
    {

        //TODO maybe this needs to be a class so you can inject logic into it?
        ig.config = {
            system:{
                debug:true,
                version:'@version@',
                trackingID:'@tracking@',
                backgroundMusic:'media/bootstrap/sounds/theme.*',
                backgroundMusicVolume:.5,
                soundVolume:.5,
                killAllSounds:true, /* use this for debugging if you don't want to hear sound when testing */
                devices:{
                    iphone:{width:240, height:160, scale:2},
                    android:{width:240, height:160, scale:2},
                    ipad:{width:240, height:160, scale:4},
                    default:{width:240, height:160, scale:3}
                },
                gravity:300,
                defaultLevel:"dorms.js",
                input: {

                    'keys':{
                        'LEFT_ARROW':'left',
                        'RIGHT_ARROW':'right',
                        'X':'jump',
                        'C':'shoot',
                        'SPACE':'continue',
                        'Q':'quit',
                        'ESC':'pause',
                        'Z':'open'
                    },
                    'touch':{
                        '#buttonLeft':'left',
                        '#buttonRight':'right',
                        '#buttonJump':'jump',
                        '#buttonShoot':'shoot',
                        '#canvas':'continue',
                        '#canvas':'pause'
                    }

                }
            },
            camera:{
                debug:true,
                lightMask:"media/lighting.png",
                trapSizeScale:{x:3, y:3},
                lookAhead:{x:0, y:0}
            },
            //TODO may need to break this up into keys for specific screens

            //TODO should I have touch and keyboard text?
            'text':{
                "defaultCaption":""

            },
            'game':{
                defaultLevel:'day1.js'
            },
            //TODO fix spelling of file names
            sounds:{
                death:"media/bootstrap/sounds/Death.*",
                elevatorBeep:"media/bootstrap/sounds/ElvatorBeep.*",
                outOfAmmo:"media/bootstrap/sounds/Empty.*",
                grenadeBounce:"media/bootstrap/sounds/GrenadeBounce.*",
                grenadeExplosion:"media/bootstrap/sounds/GrenadeExplosion.*",
                gunFire:"media/bootstrap/sounds/GunFire.*",
                hitHard:"media/bootstrap/sounds/HitHard.*",
                hitSoft:"media/bootstrap/sounds/HitSoft.*",
                jump:"media/bootstrap/sounds/Jump.*",
                machineGunFire:"media/bootstrap/sounds/MachineGunFire.*",
                mineBeep:"media/bootstrap/sounds/MineBeep.*",
                mineExplosion:"media/bootstrap/sounds/MineExplosion.*",
                openDoor:"media/bootstrap/sounds/OpenDoor.*",
                fallToDeath:"media/bootstrap/sounds/PlayerMonsterFall.*",
                powerUp:"media/bootstrap/sounds/Powerup.*",
                powerUp2:"media/bootstrap/sounds/Powerup2.*",
                shotgunFire:"media/bootstrap/sounds/ShotgunFire.*",
                startGame:"media/bootstrap/sounds/StartGame.*"
            }
            //TODO maybe add plugins in here?

        };

    });