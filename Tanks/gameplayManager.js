"use strict";

var gameplayManager = {

    inputLock : false,

    doorTranslate : 0,
    isDoorLocked : true,
    discardDoor : false,

    setupReady : false,
    setupIndex : 0,

    players : [],

    keyLock : function() {
        return this.lock;
    },

    init : function() {
        this.loadPlayers();
        this.setupReady = true;
    },

    setup : function() {

    },

    render : function(ctx) {
        if (!this.discardDoor) {
            this.gameDoor(ctx);
        }
    },

    addPlayer : function(descr) {
        this.players.push(new Player(descr));
    },

    gameDoor : function(ctx) {

        if (!this.isDoorLocked) { this.doorTranslate += 5; }

        ctx.save();
        ctx.translate(this.doorTranslate, 0);

        ctx.drawImage(g_images.rightDoor, g_canvas.width/2, 0,
                      g_canvas.width/2, g_canvas.height);

        ctx.restore();
        ctx.save();
        ctx.translate(-this.doorTranslate, 0);

        ctx.drawImage(g_images.leftDoor, 0, 0,
                      g_canvas.width/2, g_canvas.height);

        ctx.restore();

        if (this.doorTranslate > g_canvas.width/2) {
            this.discardDoor = true;
        }
    },

    loadPlayers : function() {
        for (var i in this.players) {
             entityManager.generateShip({
                 cx : util.randRange(0, g_canvas.width),
                 cy: 200,
                 playerNr : this.players[i].nr,
                 playerId : this.players[i].id
             });
        }


    }
}