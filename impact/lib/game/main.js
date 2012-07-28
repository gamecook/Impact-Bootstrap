/**
 *
 * TODO need to explain how this works here
 *
 */

ig.module(
    'game.main'
)
    .requires(
    'plugins.impact-splash-loader.impact-splash-loader',
    /* build game */ 'bootstrap.demos.resident-raver.resident-raver', /* end build game */
    /* build plugin */ 'bootstrap.platforms.web', /* end build plugin */
    /* build debug */ 'impact.debug.debug' /* end build debug */
)

.defines(function () {

    /* build debug */
    // This is to help with debugging. Simply set killAllSounds to true in the config when testing locally
    if (ig.config.system.killAllSounds)
        ig.Sound.enabled = false;
    /* end build debug */

    // ig.gameSize is automatically defined by the platform template you use or you can manually set it yourself
    ig.main('#canvas', StartScreen, 60, ig.gameSize.width, ig.gameSize.height, ig.gameSize.scale, ig.ImpactSplashLoader);

});
