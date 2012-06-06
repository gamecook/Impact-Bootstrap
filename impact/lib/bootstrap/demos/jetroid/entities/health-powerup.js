ig.module(
    'bootstrap.demos.jetroid.entities.health-powerup'
)
    .requires(
    'bootstrap.demos.jetroid.entities.powerup'
)
    .defines(function () {
        EntityHealthPowerup = EntityPowerup.extend({
            _wmIgnore: false,
            powerUpProperty: "health",
            value: 10,
            spriteID:0
        })
    })