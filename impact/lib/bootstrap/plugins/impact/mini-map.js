/**
 *  @camera.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright (c) 2012 Jesse Freeman, under The MIT License (see LICENSE)
 *
 *  This is a simple plugin that adds a mini-map to the display. It injects the
 *  code to render the map into the ig.Game class and you can activate it by
 *  setting the showMiniMap in the ig.Game class to true. It is set to false
 *  by default.
 *
 */
ig.module(
    'bootstrap.plugins.impact.mini-map'
)
    .requires(
    'impact.debug.menu',
    'impact.game',
    'impact.background-map'
)
    .defines(function () {

        MiniMap = ig.Class.extend({
            maps:[],
            mapScreens:[],


            init:function (x, y, scale) {

            },


            load:function (game) {
                if (!game || !game.backgroundMaps.length) {
                    return;
                }

                this.mapCanvas = ig.$new('canvas');
                this.ctx = this.mapCanvas.getContext('2d');

                this.maps = game.backgroundMaps;
                this.mapScreens = [];

                for (var m = 0; m < this.maps.length; m++) {
                    var map = this.maps[m];
                    this.generateMiniMap(this.ctx, map, m);
                }
            },


            generateMiniMap:function (context, map) {
                var s = ig.system.scale; // we'll need this a lot

                // resize the tileset, so that one tile is 's' pixels wide and high
                var ts = ig.$new('canvas');
                var tsctx = ts.getContext('2d');

                var w = map.tiles.width * s;
                var h = map.tiles.height * s;
                var ws = w / map.tilesize;
                var hs = h / map.tilesize;
                tsctx.drawImage(map.tiles.data, 0, 0, w, h, 0, 0, ws, hs);


                console.log("Mini map size", w, h, ws, hs);
                // create the minimap canvas
                var mapCanvas = ig.$new('canvas');
                mapCanvas.width = map.width * s;
                mapCanvas.height = map.height * s;
                var ctx = context;//mapCanvas.getContext('2d');

                if (ig.game.clearColor) {
                    ctx.fillStyle = ig.game.clearColor;
                    ctx.fillRect(0, 0, ws, hs);
                }

                // draw the map
                var tile = 0;
                for (var x = 0; x < map.width; x++) {
                    for (var y = 0; y < map.height; y++) {
                        if ((tile = map.data[y][x])) {
                            ctx.drawImage(
                                ts,
                                Math.floor(((tile - 1) * s) % ws),
                                Math.floor((tile - 1) * s / ws) * s,
                                s, s,
                                x * s, y * s,
                                s, s
                            );
                        }
                    }
                }
            }

        });


        ig.Game.inject({
            showMiniMap:true,
            miniMapInstance: new MiniMap(), //TODO need a way to set the scale of the mini-map
            miniMapHighlightColor:'#f00',
            miniMapView:{x:0, y:0},
            miniMapViewPort: {x:0, y:0},
            miniMapPosition: {x:10, y:10},
            loadLevel:function (data) {
                this.parent(data);
                this.miniMapInstance.load(this);

                var map = this.backgroundMaps[0];
                var s = ig.system.scale;
                this.miniMapViewPort = {x:((ig.system.width / map.tilesize) * s - 2), y:((ig.system.height / map.tilesize) * s - 2)};
            },
            draw:function () {
                this.parent();
                this.onDrawMiniMap();
            },
            onDrawMiniMap: function()
            {
                if (this.showMiniMap && this.miniMapInstance.mapCanvas && this.backgroundMaps) {

                    var ctx = ig.system.context;
                    // Get scale
                    var s = ig.system.scale;

                    // Draw Map
                    ctx.drawImage(this.miniMapInstance.mapCanvas, this.miniMapPosition.x, this.miniMapPosition.y);

                    // Get reference to map
                    var map = this.backgroundMaps[0];

                    // Get visible area
                    var x = map.scroll.x / map.tilesize;
                    var y = map.scroll.y / map.tilesize;

                    // Draw box around visible area
                    ctx.strokeStyle = this.miniMapHighlightColor;
                    ctx.strokeRect(x * s + this.miniMapPosition.x, y * s + this.miniMapPosition.y, this.miniMapViewPort.x, this.miniMapViewPort.y);

                }
            }
        });

    });