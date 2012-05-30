/**
 *  @levelexit.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 * This entity does nothing but just sits there. It can be used as a target
 * for other entities, such as movers.
 */

ig.module(
    'bootstrap.entities.void'
)
    .requires(
    'impact.entity'
)
    .defines(function ()
    {

        EntityVoid = ig.Entity.extend({
            _wmDrawBox:true,
            _wmBoxColor:'rgba(128, 28, 230, 0.7)',
            _wmScalable:true,
            size:{x:8, y:8},

            update:function ()
            {
            }
        });

    });