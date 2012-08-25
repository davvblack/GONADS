GONADS.Lobby = Em.Object.create({
        init: function(){

        }

    })

GONADS.Game = Em.Object.extend({
    init: function() {
        GONADS.map = GONADS.Map.create();
        GONADS.map.fill(0,0,100,100,tile.FLAT);
        GONADS.map.rect(2,2,4,4,tile.IMPASSABLE);
    },


    destroy: function() {
        delete GONADS.map;
        delete GONADS.game;
    }
});

GONADS.Tile = Em.Object.extend({
    init: function(){

    },
    set_tile: function(tile_type){
        this.tile_type = tile_type;
    },
    get_tile: function(){
        return this.tile_type;
    }
})

GONADS.Map = Em.Object.extend({
    init: function() {
        this.content={}
    },
    coord: function(x,y) {
        var to_return;
        if(isset(this.content[coord_name(x,y)]))
        {
            to_return = this.content[coord_name(x,y)];
        }
        else
        {
            to_return = this.content[coord_name(x,y)] = GONADS.Tile.create({})
        }
        return to_return;
    },
    fill: function(x1, y1, x2, y2, tile) {
        for( var i = x1; i <= x2; i++)
        {
            for( var j = y1; j < y2; j++)
            {
                this.coord(i,j).set_tile(tile)
            }
        }
    },
    rect: function(x1, y1, x2, y2, tile) {
        for( var i = x1; i < x2; i++)
        {
            this.coord(i,y1).set_tile(tile);
            this.coord(i,y2).set_tile(tile);
        };
        for( var j = y1; j < y2; j++)
        {
            this.coord(x1,j).set_tile(tile);
            this.coord(x2,j).set_tile(tile);
        }
    }
});

GONADS.Status = Em.StateManager.extend({
    at: function () {
        return this.get('currentState.name');
    }.property('currentState.name'),

    is: function (compare) {
        return this.get('currentState.name') == compare;
    },

    has_ancestor: function (compare) {
        return this.get('currentState.path').split('.').indexOf(compare)!=-1;
    }
});

GONADS.GameState = GONADS.Status.create({
    initialState: 'in_lobby',
    states: {

        in_lobby: Em.State.create({
            enter: function () {
                GONADS.lobby_menu = GONADS.LobbyMenu.create();
                GONADS.lobby_menu.appendTo("#main");
            },
            exit: function () {
                GONADS.lobby_menu.tear_down(function () {
                    GONADS.lobby_menu.remove();
                });
            }
        }),

        in_game: Em.State.create({
            enter: function () {
                GONADS.game = GONADS.Game.create();
            },
            exit: function () {
                GONADS.game.destroy();
            }
        }),

        in_limbo: Em.State.create({

        }),
    }
})
