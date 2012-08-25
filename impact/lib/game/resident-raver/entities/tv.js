ig.module(
    'game.resident-raver.entities.tv'
)
    .requires(
    'impact.sound',
    'game.resident-raver.entities.destructible'
)
    .defines(function () {
        EntityTv = EntityDestructible.extend({
            _wmIgnore: false,
            bloodColorOffset:4,
            animSheet:new ig.AnimationSheet('media/games/resident-raver/images/tv.png', 12, 14),
            size:{x:12, y:9},
            offset: {x: 0, y: 5},
            life: 5,
            /*collides:ig.Entity.COLLIDES.FIXED,*/
            hitHardSFX: new ig.Sound( 'media/bootstrap/sounds/HitHard.*' ),
            deathSFX: new ig.Sound( 'media/bootstrap/sounds/Death.*' ),
            setupAnimation:function (offset) {
                if(offset == 0)
                {
                    this.parent(0);
                }
                else if(offset == 1)
                {
                    this.addAnim('idle', .07, [1,2]);
                }

            },
            receiveDamage:function(value, from) {
                this.parent(value, from);

                if (this.health > 0) {
                    this.hitHardSFX.play();
                }
            }
        })
    });