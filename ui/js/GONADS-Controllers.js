GONADS.Lobby = Em.Object.create({
        init: function(){

        }

    })

GONADS.Robot = Em.Object.extend({
    init: function () {
        this.set('facing',GONADS.map.coord(this.get('x'),this.get('y')).get('path'));
        this.set('speed',1000);
        this.set('action','moving');
        this.set('action_timing',1000);
    }
})

GONADS.Game = Em.Object.extend({
    init: function() {
        GONADS.tile_view = GONADS.TilesView.create();
        GONADS.tile_view.appendTo('#main');
        GONADS.tools_view = GONADS.ButtonsPanel.create();
        GONADS.tools_view.appendTo('#main');
        GONADS.map = GONADS.Map.create();
        GONADS.map.fill_clean(0,0,15,15,GONADS.TILES.get('FLAT'), true);
        GONADS.updater = setInterval(function(){GONADS.game.update_state()},100);
        //GONADS.updater.start();
        GONADS.nests = [GONADS.Nest.create({x:12,y:9})];
        GONADS.entities = Ember.ArrayController.create({content:[]});
        this.set('brush',GONADS.TILES.get('WOOD'));
    },

    set_brush: function(brush) {
        this.set('brush', GONADS.TILES.get(brush));
    },

    place_tile: function(x,y) {
        GONADS.map.spot(x,y,GONADS.game.get('brush'));
        GONADS.map.clear_pathing();
        GONADS.map.refresh_pathing();
    },

    update_state: function() {
        if(this.tock)
        {
            this.tock = false;
            $('body').removeClass('tock');
        }
        else
        {
            $('body').addClass('tock');
        }
        //console.log('updating state');
        for(var i=0; i<GONADS.nests.length;i++)
        {
            GONADS.nests[i].time_left = GONADS.nests[i].get('time_left') - 10;
            if(GONADS.nests[i].time_left < 0)
            {
                //console.log('creating robot');
                GONADS.nests[i].time_left = 1000;
                GONADS.entities.pushObject(GONADS.Robot.create({
                    x:GONADS.nests[i].x,
                    y:GONADS.nests[i].y,
                }));
            }
        }
        var e_arr  = GONADS.entities.toArray();
        for(var i=0; i<e_arr.length; i++)
        {
            e_arr[i].action_timing = e_arr[i].get('action_timing') - 100;
            if(e_arr[i].action_timing<0)
            {
                e_arr[i].action_timing =  e_arr[i].get('speed');
                switch(e_arr[i].get('action'))
                {
                    case "moving":
                        //console.log('moving');
                        var facing = GONADS.map.coord(e_arr[i].get('x'), e_arr[i].get('y')).get('path');
                        //console.log(new_facing);
                        if(facing)
                        {
                            delta = delta_from_cardinal(facing);
                            var new_facing = GONADS.map.coord(e_arr[i].get('x')+delta.x, e_arr[i].get('y')+delta.y).get('path');
                            GONADS.entities.objectAt(i).setProperties({'x': e_arr[i].get('x')+delta.x,
                                                                       'y': e_arr[i].get('y')+delta.y,
                                                                       'facing': new_facing});
                        }
                        break;

                }

            }
        }
    },

    destroy: function() {
        delete GONADS.map;
        delete GONADS.game;
    }
});

GONADS.Nest = Em.Object.extend({
    time_left: 10
})

GONADS.Tile = Em.Object.extend({
    init: function(){
        //GONADS.map.viewer.content.pushObject(this)
        GONADS.tile_view.content.pushObject(this);
        this.set('view_index', GONADS.tile_view.content.length-1);
        ////console.log(this);
    },
    set_tile: function(tile_type){
        //this.steps -=
        GONADS.map.dirty_tile(this);
        GONADS.map.dirty_pointing_at(this);
        this.steps = INFINITY;
        this.set_tile_clean(tile_type);


    },
    set_tile_clean: function(tile_type){
        this.set('tile_type', tile_type);
        ////console.log(this.get('view_index'));
        ////console.log(tile_type);
        GONADS.tile_view.content.objectAt(this.get('view_index')).set('tile_type',tile_type);
    },
    get_tile: function(){
        return this.get('tile_type');
    }
})

GONADS.Map = Em.Object.extend({
    init: function() {
        this.content = {};
        //this.viewer = GONADS.TilesViewer.create();
        this.dirty = [];
    },
    coord: function(x,y,create) {
        var to_return;
        if(create)
        {
            to_return = this.content[coord_name(x,y)] = GONADS.Tile.create({x:x,y:y})

        }
        else
        {
            to_return = this.content[coord_name(x,y)];
        }
        return to_return;
    },
    fill: function(x1, y1, x2, y2, tile) {
        for( var i = x1; i <= x2; i++)
        {
            for( var j = y1; j <= y2; j++)
            {
                this.coord(i,j).set_tile(tile)
            }
        }
    },
    fill_clean: function(x1, y1, x2, y2, tile) {
        for( var i = x1; i <= x2; i++)
        {
            for( var j = y1; j <= y2; j++)
            {
                this.coord(i,j, true).set_tile_clean(tile)
            }
        }
    },
    rect: function(x1, y1, x2, y2, tile) {
        for( var i = x1; i < x2; i++)
        {
            this.coord(i,y1).set_tile(tile);
            this.coord(i,y2).set_tile(tile);
        };
        for( var j = y1; j <= y2; j++)
        {
            this.coord(x1,j).set_tile(tile);
            this.coord(x2,j).set_tile(tile);
        }
    },
    spot: function(x,y,tile)
    {
        this.coord(x,y).set_tile(tile);
    },
    refresh_pathing: function()
    {
        var working_tile;
        var t=0;
        while((working_tile = GONADS.map.dirty.shift()) && t++ < 50000)
        {
            var neighbor_steps, min_neighbor;
            neighbor_steps = this.get_neighbors(working_tile.x,working_tile.y) ;
            //console.log(neighbor_steps);
            //console.log(working_tile);
            min_neighbor = min_object(neighbor_steps,'steps');
            //console.log(min_neighbor);
            directions = "NSEW";
            if(min_neighbor.val != INFINITY)
            {
                //console.log('whoa');
            }
            if(!working_tile.tile_type.goal && ((min_neighbor.val + working_tile.tile_type.pathing != working_tile.steps) || !isset(working_tile.steps)))
            {
                old_steps = working_tile.steps;
                working_tile.steps = min_neighbor.val + working_tile.tile_type.pathing;
                if(old_steps < working_tile.steps)
                {
                    console.log('would dirty pointing at');
                    console.log(working_tile);
                    //GONADS.map.
                    GONADS.map.dirty_pointing_at(working_tile);
                }
                //console.log(working_tile.steps);
                for(i in min_neighbor.key)
                {
                    directions = directions.replace(min_neighbor.key[i],'');
                }
                if(working_tile.steps != INFINITY)
                {
                    //console.log('wants to dirty neighbors');
                    //console.log(directions);
                    this.dirty_directions(working_tile,directions);
                }
                //console.log(directions);
                var new_direction = min_neighbor.key[Math.floor(Math.random() * min_neighbor.key.length)];
                //console.log(new_direction);
                working_tile.path = new_direction;
            }
            //console.log(neighbor_steps);
            for(i in neighbor_steps)
            {
                if(neighbor_steps[i] && !isset(neighbor_steps[i]['steps']))
                {
                    //console.log('would dirty');
                    //console.log(neighbor_steps[i]);
                    neighbor_steps[i]['steps'] = INFINITY;
                    GONADS.map.dirty_tile(neighbor_steps[i]);
                }
            }
        }
    },
    get_neighbors: function (x,y) {
        return {
            N: this.coord(x,y+1),
            S: this.coord(x,y-1),
            E: this.coord(x+1,y),
            W: this.coord(x-1,y),
        }
    },
    dirty_directions: function(from_tile, directions) {
        var x = from_tile.x;
        var y = from_tile.y;
        if(directions.indexOf('N') != -1 && this.coord(x,y+1)) this.dirty_tile(this.coord(x,y+1));
        if(directions.indexOf('S') != -1 && this.coord(x,y-1)) this.dirty_tile(this.coord(x,y-1));
        if(directions.indexOf('E') != -1 && this.coord(x+1,y)) this.dirty_tile(this.coord(x+1,y));
        if(directions.indexOf('W') != -1 && this.coord(x-1,y)) this.dirty_tile(this.coord(x-1,y));
    },
    dirty_tile: function(tile){
        if(!containsObject(GONADS.map.dirty, tile))
        {
            GONADS.map.dirty.push(tile);
        }
    },
    get_neighbors: function (x,y) {
        return {
            N: this.coord(x,y+1),
            S: this.coord(x,y-1),
            E: this.coord(x+1,y),
            W: this.coord(x-1,y),
        }
    },
    dirty_pointing_at: function (tile) {
        //console.log('dirtying point');
        //console.log(tile);
        var neighbors = this.get_neighbors(tile.x, tile.y);
        var opposites = {N:'S',S:'N',E:'W',W:'E'};

        for(i in neighbors)
        {
            //console.log(neighbors[i]);
            //console.log(opposites[i]);
            if(neighbors[i] && neighbors[i].path == opposites[i])
            {
                //console.log('dirtying '+i);
                this.dirty_tile(neighbors[i]);
                neighbors[i].steps = INFINITY;
            }
        }
    },
    clear_pathing: function () {
        for(var i in GONADS.map.content)
        {
            if (GONADS.map.content.hasOwnProperty(i));
            {
                delete GONADS.map.content[i].steps;
                delete GONADS.map.content[i].path;
                if(GONADS.map.content[i].tile_type.goal)
                {
                    GONADS.map.content[i].steps = 0;
                    GONADS.map.dirty_tile(GONADS.map.content[i]);
                }
            }
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
                GONADS.map_view = GONADS.MapView.create();
                GONADS.map_view.appendTo("#main");
                GONADS.entity_view = GONADS.EntityView.create();
                GONADS.entity_view.appendTo("#main");

            },
            exit: function () {
                GONADS.game.destroy();
            }
        }),

        in_limbo: Em.State.create({

        }),
    }
})
