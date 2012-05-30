/**
 *  @random-map.js
 *  @version: 1.00
 *  @author: Jesse Freeman
 *  @date: May 2012
 *  @copyright based on iPhone RPG, (c) 2007 Chris Knight, Creative Commons license
 *
 *  This class creates a "Random Map" button in the weltmeister editor.
 *  It requires two layers, a collision layer named "collation" and your
 *  map layer named "main". Next to the button is a size value for the
 *  map. You main layer should have a tile map which will be used by the
 *  random map generator. The first tile is the background and the second
 *  tile is the ground. The generator will automatically create the collision
 *  tiles.
 *
 *  You can manually load this plugin by including it into the weltmeister.js
 *  requires block.
 *
 */
ig.module(
    'bootstrap.plugins.weltmeister.random-map'
)
    .requires(
)
    .defines(function ()
    {
        RandomMap = ig.Class.extend({
            mapsize:0,
            dirs:[
                {x:-1, y:0},
                {x:0, y:1},
                {x:1, y:0},
                {x:0, y:-1}
            ],
            mainLayer:[],
            collisionLayer:[],
            paths:[],
            rooms:[],
            width:0,
            height:0,
            emptyRoomTiles:[],
            mainLayerSrc:[],
            collisionLayerSrc:[],
            init:function (size, mainLayer, collisionLayer)
            {
                this.mapsize = size;
                this.mainLayerSrc = mainLayer;
                this.mainLayer = mainLayer.data;
                this.mainLayer.length = 0;

                this.collisionLayerSrc = collisionLayer;

                this.collisionLayer = collisionLayer.data;
                this.collisionLayer.length = 0;

                this.wallSets = [
                    [1]
                ];
                this.roomSets = [
                    [3]
                ];
                this.hallwaySet = [
                    [3]
                ];
                this.currentWallSet = this.wallSets.random();
                // Generate Map before passing up to super
                this.randomMap(this.mapsize);
                this.genMaze();
                this.genRooms(1, 3);
                this.clearJunk();
            },
            randomMap:function (mapsize)
            {
                this.mapsize = mapsize;
                this.width = this.height = mapsize * 2 + 3;
                this.paths = [];
                this.rooms = [];
                for (var i = 0; i < this.height; i++)
                {
                    var a = [];
                    var b = [];
                    for (var j = 0; j < this.width; j++)
                    {
                        a.push('#');
                        b.push("0");
                    }
                    this.mainLayer.push(a);
                    this.collisionLayer.push(b);
                }
                return this;
            },
            genMaze:function ()
            {
                var x = 1, y = 1;
                this.mainLayer[x][y] = ' ';
                while (1)
                {
                    var dir = Math.floor(Math.random() * 4);
                    for (var i = 0; i < 4; i++)
                    {
                        var testdir = (dir + i) % 4;
                        var newx = x + this.dirs[testdir].x * 2, newy = y + this.dirs[testdir].y * 2;
                        if (newx > 0 && newx < this.width
                            && newy > 0 && newy < this.height
                            && this.mainLayer[newx][newy] == '#')
                            break;
                    }
                    if (i < 4)
                    {
                        x += this.dirs[testdir].x;
                        y += this.dirs[testdir].y;
                        this.mainLayer[x][y] = ' ';
                        x += this.dirs[testdir].x;
                        y += this.dirs[testdir].y;
                        this.mainLayer[x][y] = '' + testdir;
                    } else
                    { //backup
                        if (x == 1 && y == 1) break;
                        else
                        {
                            dir = this.mainLayer[x][y];
                            this.mainLayer[x][y] = ' ';
                            x -= this.dirs[dir].x * 2;
                            y -= this.dirs[dir].y * 2;
                        }
                    }
                }
            },
            genRooms:function (min, max)
            {
                var trycount = 0;
                while (1)
                {
                    if (trycount > 10) break;
                    var width = Math.floor(Math.random() * max) + min,
                        height = Math.floor(Math.random() * max) + min,
                        x1 = Math.floor(Math.random() * (this.mapsize - width)) * 2 + 1,
                        y1 = Math.floor(Math.random() * (this.mapsize - height)) * 2 + 1,
                        x2 = x1 + width * 2, y2 = y1 + height * 2;
                    room = new MapRoom(x1, y1, x2, y2);
                    for (var i = 0; i < this.rooms.length; i++)
                    {
                        if (room.intersects(this.rooms[i])) break;
                    }
                    if (i == this.rooms.length)
                    {
                        this.rooms.push(room);
                        trycount = 0;
                    } else
                    {
                        trycount++;
                    }
                }
                for (var i = 0; i < this.rooms.length; i++)
                {
                    var room = this.rooms[i];
                    var roomSet = this.roomSets.random();
                    for (var x = room.x1; x <= room.x2; x++)
                    {
                        for (var y = room.y1; y <= room.y2; y++)
                        {
                            this.mainLayer[x][y] = roomSet.random().toString();
                            this.emptyRoomTiles.push({x:x, y:y});
                        }
                    }
                }
            },
            clearJunk:function ()
            {
                for (var x = 0; x < this.width; x++)
                {
                    for (var y = 0; y < this.height; y++)
                    {
                        if (this.mainLayer[x][y] == ' ')
                        {
                            this.mainLayer[x][y] = this.hallwaySet.random().random();
                        }

                        if (this.mainLayer[x][y] == '#')
                        {
                            this.mainLayer[x][y] = this.currentWallSet.random();
                            this.collisionLayer[x][y] = '1';
                        }
                    }
                }

                // Adjust map width
                this.collisionLayerSrc.width = this.mainLayerSrc.width = this.width;
                this.collisionLayerSrc.height = this.mainLayerSrc.height = this.height;
            }
        });

        MapRoom = ig.Class.extend({
            x1:0,
            y1:0,
            x2:0,
            y2:0,
            init:function (x1, y1, x2, y2)
            {

                if (x1 > x2)
                {
                    var x = x1;
                    x1 = x2;
                    x2 = x;
                }
                if (y1 > y2)
                {
                    var y = y1;
                    y1 = y2;
                    y2 = y;
                }
                this.x1 = x1;
                this.y1 = y1;
                this.x2 = x2;
                this.y2 = y2;

                this.__defineGetter__('width',
                    function ()
                    {
                        return this.x2 - this.x1;
                    });
                this.__defineGetter__('height',
                    function ()
                    {
                        return this.y2 - this.y1;
                    });
                this.__defineGetter__('top', function ()
                {
                    return this.y1;
                });
                this.__defineGetter__('left', function ()
                {
                    return this.x1;
                });

                this.connectedRooms = new Object();

                return this;
            },
            toString:function ()
            {
                return '[room ' + this.x1 + ', ' + this.y1 + ', '
                    + this.x2 + ', ' + this.y2 + ']';
            },
            intersects:function (room)
            {
                return this.x1 <= room.x2 && this.x2 >= room.x1
                    && this.y1 <= room.y2 && this.y2 >= room.y1;
            },
            contains:function (x, y)
            {
                return x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2;
            },
            connected:function (otherroom, seenlist)
            {
                if (this.connectedRooms[otherroom]) return true;
                var that = this;
                if (!seenlist) seenlist = {that:true};
                if (seenlist[otherroom]) return false;
                seenlist[otherroom] = true;
                for (var i in otherroom.connectedRooms)
                {
                    if (this.connected(otherroom.connectedRooms[i], seenlist)) return true;
                }
                return false;
            }
        });
    });

//TODO need to make this auto generate layers and pop up menu with more customization options

//Add buttons to map editor
$('.headerFloat').prepend('<span style="width:10px;margin:0px 10px;">Size: <input id="randomSize" maxlength="2" style="width:20px; margin-left:5px;" type="text" name="mapSize" value="10" />');
$('.headerFloat').prepend('<input type="button" id="randomize" value="Gernate Random Map" class="button"/>');
$('#randomize').bind('click', function ()
{
    var mainLayer = ig.editor.getLayerWithName("main");
    var collisionLayer = ig.editor.getLayerWithName("collision");
    if (!mainLayer || !collisionLayer)
        alert("you need to setup a 'main' and 'collision' layer.");
    else
    {
        var randomizer = new RandomMap($('#randomSize').val(), mainLayer, collisionLayer);
    }
});


