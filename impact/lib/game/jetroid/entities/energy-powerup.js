ig.module(
    'game.jetroid.entities.energy-powerup'
)
    .requires(
    'game.jetroid.entities.base-powerup'
)
    .defines(function () {
        EntityEnergyPowerup = EntityBasePowerup.extend({
            _wmIgnore: false,
            powerUpProperty: "energy",
            value: 50,
            spriteID:1
        })
    })