ig.module(
    'game.entities.platform'
)
    .requires(
    'bootstrap.entities.mover',
    'impact.sound'
)
    .defines(function () {
        EntityPlatform = EntityMover.extend({
            animSheet:new ig.AnimationSheet('media/bootstrap/images/elevator.png', 32, 10),
            size:{x:32, y:10},
            type:ig.Entity.TYPE.B,
            checkAgainst:ig.Entity.TYPE.BOTH,
            collides:ig.Entity.COLLIDES.FIXED,
            init:function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 1, [0]);
            }
        });

    });
