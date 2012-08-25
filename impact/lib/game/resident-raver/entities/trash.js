ig.module(
    'game.resident-raver.entities.trash'
)
    .requires(
    'impact.sound',
    'game.resident-raver.entities.destructible'
)
    .defines(function () {
        EntityTrash = EntityDestructible.extend({
            _wmIgnore: false,
            bloodColorOffset: 4,
            animSheet:new ig.AnimationSheet('media/games/resident-raver/images/trash.png', 7, 11),
            size:{x:7, y:9},
            offset: {x:0, y: 2},
            life: 30,
            /*collides:ig.Entity.COLLIDES.FIXED,*/
            hitHardSFX: new ig.Sound( 'media/bootstrap/sounds/HitHard.*' ),
            deathSFX: new ig.Sound( 'media/bootstrap/sounds/Death.*' ),
            receiveDamage:function(value, from) {
                this.parent(value, from);

                if (this.health > 0) {
                    this.hitHardSFX.play();
                }
            }
        })
    });