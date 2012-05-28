ig.module('game.levels.template')
    .requires('impact.image', 'game.entities.player', 'game.entities.outofbounds', 'game.entities.void', 'game.entities.void', 'game.entities.void', 'game.entities.void', 'game.entities.powerupspawner', 'game.entities.elevator', 'game.entities.void', 'game.entities.void', 'game.entities.void', 'game.entities.void', 'game.entities.void', 'game.entities.void', 'game.entities.void', 'game.entities.spawner')
    .defines(function () {
        LevelTemplate = /*JSON[*/{"entities":[
            {"type":"EntityPlayer", "x":20, "y":194, "settings":{"name":"player"}},
            {"type":"EntityOutofbounds", "x":44, "y":244, "settings":{"size":{"x":172, "y":16}}},
            {"type":"EntityVoid", "x":284, "y":24, "settings":{"name":"cord1"}},
            {"type":"EntityVoid", "x":284, "y":208, "settings":{"name":"cord2"}},
            {"type":"EntityVoid", "x":272, "y":44, "settings":{"size":{"x":32, "y":48}, "name":"floor2"}},
            {"type":"EntityVoid", "x":272, "y":144, "settings":{"size":{"x":32, "y":48}, "name":"floor1"}},
            {"type":"EntityPowerupspawner", "x":-80, "y":28, "settings":{"size":{"x":16, "y":12}, "spawnEntity":"EntityZombie", "delay":2, "maxPool":40, "name":"zombie"}},
            {"type":"EntityElevator", "x":272, "y":92, "settings":{"target":{"1":"floor1", "2":"floor2"}, "cord":{"1":"cord1", "2":"cord2"}}},
            {"type":"EntityVoid", "x":-88, "y":168, "settings":{"size":{"x":16, "y":32}, "name":"door1"}},
            {"type":"EntityVoid", "x":-88, "y":128, "settings":{"size":{"x":16, "y":32}, "name":"door2"}},
            {"type":"EntityVoid", "x":-68, "y":168, "settings":{"size":{"x":16, "y":32}, "name":"door3"}},
            {"type":"EntityVoid", "x":-68, "y":128, "settings":{"size":{"x":16, "y":32}, "name":"door4"}},
            {"type":"EntityVoid", "x":-88, "y":92, "settings":{"size":{"x":16, "y":32}, "name":"door5"}},
            {"type":"EntityVoid", "x":-68, "y":92, "settings":{"size":{"x":16, "y":32}, "name":"door6"}},
            {"type":"EntityVoid", "x":0, "y":-16, "settings":{"name":"settings", "defaultCaption":"Welcome Message Goes Here"}},
            {"type":"EntitySpawner", "x":-80, "y":56, "settings":{"name":"door", "spawnEntity":"EntityDoor", "maxPool":1, "delay":2, "target":{"1":"door1", "2":"door2", "3":"door3", "4":"door4", "5":"door5", "6":"door6"}}}
        ], "layer":[
            {"name":"main", "width":16, "height":14, "linkWithCollision":false, "visible":1, "tilesetName":"media/dorm-tiles-red.png", "repeat":false, "preRender":true, "distance":"1", "tilesize":16, "foreground":false, "data":[
                [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                [5, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 5],
                [5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5],
                [5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5],
                [5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5],
                [5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5],
                [5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5],
                [5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5],
                [5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5],
                [5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5],
                [5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5],
                [5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 5],
                [5, 19, 22, 22, 22, 22, 22, 21, 21, 22, 22, 22, 22, 22, 20, 5],
                [5, 14, 14, 14, 14, 14, 14, 5, 5, 14, 14, 14, 14, 14, 14, 5]
            ]},
            {"name":"collision", "width":16, "height":14, "linkWithCollision":false, "visible":1, "tilesetName":"", "repeat":false, "preRender":false, "distance":1, "tilesize":16, "foreground":false, "data":[
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ]}
        ]}/*]JSON*/;
        LevelTemplateResources = [new ig.Image('media/dorm-tiles-red.png')];
    });