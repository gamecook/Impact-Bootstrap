ig.module(
    'bootstrap.demos.jetroid.entities.health-powerup'
)
    .requires(
    'bootstrap.demos.jetroid.entities.base-powerup'
)
    .defines(function () {
        EntityHealthPowerup = EntityBasePowerup.extend({
            _wmIgnore: false,
            powerUpProperty: "health",
            value: 10,
            spriteID:0
        })
    })