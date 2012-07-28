ig.module(
    'game.jetroid.entities.air-powerup'
)
    .requires(
    'game.jetroid.entities.base-powerup'
)
    .defines(function () {
        EntityAirPowerup = EntityBasePowerup.extend({
            _wmIgnore: false,
            powerUpProperty: "air",
            value: 50,
            spriteID:2
        })
    })