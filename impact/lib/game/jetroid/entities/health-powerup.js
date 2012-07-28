ig.module(
    'game.jetroid.entities.health-powerup'
)
    .requires(
    'game.jetroid.entities.base-powerup'
)
    .defines(function () {
        EntityHealthPowerup = EntityBasePowerup.extend({
            _wmIgnore: false,
            powerUpProperty: "health",
            value: 10,
            spriteID:0
        })
    })