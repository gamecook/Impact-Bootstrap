ig.module(
    'game.jetroid.entities.treasure'
)
    .requires(
    'game.jetroid.entities.base-chachki',
    'impact.sound'
)
    .defines(function () {
        EntityTreasure = EntityBaseChachki.extend({
            _wmIgnore: false,
            animSheet:new ig.AnimationSheet('media/games/jetroid/images/treasure.png', 10, 10),
            name: "Treasure Chest",
            types: ["Empty", "Lite", "Heavy","Full"],
            size: {x:10, y:10}
        })
    })