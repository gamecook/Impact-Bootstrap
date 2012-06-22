
ig.module(
    'bootstrap.demos.resident-raver.entities.elevator'
)
    .requires(
    'bootstrap.entities.base-elevator'

)
    .defines(function ()
    {

        EntityElevator = EntityBaseElevator.extend({
            _wmIgnore: false,
            animSheet:new ig.AnimationSheet('media/bootstrap/demos/resident-raver/images/elevator.png', 32, 48),
            size:{x:32, y:48},
            init: function(x, y, settings)
            {
                this.parent(x, y, settings);

                this.addAnim('idle', 1, [0]);
                this.addAnim('up', 1, [1]);
                this.addAnim('down', 1, [2]);
            },
            update:function ()
            {
                this.parent();

                if (this.angle < 0)
                    this.currentAnim = this.anims.up;
                else if (this.angle > 0)
                    this.currentAnim = this.anims.down;
                else
                    this.currentAnim = this.anims.idle;
            }
        })

    })