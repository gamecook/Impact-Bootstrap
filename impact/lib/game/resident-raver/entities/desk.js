ig.module(
    'game.resident-raver.entities.desk'
)
    .requires(
    'impact.sound',
    'game.resident-raver.entities.destructible'
)
    .defines(function () {
        EntityDesk = EntityDestructible.extend({
            _wmIgnore: false,
            bloodColorOffset:3,
            animSheet:new ig.AnimationSheet('media/games/resident-raver/images/desk.png', 18, 9),
            size:{x:18, y:9},
            life: 30,
            collides:ig.Entity.COLLIDES.FIXED,
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