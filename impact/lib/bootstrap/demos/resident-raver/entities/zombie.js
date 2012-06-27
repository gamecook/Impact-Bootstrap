ig.module(
    'bootstrap.demos.resident-raver.entities.zombie'
)
    .requires(
    'bootstrap.entities.base-monster'
)
    .defines(function () {
        EntityZombie = EntityBaseMonster.extend({
            _wmIgnore: false,
            animSheet:new ig.AnimationSheet('media/bootstrap/demos/resident-raver/images/zombie.png', 16, 16),
            size: {x: 8, y:14},
            offset: {x: 4, y: 2},
            lookAhead: 5,
            deathSFX: new ig.Sound( 'media/sounds/Death.*' ),
            fallOutOfBoundsSFX: new ig.Sound( 'media/sounds/PlayerMonserFall.*' ),
            hitSoftSFX: new ig.Sound( 'media/sounds/HitSoft.*' ),
            spawner: null,
            stayOnPlatform: false,
            bloodColorOffset:1,
            init: function(x, y, settings)
            {
                this.parent(x, y, settings);
                this.spawner = settings.spawner;
                this.setupAnimation(settings.spriteOffset ? settings.spriteOffset : 0);
            },
            setupAnimation:function (offset) {
                offset = offset * 8;
                this.addAnim('walk', .07, [0+offset,1+offset,2+offset,3+offset,4+offset,5+offset]);
            },
            outOfBounds: function()
            {
                this.parent();
                if(this.spawner)
                    this.spawner.outOfBounds();
                this.fallOutOfBoundsSFX.play();
            }
        })
    })