/**
 *  @levelexit.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  This allows Weltmeister to see bootstrap entities. This is a copy of
 *  'weltmeister/entities.js' since it can't be extended.
 *
 *  You can also manually add this plugin to the 'welmeister.js' requires
 *  list.
 *
 */
ig.module(
    'game.bootstrap.plugins.weltmeister.entities'
)
    .requires(
    'weltmeister.config',
    'weltmeister.edit-entities'
)
    .defines(function ()
    {

// Load the list of entity files via AJAX PHP glob
        var path = wm.config.api.glob + '?',
            globs = typeof wm.config.project.entityFiles == 'string' ?
                ["lib/game/bootstrap/entities/*.js"] :
                "lib/game/bootstrap/entities/*.js";

        for (var i = 0; i < globs.length; i++)
        {
            path += 'glob[]=' + encodeURIComponent(globs[i]) + '&';
        }

        path += 'nocache=' + Math.random();

        var req = $.ajax({
            url:path,
            method:'get',
            dataType:'json',

            async:false,
            success:function (files)
            {

                // File names to Module names
                var moduleNames = [];
                var modules = {};
                for (var i = 0; i < files.length; i++)
                {
                    var name = files[i].replace(/^lib\/|\.js$/g, '').replace(/\//g, '.');
                    moduleNames.push(name);
                    modules[name] = files[i];
                }
                // Define a Module that requires all entity Modules
                ig.module('bootstrap.entities')
                    .requires.apply(ig, moduleNames)
                    .defines(function ()
                    {
                        wm.bootstrapEntityModules = modules
                    });
            },

            error:function (xhr, status, error)
            {
                throw(
                    "Failed to load entity list via glob.php: " + error + "\n" +
                        xhr.responseText
                    );
            }
        });

        wm.EditEntities.inject({

            init:function (div)
            {
                //TODO this needs to be cleaned up since the entity list is unsorted
                if (wm.entityModules && wm.bootstrapEntityModules)
                {
                    wm.entityModules = $.extend(wm.entityModules, wm.bootstrapEntityModules)
                }
                else if (!wm.entityModules && wm.bootstrapEntityModules)
                {
                    wm.entityModules = wm.bootstrapEntityModules;

                }
                this.parent(div);
            }

        });

    });