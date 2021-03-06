/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA


_bullets : [],
_ships   : [],
_clouds : [],
_explosions : [],
_terrain : [],

// "PRIVATE" METHODS

_generateClouds : function() {
    var i,
    NUM_CLOUDS = 4;

    for (i = 0; i < NUM_CLOUDS; ++i) {

      this.generateClouds();
    }
},

_findNearestShip : function(posX, posY) {
    var closestShip = null,
        closestIndex = -1,
        closestSq = 1000 * 1000;

    for (var i = 0; i < this._ships.length; ++i) {

        var thisShip = this._ships[i];
        var shipPos = thisShip.getPos();
        var distSq = util.wrappedDistSq(
            shipPos.posX, shipPos.posY,
            posX, posY,
            g_canvas.width, g_canvas.height);

        if (distSq < closestSq) {
            closestShip = thisShip;
            closestIndex = i;
            closestSq = distSq;
        }
    }
    return {
        theShip : closestShip,
        theIndex: closestIndex
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._clouds,this._terrain, this._ships, this._explosions,  this._bullets  ];
},

init: function() {
    this._generateClouds();
    this.generateTerrain();
},
reset : function() {
  //splice from this._categories
  this._bullets = [];
  this._ships   = [];
  this._clouds = [];
  this._explosions = [];
  this._clouds = [],
  this._terrain = [],
  this.init();
  entityManager.deferredSetup();

},

fireBullet: function(cx, cy, velX, velY, rotation,partOfShower, i,volcanoMaster, weapon, sprite) {
    this._bullets.push(new Bullet({
        cx   : cx,
        cy   : cy,
        velX : velX,
        velY : velY,

        rotation : rotation,
        partOfShower: partOfShower,
        showerIndex : i,
        volcanoMaster : volcanoMaster,
        weapon : weapon,
    }));
},

generateClouds : function () {
    this._clouds.push(new Cloud());
},

_generateArrow : function () {
    this._clouds.push(new Arrow());
},

generateShip : function(descr) {

    this._ships.push(new Ship(descr));
},
generateTerrain : function () {
    this._terrain.push(new Terrain());
},

killNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.kill();
    }
},

yoinkNearestShip : function(xPos, yPos) {
    var theShip = this._findNearestShip(xPos, yPos).theShip;
    if (theShip) {
        theShip.setPos(xPos, yPos);
    }
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},

update: function(du) {
    if(!g_countdown.stop){
      g_countdown.timeLeft -= du;
    }
    if(g_countdown.timeLeft < 0) {
      gameplayManager.nextTurn();
    }
    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {
          if(aCategory === this._ships && aCategory[i]._isDeadNow){
            //dont update dead tanks
          }
          else {
            var status = aCategory[i].update(du);

          }


            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                if(aCategory !== this._ships){
                  //we need the tank in the entitymanager despite death
                  aCategory.splice(i,1);
                  if((this._bullets.length < 1 && this._explosions.length <  1)){
                     gameplayManager.nextTurn();
                   }

                }else {
                  ++i;
                }
            }
            else {
                ++i;
            }
        }
    }

},

render: function(ctx) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {
            if(aCategory === this._ships && aCategory[i]._isDeadNow){
              //dont render dead tanks
            }
            else{
              aCategory[i].render(ctx, g_canvas)
            }

        }
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
