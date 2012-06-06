ig.module(
    'bootstrap.demos.jetroid.entities.air-powerup'
)
    .requires(
    'bootstrap.demos.jetroid.entities.powerup'
)
    .defines(function () {
        EntityAirPowerup = EntityPowerup.extend({
            _wmIgnore: false,
            powerUpProperty: "air",
            value: 50,
            spriteID:2
        })
    })