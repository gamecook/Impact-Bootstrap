ig.module(
    'game.resident-raver.entities.base-zombie'
)
    .requires(
    'bootstrap.entities.base-monster'
)
    .defines(function () {
        EntityBaseZombie = EntityBaseMonster.extend({
            _wmIgnore: true,
            lookAhead: 5,
            spawner: null,
            stayOnPlatform: false,
            bloodColorOffset:1,
            spriteOffsetTotal: 8,
            fallOutOfBoundsSFX: new ig.Sound( 'media/bootstrap/sounds/PlayerMonsterFall.*' ),
            deathSFX: new ig.Sound( 'media/bootstrap/sounds/Death.*' ),
            hitSoftSFX: new ig.Sound( 'media/bootstrap/sounds/HitSoft.*' ),
            init: function(x, y, settings)
            {
                this.parent(x, y, settings);
                this.spawner = settings.spawner;
                this.setupAnimation(settings.spriteOffset ? settings.spriteOffset : 0);
            },
            setupAnimation:function (offset) {
                offset = offset * this.spriteOffsetTotal;
                this.addAnim('walk', .07, [0+offset,1+offset,2+offset,3+offset,4+offset,5+offset]);
            },
            outOfBounds: function()
            {
                this.parent();
                if(this.spawner)
                    this.spawner.outOfBounds();
                this.fallOutOfBoundsSFX.play();
            },
            kill:function (noAnimation)
            {
                this.parent(noAnimation);
                if(this.spawner)
                    this.spawner.removeItem();
            }

        })
    })