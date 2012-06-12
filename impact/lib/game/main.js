ig.module(
    'game.main'
)
    .requires(
    'bootstrap.demos.jetroid.jetroid', // Change this to any demo you want to run
    'bootstrap.platforms.web' // You can change this out to another platform
)

.defines(function () {

    // This class simply imports a demo game in the requires block above

    // This is to help with debugging. Simply set killAllSounds to true in the config when testing locally
    if (ig.config.system.killAllSounds)
        ig.Sound.enabled = false;

    // ig.gameSize is automatically defined by the platform template you use or you can manually set it yourself
    ig.main('#canvas', StartScreen, 60, ig.gameSize.width, ig.gameSize.height, ig.gameSize.scale * ig.ua.pixelRatio);

});
