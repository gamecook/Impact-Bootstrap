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
)

    .defines(function ()
    {

        // Remove touch controls
        var controls = document.getElementById("controls");
        if (controls)
            document.getElementById('game-container').removeChild(controls);

        var sizes = {
            iPhone:{width:240, height:160, scale:2},
            android:{width:240, height:160, scale:2},
            iPad:{width:240, height:160, scale:4},
            default:{width:240, height:160, scale:4}
        };

        var sizes = ig.config.system.devices;

        ig.gameSize = sizes.default;

    });
