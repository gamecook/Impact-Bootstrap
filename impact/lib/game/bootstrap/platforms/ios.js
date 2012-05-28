/**
 *  @ios.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

ig.module(
    'game.bootstrap.platforms.ios'
)
    .requires(
    'game.bootstrap.bootstrap-config'
)

    .defines(function ()
    {

        //TODO need to have this load up iPhone specific plugin and inject logic to draw controls in the game instead of as divs

        if (ig.config.system.killAllSounds)
            ig.Sound.enabled = false;

        var sizes = ig.config.system.devices;

        ig.gameSize = sizes.default;

        if (ig.ua.iPhone)
        {
            ig.gameSize = sizes.iphone;
        } else if (ig.ua.iPad)
        {
            ig.gameSize = sizes.ipad
        }

    });
