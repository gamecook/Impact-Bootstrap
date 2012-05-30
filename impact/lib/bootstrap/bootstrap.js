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
    'bootstrap.bootstrap'
)
    .requires(
    'bootstrap.plugins.impact.raf',
    'bootstrap.plugins.impact.menu',
    'bootstrap.plugins.impact.tracking',
    'bootstrap.plugins.impact.utils',
    'bootstrap.plugins.impact.caption',
    'bootstrap.plugins.impact.pause',
    'bootstrap.plugins.impact.camera'
)
    .defines(function ()
    {

        /* Empty module to require all bootstrap plugins */

    });