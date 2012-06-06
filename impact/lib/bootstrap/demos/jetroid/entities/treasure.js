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
            animSheet:new ig.AnimationSheet('lib/bootstrap/demos/jetroid/media/treasure.png', 10, 10),
            types: ["A", "B", "C","D"],
            size: {x:10, y:10}
        })
    })