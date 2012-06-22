ig.module(
    'bootstrap.demos.resident-raver.entities.crate'
)
    .requires(
    'bootstrap.entities.base-player',
    'impact.sound',
    'bootstrap.plugins.impact.caption'
)
    .defines(function () {
        EntityCrate = EntityBaseActor.extend({
            _wmIgnore: false,
            animSheet:new ig.AnimationSheet('media/bootstrap/demos/resident-raver/images/crate.png', 10, 10),
            size:{x:10, y:10},
            maxVel:{x:0, y:100},
            friction:{x:0, y:0},
            type:ig.Entity.TYPE.A,
            checkAgainst:ig.Entity.TYPE.B,
            collides:ig.Entity.COLLIDES.ACTIVE,
            life:20,
            hitHardSFX: new ig.Sound( 'media/sounds/HitHard.*' ),
            deathSFX: new ig.Sound( 'media/sounds/Death.*' ),
            init: function(x, y, settings)
            {
                this.parent(x, y, settings);
                this.setupAnimation(settings.spriteOffset ? settings.spriteOffset : 0);
            },
            setupAnimation:function (offset) {
                offset = 0;//offset * 8;
                this.addAnim('idle', .07, [0 + offset]);
            },
            receiveDamage:function(value, from) {
                this.parent(value, from);

                //TODO this is kind of hard coded to make any Type B entity who hits it flip.
                from.flip = !from.flip;
                if (this.health > 0) {
                    this.hitHardSFX.play();
                }
            }
        })
    });