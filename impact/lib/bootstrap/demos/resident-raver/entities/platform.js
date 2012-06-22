
ig.module(
    'bootstrap.demos.resident-raver.entities.platform'
)
    .requires(
    'bootstrap.entities.base-platform'

)
    .defines(function ()
    {

        EntityPlatform = EntityBasePlatform.extend({
            _wmIgnore: false,
            animSheet:new ig.AnimationSheet('media/bootstrap/demos/resident-raver/images/elevator.png', 32, 10),
            size:{x:32, y:10},
            init: function(x, y, settings)
            {
                this.parent(x, y, settings);

                this.addAnim('idle', 1, [0]);
            }
        })

    })