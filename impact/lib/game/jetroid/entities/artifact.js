ig.module(
    'game.jetroid.entities.artifact'
)
    .requires(
    'game.jetroid.entities.base-chachki',
    'impact.sound'
)
    .defines(function () {
        EntityArtifact = EntityBaseChachki.extend({
            _wmIgnore: false,
            animSheet:new ig.AnimationSheet('media/games/jetroid/images/artifacts.png', 5, 9),
            name: "Artifact",
            types: ["Worthless", "Normal", "Special","Rare"],
            size: {x:5, y:9}
        })
    })