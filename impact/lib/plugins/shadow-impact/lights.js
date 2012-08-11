/**
    Dynamic Shadow Casting for ImpactJS (http://www.impactjs.com)

    @version 0.31
    @date 2012-05-08
    @author Marc Henklein ( @snooze82, snooze82@gmail.com )

    see https://github.com/fourty2/ShadowImpact for more information

**/
ig.module(
    'plugins.shadow-impact.lights'
)
.requires(
    'impact.impact',
    'impact.entity'
)
.defines(function() {

ig.LightManager = ig.Class.extend({ 
    instance: null,
    // singleton behaviour
    staticInstantiate: function(ignore) {
        if (ig.LightManager.instance == null) {
            return null;
        } else {
            return ig.LightManager.instance;
        }
    },
    // defaults
    lights: [],     // this array holds all lightsources
    _drawn: false,  // indicates if there is something to draw
    shadowLayer: null, // canvas and context for shadow map
    shadowCtx: null,
    lightLayer: null, // canvas and context for light map
    lightCtx: null, 
    baseColor: 'rgba(0,0,0,0.6)', // default shadow color
    basecolorValues: [0,0,0, 255 * 0.6], // array with base color values
    pulseAngle: 0,
    vector: function(_x,_y){
        this.x = _x;
        this.y = _y;  
    },
    lightSource: function(_entity, _config){
        this.entity = _entity;
        this.color = _config.color;
        this.shadowColor = _config.shadowColor ? _config.shadowColor : this.color;
        this.useGradients = _config.useGradients ? _config.useGradients : false;
        this.shadowGradientStart = _config.shadowGradientStart;
        this.shadowGradientStop = _config.shadowGradientStop;
        this.lightGradientStart = _config.lightGradientStart;
        this.lightGradientStop = _config.lightGradientStop;
        this.radius = _config.radius;
        this.angleSpread = _config.angleSpread;
        this.position = {x:0,y:0};
        this.mapPosition = {x:0,y:0};
        this.angle = _config.angle;
        this.pulseFactor = _config.pulseFactor ? _config.pulseFactor : 5 ;
        this.lightOffset = _config.lightOffset ? _config.lightOffset :  {x:0,y:0};
        this.type = _config.type ? _config.type : 0;
    },
    init: function(_baseColor, _basecolorValues) {

        // build canvas
        this.shadowLayer = ig.$new('canvas');
        this.shadowLayer.width = ig.system.width;
        this.shadowLayer.height = ig.system.height;
        this.shadowCtx = this.shadowLayer.getContext('2d');

        this.lightLayer = ig.$new('canvas');
        this.lightLayer.width = ig.system.width;
        this.lightLayer.height = ig.system.height;
        this.lightCtx = this.lightLayer.getContext('2d');


        if (_baseColor) this.baseColor = _baseColor;
        if (_basecolorValues) this.basecolorValues = _basecolorValues;

        ig.LightManager.instance = this;
    },
    addLight: function(entity, config) {
        var newLightSource = new this.lightSource(entity, config);
        this.lights.push(newLightSource);
        return newLightSource;
    },
    removeLightByIndex: function(index) {
        if (this.lights.length < index) {
            this.lights.splice(index,1);
        }
    },
    removeLight: function(light) {
        for (var i=0; i<this.lights.length; i++) {
            if (this.lights[i] == light) {
                this.lights.splice(i,1);
                break;
            }
        }
    },
    shine: function() {
        this.drawShadowMap();
        this.drawLightMap();
    },
    update: function() {
        // update position of light sources
        for (var lightIndex = this.lights.length; lightIndex--; ) {
            var l = this.lights[lightIndex];

            if (l.type == 2) {
                l.position.x = l.entity.pos.x - ig.game.screen.x + l.lightOffset.x ;
                l.mapPosition.x = (l.entity.pos.x + l.lightOffset.x) / ig.game.collisionMap.tilesize;
                l.position.y = l.entity.pos.y - ig.game.screen.y + l.entity.size.y/2 + l.lightOffset.y;
                l.mapPosition.y = (l.entity.pos.y + l.entity.size.y/2 + l.lightOffset.y) / ig.game.collisionMap.tilesize;

            } else {
                l.position.x = l.entity.pos.x - ig.game.screen.x + l.entity.size.x/2 + l.lightOffset.x;
                l.position.y = l.entity.pos.y - ig.game.screen.y + l.entity.size.y/2 + l.lightOffset.y;
                l.mapPosition.x = (l.entity.pos.x  + l.entity.size.x/2 + l.lightOffset.x) / ig.game.collisionMap.tilesize;
                l.mapPosition.y = (l.entity.pos.y  + l.entity.size.y/2 + l.lightOffset.y) / ig.game.collisionMap.tilesize;

            }

            // create gradients 
            if (l.useGradients) {
                /*
                l.shadowGradient = this.lightCtx.createRadialGradient(l.position.x, l.position.y, 5, l.position.x, l.position.y, l.radius);
                l.shadowGradient.addColorStop(0, l.shadowGradientStart);
                l.shadowGradient.addColorStop(1, l.shadowGradientStop);
                */
                l.lightGradient = this.lightCtx.createRadialGradient(l.position.x, l.position.y, 5, l.position.x, l.position.y, l.radius);
                l.lightGradient.addColorStop(0, l.lightGradientStart);
                l.lightGradient.addColorStop(1, l.lightGradientStop);
            }

        }


        this._drawn = false;

    },
    drawMaps: function() {
        
        // do not draw if not yet updated
        if (this._drawn) return;

        // update pulsating
        this.pulseAngle += 0.03;

        this.shadowCtx.clearRect(0,0, this.shadowLayer.width, this.shadowLayer.height);
        this.lightCtx.clearRect(0,0, this.shadowLayer.width, this.shadowLayer.height);

        this.shadowCtx.fillStyle = this.baseColor;
        this.shadowCtx.fillRect(0,0, ig.system.width, ig.system.height);

        this.shadowCtx.fillStyle = 'rgba(255,255,255,1.0)'; //this.baseColor; // configurable

        var printed = false; 
        var twoPI = Math.PI * 2;

        // bounding box for our visible area
        var baseX = Math.floor(ig.game.screen.x / ig.game.collisionMap.tilesize);
        var baseY = Math.floor(ig.game.screen.y / ig.game.collisionMap.tilesize);
        baseX = baseX < 0?0:baseX;
        baseY = baseY < 0?0:baseY;


        var endY =  Math.floor((ig.game.screen.y + ig.system.height) / ig.game.collisionMap.tilesize);
        var endX =  Math.floor((ig.game.screen.x + ig.system.width) / ig.game.collisionMap.tilesize);
        endY = endY > ig.game.collisionMap.height?ig.game.collisionMap.height:endY;
        endX = endX > ig.game.collisionMap.width?ig.game.collisionMap.width:endX;

        for (var lightIndex = this.lights.length; lightIndex--; ) {
            var light = this.lights[lightIndex];
            var localRadius = (light.radius + (Math.sin(this.pulseAngle) * light.pulseFactor)) / ig.game.collisionMap.tilesize;
            this.shadowCtx.save();
            this.lightCtx.save();

            // startangle for spread (angle is POV, spread is FOV)
            var curAngleB = light.angle - (light.angleSpread/2);
            var addTo = 3/ light.radius; 

            // tempposition is for horizontal alignment on strobelights (type 2)
            var tempPosition = new this.vector(light.mapPosition.x, light.mapPosition.y);

            if (light.type == 2 ) {
                // we start from x = light.entity.size with the rays
                tempPosition.x+=(light.entity.size.x / ig.game.collisionMap.tilesize)
            }


            this.shadowCtx.beginPath();
            this.shadowCtx.moveTo(light.position.x, light.position.y );
            if (light.useGradients) {
                this.lightCtx.fillStyle = light.lightGradient;
               // this.shadowCtx.fillStyle = light.shadowGradient;
            } else {
                this.lightCtx.fillStyle = light.color;
                //this.shadowCtx.fillStyle = light.shadowColor;
            }
            this.lightCtx.beginPath();
            this.lightCtx.moveTo(light.position.x, light.position.y);


            var lightStep = light.angleSpread / (addTo * (180/Math.PI) * 2); // type2 related
            var tempStep = (light.entity.size.x / ig.game.collisionMap.tilesize) / lightStep; // type2 related

            for(curAngleB; curAngleB < light.angle + (light.angleSpread/2); curAngleB += (addTo * (180/Math.PI))*2) {

                var curAngle = curAngleB * (Math.PI / 180)
                curAngle %= twoPI;
                if (curAngle < 0) curAngle += twoPI;

                // heading of our ray
                var right = (curAngle > twoPI * 0.75 || curAngle < twoPI * 0.25);
                var up = (curAngle < 0 || curAngle > Math.PI);

                
                var angleSin = Math.sin(curAngle);
                var angleCos = Math.cos(curAngle);

                var dist = 0, xHit = 0, yHit = 0;

                // vertical
                var slope = angleSin / angleCos;    // (sin(alpha) / sin(beta) = tan(alpha) = relation a to b = slope
                var dX = right ? 1 : -1;    
                var dY = dX * slope;        
                var steps = 0;
                var x = right? Math.ceil(tempPosition.x) : Math.floor(tempPosition.x);

                // add the little difference of slope to get the accurate position with full x-indices
                var y = tempPosition.y + (x - tempPosition.x) * slope;
                
                // bounding box is our visible area
                while (x >= baseX && x< endX && y>= baseY && y < endY) {
                    // index für die erste wall
                    var wallX = Math.floor(x + (right ? 0 : -1));
                    var wallY = Math.floor(y);
                    if (ig.game.collisionMap.data[wallY][wallX] == 1) {
                        var distX = x - tempPosition.x;
                        var distY = y - tempPosition.y;
                        dist = distX*distX + distY*distY; 
                        xHit = x;
                        yHit = y;
                        break;
                    }

                    x += dX;
                    y += dY;
                }

                // horizontal
                slope = angleCos / angleSin;
                dY = up ? -1 : 1;
                dX = dY * slope;
                y = up ? Math.floor(tempPosition.y) : Math.ceil(tempPosition.y);
                x = tempPosition.x + (y - tempPosition.y) * slope;
                steps = 0;

                while (x >= baseX && x < endX && y >= baseY && y < endY) {
                    var wallY = Math.floor(y + (up ? -1 : 0));
                    var wallX = Math.floor(x);
                    if (ig.game.collisionMap.data[wallY][wallX] == 1) {
                        var distX = x - tempPosition.x;
                        var distY = y - tempPosition.y;
                        var blockDist = distX*distX + distY*distY;
                        if (!dist || blockDist < dist) {
                            dist = blockDist;
                            xHit = x;
                            yHit = y;
                          
                        }
                        break;
                    }
                  
                    x += dX;
                    y += dY;
                }

                var  maxDistX = angleCos * localRadius;
                var maxDistY = angleSin * localRadius;
                var maxDist = maxDistX*maxDistX + maxDistY*maxDistY;

                if (!dist || dist > maxDist) {
                    xHit = tempPosition.x + maxDistX;
                    yHit = tempPosition.y + maxDistY;
                }

                this.shadowCtx.lineTo((xHit * ig.game.collisionMap.tilesize) -  ig.game.screen.x, (yHit * ig.game.collisionMap.tilesize) -  ig.game.screen.y);    

                this.lightCtx.lineTo((xHit * ig.game.collisionMap.tilesize) -  ig.game.screen.x, (yHit * ig.game.collisionMap.tilesize) -  ig.game.screen.y);    
          
                if (light.type == 2) {
                    tempPosition.x -= tempStep;
                }
            }
          //  this.shadowCtx.lineTo((tempPosition.x * 16) - ig.game.screen.x, (tempPosition.y * 16) -  ig.game.screen.y);                
            this.shadowCtx.closePath();
            this.shadowCtx.fill();
             this.lightCtx.closePath();
            this.lightCtx.fill();
            this.shadowCtx.restore();
            this.lightCtx.restore();

        } // light iteration

        this._drawn = true;

    },
    drawLightMap: function() {
        if (!this._drawn) this.drawMaps();
        ig.system.context.drawImage(this.lightLayer,0,0, ig.system.width * ig.system.scale, ig.system.height * ig.system.scale);

    },
    drawShadowMap: function() {
        if (!this._drawn) this.drawMaps();
        
        var origPixels = this.shadowCtx.getImageData(0, 0,ig.system.width, ig.system.height);

        for (var y = ig.system.height; y--; ) {
            for (var x = ig.system.width; x--; ) {
                var index = (y * ig.system.width + x) * 4;
                // transparenz: 
                origPixels.data[index + 3] = origPixels.data[index + 3]  != this.basecolorValues[3]? 0 : this.basecolorValues[3];
                origPixels.data[index] = this.basecolorValues[0];
                origPixels.data[index + 1] =  this.basecolorValues[1];
                origPixels.data[index + 2] =  this.basecolorValues[2];
            }

        }
        this.shadowCtx.putImageData(origPixels, 0,0);

        ig.system.context.drawImage(this.shadowLayer,0,0, ig.system.width * ig.system.scale, ig.system.height * ig.system.scale);
    }

});

});