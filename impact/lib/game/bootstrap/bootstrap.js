/**
 *  @levelexit.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  This class simply loads in all he bootstrap plugins.
 */

ig.module(
    'game.bootstrap.bootstrap'
)
    .requires(
    'game.bootstrap.plugins.impact.raf',
    'game.bootstrap.plugins.impact.menu',
    'game.bootstrap.plugins.impact.tracking',
    'game.bootstrap.plugins.impact.utils',
    'game.bootstrap.plugins.impact.caption',
    'game.bootstrap.plugins.impact.pause',
    'game.bootstrap.plugins.impact.camera'
)
    .defines(function ()
    {

        /* Empty module to require all bootstrap plugins */

    });