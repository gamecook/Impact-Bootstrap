ig.module(
    'bootstrap.demos.jetroid.entities.treasure'
)
    .requires(
    'bootstrap.demos.jetroid.entities.base-chachki',
    'impact.sound'
)
    .defines(function () {
        EntityTreasure = EntityBaseChachki.extend({
            _wmIgnore: false,
            animSheet:new ig.AnimationSheet('media/bootstrap/demos/jetroid/images/treasure.png', 10, 10),
            name: "Treasure Chest",
            types: ["Empty", "Lite", "Heavy","Full"],
            size: {x:10, y:10}
        })
    })