ig.module(
    'game.resident-raver.entities.destructible'
)
    .requires(
    'bootstrap.entities.base-player',
    'impact.sound',
    'bootstrap.plugins.impact.caption'
)
    .defines(function () {
        EntityDestructible = EntityBaseActor.extend({
            _wmIgnore: true,
            maxVel:{x:0, y:100},
            friction:{x:0, y:0},
            type:ig.Entity.TYPE.A,
            checkAgainst:ig.Entity.TYPE.B,
            collides:ig.Entity.COLLIDES.ACTIVE,
            init: function(x, y, settings)
            {
                this.parent(x, y, settings);
                this.setupAnimation(settings.spriteOffset ? settings.spriteOffset : 0);
            },
            setupAnimation:function (offset) {
                this.addAnim('idle', .07, [0 + offset]);
            },
            receiveDamage:function(value, from) {

                //Ignore damage from anything standing above this entity
                if((from.pos.y+from.size.y-3) < this.pos.y)
                    return;

                this.parent(value, from);

                //TODO this is kind of hard coded to make any Type B entity who hits it flip.
                from.flip = !from.flip;

            }
        })
    });