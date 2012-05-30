/**
 *  @chrome.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

ig.module(
    'bootstrap.platforms.chrome'
)
    .requires(
    'bootstrap.bootstrap-config'
)

    .defines(function ()
    {

        //TODO do we need any chrome specific logic? I can put in hooks for in app purchases?

        // Remove touch controls
        var controls = document.getElementById("controls");
        if (controls)
            document.getElementById('game-container').removeChild(controls);

        if (ig.config.system.killAllSounds)
            ig.Sound.enabled = false;

        var sizes = ig.config.system.devices;

        ig.gameSize = sizes.default;

    });
