ig.module(
    'bootstrap.demos.jetroid.entities.energy-powerup'
)
    .requires(
    'bootstrap.demos.jetroid.entities.powerup'
)
    .defines(function () {
        EntityEnergyPowerup = EntityPowerup.extend({
            _wmIgnore: false,
            powerUpProperty: "energy",
            value: 50,
            spriteID:1
        })
    })