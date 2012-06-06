ig.module(
    'bootstrap.demos.jetroid.entities.air-powerup'
)
    .requires(
    'bootstrap.demos.jetroid.entities.base-powerup'
)
    .defines(function () {
        EntityAirPowerup = EntityBasePowerup.extend({
            _wmIgnore: false,
            powerUpProperty: "air",
            value: 50,
            spriteID:2
        })
    })