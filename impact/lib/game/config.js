ig.module(
    'game.config'
)
    .defines(function ()
    {

        //TODO maybe this needs to be a class so you can inject logic into it?
        ig.config = {
            system:{
                debug:true,
                version:'@version@',
                trackingID:'@tracking@',
                backgroundMusic:'media/sounds/theme.*',
                backgroundMusicVolume:.5,
                soundVolume:.5,
                killAllSounds:true, /* use this for debugging if you don't want to hear sound when testing */
                devices:{
                    iphone:{width:240, height:160, scale:2},
                    android:{width:240, height:160, scale:2},
                    ipad:{width:240, height:160, scale:4},
                    default:{width:240, height:160, scale:4}
                },
                gravity:300,
                defaultLevel:"day1.js",
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
                "defaultCaption":"Fly Out Of Exit To End The Game!"

            },
            'game':{
                defaultLevel:'day1.js'
            },
            //TODO fix spelling of file names
            sounds:{
                death:"media/sounds/Death.*",
                elevatorBeep:"media/sounds/ElvatorBeep.*",
                outOfAmmo:"media/sounds/Empty.*",
                grenadeBounce:"media/sounds/GranedeBounce.*",
                grenadeExplosion:"media/sounds/GrenedeExplosion.*",
                gunFire:"media/sounds/GunFire.*",
                hitHard:"media/sounds/HitHard.*",
                hitSoft:"media/sounds/HitSoft.*",
                jump:"media/sounds/Jump.*",
                machineGunFire:"media/sounds/MachineGunFire.*",
                mineBeep:"media/sounds/MineBeep.*",
                mineExplosion:"media/sounds/MineExplosion.*",
                openDoor:"media/sounds/OpenDoor.*",
                fallToDeath:"media/sounds/PlayerMonserFall.*",
                powerUp:"media/sounds/Powerup.*",
                powerUp2:"media/sounds/Powerup2.*",
                shotgunFire:"media/sounds/ShotgunFire.*",
                startGame:"media/sounds/StartGame.*"
            }
            //TODO maybe add plugins in here?

        };

    });