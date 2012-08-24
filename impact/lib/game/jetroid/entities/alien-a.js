ig.module(
    'game.jetroid.entities.alien-a'
)
    .requires(
    'bootstrap.entities.base-monster'
)
    .defines(function () {
        EntityAlienA = EntityBaseMonster.extend({
            _wmIgnore: false,
            animSheet:new ig.AnimationSheet('media/games/jetroid/images/alien-a.png', 16, 16),
            size: {x:8, y:10},
            offset:{x:4,y:6},
            lookAhead: 5,
            setupAnimation:function (offset) {
                offset = offset * 9;
                this.addAnim('walk', .07, [3 + offset, 4 + offset, 5 + offset, 6 + offset, 7 + offset, 8 + offset]);
            },
            check:function (other)
            {
                this.parent(other);
            }
        })
    })