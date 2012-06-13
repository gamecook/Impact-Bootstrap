ig.module(
    'bootstrap.demos.jetroid.entities.alien-a'
)
    .requires(
    'bootstrap.entities.base-monster'
)
    .defines(function () {
        EntityAlienA = EntityBaseMonster.extend({
            _wmIgnore: false,
            animSheet:new ig.AnimationSheet('lib/bootstrap/demos/jetroid/media/alien-a.png', 16, 16),
            size: {x:8, y:14},
            offset:{x:4,y:2},
            setupAnimation:function (offset) {
                offset = offset * 9;
                this.addAnim('walk', .07, [3 + offset, 4 + offset, 5 + offset, 6 + offset, 7 + offset, 8 + offset]);
            }
        })
    })