ig.module(
    'game.jetroid.entities.base-powerup'
)
    .requires(
    'bootstrap.entities.base-item',
    'impact.sound'
)
    .defines(function () {
        EntityBasePowerup = EntityBaseItem.extend({
            _wmIgnore: true,
            animSheet:new ig.AnimationSheet('media/games/jetroid/images/powerups.png', 10, 9),
            powerUpProperty: "",
            value: 0,
            spriteID:0,
            size: {x:10, y:9},
            init:function (x, y, settings)
            {
                this.parent(x, y, settings);
                this.addAnim('idle', 1, [this.spriteID]);
            },
            /**
             * Override this method and simply add Air to the player. No need to call parent logic.
             * @param target
             */
            onPickup: function(target)
            {
                // Checks if there is a addPowerUp method on the target
                if(target.addPowerUp)
                    target.addPowerUp(this.powerUpProperty, this.value, "Picked Up More "+this.powerUpProperty.capitalize()+".");

                this.kill();
            }
        })
    })