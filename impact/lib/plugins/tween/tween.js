ig.module(
	'plugins.tween.tween'
)
.requires(
	'impact.entity'
)
.defines(function() {

if ( !Array.prototype.indexOf ) {
	Array.prototype.indexOf = function(el, start) {
		var start = start || 0;
		for ( var i=0; i < this.length; ++i ) {
			if ( this[i] === el ) {
				return i;
			}
		}
		return -1;
	};
}

ig.Entity.prototype.tweens = []; 
ig.Entity.prototype._preTweenUpdate = ig.Entity.prototype.update;
ig.Entity.prototype.update = function() {
	this._preTweenUpdate();
	if ( this.tweens.length > 0 ) {
		var currentTweens = [];
		for ( var i = 0; i < this.tweens.length; i++ ) {
			this.tweens[i].update();
			if ( !this.tweens[i].complete ) currentTweens.push(this.tweens[i]);
		}
		this.tweens = currentTweens;
	}
};

ig.Entity.prototype.tween = function(props, duration, settings) {
	var tween = new ig.Tween(this, props, duration, settings);
	this.tweens.push(tween);
	return tween;
};

ig.Entity.prototype.pauseTweens = function() {
	for ( var i = 0; i < this.tweens.length; i++ ) {
		this.tweens[i].pause();
	}
};

ig.Entity.prototype.resumeTweens = function () {
	for ( var i = 0; i < this.tweens.length; i++ ) {
		this.tweens[i].resume();
	}
};

ig.Entity.prototype.stopTweens = function(doComplete) {
	for ( var i = 0; i < this.tweens.length; i++ ) {
		this.tweens[i].stop(doComplete);
	}
};

ig.Tween = function(obj, properties, duration, settings) {
	var _object = obj;
	var valuesStart = {};
	var valuesEnd = {};
	var valuesDelta = {};
	var _elapsed = 0;
	var timer = false;
	var started = false;
	var _props = properties;
	var _chained = false;
	this.duration = duration;
	this.complete = false;
	this.paused = false;
	this.easing = ig.Tween.Easing.Linear.EaseNone;
	this.onComplete = false;
	this.delay = 0;
	this.loop = 0;
	this.loopCount = -1;
	ig.merge(this, settings);
	this.loopNum = this.loopCount;

	this.chain = function(chainObj) {
		_chained = chainObj;
	};

	this.initEnd = function(prop, from, to) {
		if ( typeof(from[prop]) !== "object" ) {
			to[prop] = from[prop];
		} else {
			for ( subprop in from[prop] ) {
				if ( !to[prop] ) to[prop] = {};
				this.initEnd( subprop, from[prop], to[prop] );
			}
		}
	};

	this.initStart = function(prop, end, from, to) {
		if ( typeof(from[prop]) !== "object" ) {
			if ( typeof(end[prop]) !== "undefined" ) to[prop] = from[prop];
		} else {
			for ( subprop in from[prop] ) {
				if ( !to[prop] ) to[prop] = {};
				if ( typeof(end[prop]) !== "undefined" ) this.initStart( subprop, end[prop], from[prop], to[prop] );
			}
		}
	};

	this.start = function() {
		this.complete = false;
		this.paused = false;
		this.loopNum = this.loopCount;
		_elapsed = 0;
		if ( _object.tweens.indexOf(this) == -1 ) _object.tweens.push(this);
		started = true;
		timer = new ig.Timer();
		for ( var property in _props ) {
			this.initEnd(property, _props, valuesEnd);
		}
		for ( var property in valuesEnd ) {
			this.initStart(property, valuesEnd, _object, valuesStart);
			this.initDelta(property, valuesDelta, _object, valuesEnd);
		}
	};

	this.initDelta = function(prop, delta, start, end) {
		if ( typeof(end[prop]) !== "object" ) {
			delta[prop] = end[prop] - start[prop];
		} else {
			for ( subprop in end[prop] ) {
				if ( !delta[prop] ) delta[prop] = {};
				this.initDelta(subprop, delta[prop], start[prop], end[prop]);
			}
		}
	};

	this.propUpdate = function(prop, obj, start, delta, value) {
		if ( typeof(start[prop]) !== "object" ) {
			if ( typeof start[prop] != "undefined" ) {
				obj[prop] = start[prop] + delta[prop] * value;
			} else {
				obj[prop] = obj[prop];
			}
		} else {
			for ( subprop in start[prop] ) {
				this.propUpdate(subprop, obj[prop], start[prop], delta[prop], value);
			}
		}
	};

	this.propSet = function(prop, from, to) {
		if ( typeof(from[prop]) !== "object" ) {
			to[prop] = from[prop];
		} else {
			for ( subprop in from[prop] ) {
				if ( !to[prop] ) to[prop] = {};
				this.propSet( subprop, from[prop], to[prop] );
			}
		}
	};

	this.update = function() {
		if ( !started ) return false;
		if ( this.delay ) {
			if ( timer.delta() < this.delay ) return;
			this.delay = 0;
			timer.reset();
		}
		if ( this.paused || this.complete ) return false;

		var elapsed = (timer.delta() + _elapsed) / this.duration;
		elapsed = elapsed > 1 ? 1 : elapsed;
		var value = this.easing(elapsed);

		for ( property in valuesDelta ) {
			this.propUpdate(property, _object, valuesStart, valuesDelta, value);
		}

		if ( elapsed >= 1 ) {
			if ( this.loopNum == 0 || !this.loop ) {
				this.complete = true;
				if ( this.onComplete ) this.onComplete();
				if ( _chained ) _chained.start();
				return false;
			} else if ( this.loop == ig.Tween.Loop.Revert ) {
				for ( property in valuesStart ) {
					this.propSet(property, valuesStart, _object); 
				}
				_elapsed = 0;
				timer.reset();
				if ( this.loopNum != -1 ) this.loopNum--;
			} else if ( this.loop == ig.Tween.Loop.Reverse ) {
				var _start = {}, _end = {}, _delta = {};
				ig.merge(_start, valuesEnd);
				ig.merge(_end, valuesStart);
				ig.merge(valuesStart, _start);
				ig.merge(valuesEnd, _end);
				for ( property in valuesEnd ) {
					this.initDelta(property, valuesDelta, _object, valuesEnd);
				}
				_elapsed = 0;
				timer.reset();
				if ( this.loopNum != -1 ) this.loopNum--;
			}
		}
	};

	this.pause = function() {
		this.paused = true;
		_elapsed += timer.delta();
	};

	this.resume = function() {
		this.paused = false;
		timer.reset();
	};

	this.stop = function(doComplete) {
		if ( doComplete ) {
			this.paused = false;
			this.complete = false;
			this.loop = false;
			_elapsed += duration;
			this.update();
		}
		this.complete = true;
	}
};

ig.Tween.Loop = { Revert: 1, Reverse: 2 };

ig.Tween.Easing = { Linear: {}, Quadratic: {}, Cubic: {}, Quartic: {}, Quintic: {}, Sinusoidal: {}, Exponential: {}, Circular: {}, Elastic: {}, Back: {}, Bounce: {} };

ig.Tween.Easing.Linear.EaseNone = function ( k ) {
	return k;
};

ig.Tween.Easing.Quadratic.EaseIn = function ( k ) {
	return k * k;
};

ig.Tween.Easing.Quadratic.EaseOut = function ( k ) {
	return - k * ( k - 2 );
};

ig.Tween.Easing.Quadratic.EaseInOut = function ( k ) {
	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
	return - 0.5 * ( --k * ( k - 2 ) - 1 );
};

ig.Tween.Easing.Cubic.EaseIn = function ( k ) {
	return k * k * k;
};

ig.Tween.Easing.Cubic.EaseOut = function ( k ) {
	return --k * k * k + 1;
};

ig.Tween.Easing.Cubic.EaseInOut = function ( k ) {
	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
	return 0.5 * ( ( k -= 2 ) * k * k + 2 );
};

ig.Tween.Easing.Quartic.EaseIn = function ( k ) {
	return k * k * k * k;
};

ig.Tween.Easing.Quartic.EaseOut = function ( k ) {
	return - ( --k * k * k * k - 1 );
}

ig.Tween.Easing.Quartic.EaseInOut = function ( k ) {
	if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
	return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
};

ig.Tween.Easing.Quintic.EaseIn = function ( k ) {
	return k * k * k * k * k;
};

ig.Tween.Easing.Quintic.EaseOut = function ( k ) {
	return ( k = k - 1 ) * k * k * k * k + 1;
};

ig.Tween.Easing.Quintic.EaseInOut = function ( k ) {
	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
	return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
};

ig.Tween.Easing.Sinusoidal.EaseIn = function ( k ) {
	return - Math.cos( k * Math.PI / 2 ) + 1;
};

ig.Tween.Easing.Sinusoidal.EaseOut = function ( k ) {
	return Math.sin( k * Math.PI / 2 );
};

ig.Tween.Easing.Sinusoidal.EaseInOut = function ( k ) {
	return - 0.5 * ( Math.cos( Math.PI * k ) - 1 );
};

ig.Tween.Easing.Exponential.EaseIn = function ( k ) {
	return k == 0 ? 0 : Math.pow( 2, 10 * ( k - 1 ) );
};

ig.Tween.Easing.Exponential.EaseOut = function ( k ) {
	return k == 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1;
};

ig.Tween.Easing.Exponential.EaseInOut = function ( k ) {
	if ( k == 0 ) return 0;
	if ( k == 1 ) return 1;
	if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 2, 10 * ( k - 1 ) );
	return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
};

ig.Tween.Easing.Circular.EaseIn = function ( k ) {
	return - ( Math.sqrt( 1 - k * k ) - 1);
};

ig.Tween.Easing.Circular.EaseOut = function ( k ) {
	return Math.sqrt( 1 - --k * k );
};

ig.Tween.Easing.Circular.EaseInOut = function ( k ) {
	if ( ( k /= 0.5 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
	return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
};

ig.Tween.Easing.Elastic.EaseIn = function( k ) {
	var s, a = 0.1, p = 0.4;
	if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
};

ig.Tween.Easing.Elastic.EaseOut = function( k ) {
	var s, a = 0.1, p = 0.4;
	if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
};

ig.Tween.Easing.Elastic.EaseInOut = function( k ) {
	var s, a = 0.1, p = 0.4;
	if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
	return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
};

ig.Tween.Easing.Back.EaseIn = function( k ) {
	var s = 1.70158;
	return k * k * ( ( s + 1 ) * k - s );
};

ig.Tween.Easing.Back.EaseOut = function( k ) {
	var s = 1.70158;
	return ( k = k - 1 ) * k * ( ( s + 1 ) * k + s ) + 1;
};

ig.Tween.Easing.Back.EaseInOut = function( k ) {
	var s = 1.70158 * 1.525;
	if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
	return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
};

ig.Tween.Easing.Bounce.EaseIn = function( k ) {
	return 1 - ig.Tween.Easing.Bounce.EaseOut( 1 - k );
};

ig.Tween.Easing.Bounce.EaseOut = function( k ) {
	if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
		return 7.5625 * k * k;
	} else if ( k < ( 2 / 2.75 ) ) {
		return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
	} else if ( k < ( 2.5 / 2.75 ) ) {
		return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
	} else {
		return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
	}
};

ig.Tween.Easing.Bounce.EaseInOut = function( k ) {
	if ( k < 0.5 ) return ig.Tween.Easing.Bounce.EaseIn( k * 2 ) * 0.5;
	return ig.Tween.Easing.Bounce.EaseOut( k * 2 - 1 ) * 0.5 + 0.5;
};

});
