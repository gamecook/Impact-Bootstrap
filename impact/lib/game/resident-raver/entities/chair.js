ig.module(
    'game.resident-raver.entities.chair'
)
    .requires(
    'impact.sound',
    'game.resident-raver.entities.crate',
    'game.resident-raver.entities.destructible'
)
    .defines(function () {
        EntityChair = EntityDestructible.extend({
            _wmIgnore: false,
            bloodColorOffset:3,
            animSheet:new ig.AnimationSheet('media/games/resident-raver/images/chair.png', 8, 15),
            size:{x:8, y:8},
            offset: {x:0, y:7},
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