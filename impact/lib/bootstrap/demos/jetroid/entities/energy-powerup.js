ig.module(
    'bootstrap.demos.jetroid.entities.energy-powerup'
)
    .requires(
    'bootstrap.demos.jetroid.entities.base-powerup'
)
    .defines(function () {
        EntityEnergyPowerup = EntityBasePowerup.extend({
            _wmIgnore: false,
            powerUpProperty: "energy",
            value: 50,
            spriteID:1
        })
    })