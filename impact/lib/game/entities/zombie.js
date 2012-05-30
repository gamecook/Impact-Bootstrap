ig.module(
    'game.entities.zombie'
)
    .requires(
    'bootstrap.entities.core.base-monster',
    'impact.sound'
)
    .defines(function () {
        EntityZombie = EntityBaseMonster.extend({
            animSheet:new ig.AnimationSheet('media/bootstrap/images/zombie.png', 16, 16),
            size:{x:8, y:14},
            offset:{x:4, y:2},
            deathSFX:new ig.Sound('media/sounds/Death.*'),
            fallOutOfBoundsSFX:new ig.Sound('media/sounds/PlayerMonserFall.*'),
            hitSoftSFX:new ig.Sound('media/sounds/HitSoft.*'),
            setupAnimation:function (offset) {
                offset = offset * 8;
                this.addAnim('walk', .07, [0 + offset, 1 + offset, 2 + offset, 3 + offset, 4 + offset, 5 + offset]);
            },
            onDeathAnimation:function () {
                this.parent();
                this.deathSFX.play();
            },
            outOfBounds:function () {
                this.fallOutOfBoundsSFX.play();
                this.parent();
            }
        });

    });
