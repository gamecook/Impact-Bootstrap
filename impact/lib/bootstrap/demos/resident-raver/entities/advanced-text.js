/**
 *  @levelexit.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 */

ig.module(
    'bootstrap.demos.resident-raver.entities.advanced-text'
)
    .requires(
    'bootstrap.entities.text',
    'plugins.imageblender.imageblender'
)
    .defines(function ()
    {

        EntityAdvancedText = EntityText.extend({
            init: function(x, y, settings)
            {
                if(settings.color)
                    this.font = new ig.Font('media/bootstrap/images/04b03.font.png'+settings.color);
                this.parent(x,y,settings);
            }

        });

    });

