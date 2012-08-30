GONADS.Lobby = Em.Object.create({
        init: function(){

        }

    })

GONADS.Robot = Em.Object.extend({
    init: function () {
        this.set('facing',GONADS.map.coord(this.get('x'),this.get('y')).get('path'));

        this.set('action','moving');


        var tools = [false,false,false,'axe','axe','hammer','hammer',
                     'spike','spike','saw','jackhammer','welder'];
        var bases = ['leg','tread','wheel','hover'];
        var chassis = ['sweeper', 'wedge', 'tall', 'long'];
        var speeds = {wheel:700,tread:1000,leg:1300,hover:2000};
        var base = pick(bases);
        this.set('action_timing',speeds[base]);
        this.set('speed',speeds[base]);
        this.set('configuration',{
            base: base,
            chassis: pick(chassis),
            tools: [pick(tools), pick(tools), pick(tools)],
        })
    }
    ,
    facing:'N',
})

GONADS.Game = Em.Object.extend({
    init: function() {
        GONADS.tile_view = GONADS.TilesView.create();
        GONADS.tile_view.appendTo('#main');
        GONADS.tools_view = GONADS.ButtonsPanel.create();
        GONADS.tools_view.appendTo('#main');
        GONADS.map = GONADS.Map.create();
        GONADS.map.fill_clean(0,0,16,23,GONADS.TILES.get('FLAT'), true);
        GONADS.updater = setInterval(function(){GONADS.game.update_state()},100);
        GONADS.animator = setInterval(function(){GONADS.game.animate()},300);
        //GONADS.updater.start();
        GONADS.nests = [];//GONADS.Nest.create({x:12,y:9})];
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

    animate: function () {
        if(this.tock)
        {
            this.tock = false;
            $('body').removeClass('tock');
        }
        else
        {
            this.tock = true;
            $('body').addClass('tock');
        }
    },

    update_state: function() {
        //console.log('updating state');
        for(var i=0; i<GONADS.nests.length;i++)
        {
            GONADS.nests[i].time_left = GONADS.nests[i].get('time_left') - 10;
            if(GONADS.nests[i].time_left < 0)
            {
                //console.log('creating robot');
                GONADS.nests[i].time_left = 4000;
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
        console.log(x);
        console.log(y);
        this.coord(x,y).set_tile(tile);
    },
    refresh_pathing: function()
    {
        var working_tile;
        var t=0;

        //loop through the list of tiles you know need to be updated.  This list can be added
        // to by this function, making it soft-recursive.
        //Limit recursion depth, but it should never hit it.
        while((working_tile = GONADS.map.dirty.shift()) && t++ < 50000)
        {
            var neighbor_steps, min_neighbor;
            //Returns pointers to cardinal neighbors
            neighbor_steps = this.get_neighbors(working_tile.x,working_tile.y);
            min_neighbor = min_object(neighbor_steps,'steps');
            directions = "NSEW";
            if(min_neighbor.val != INFINITY)
            {
                //console.log('whoa');
            }
            //Do not re-path from goal, to leave those tiles at zero.  If there is no existing known
            //number of steps to get from a neighbor to working tile, or if the 'pathing' difficulty of the current tile
            //plus the easiest-to-get-to known-neigbor is quicker than the other way, then ...
            if(!working_tile.tile_type.goal && ((min_neighbor.val + working_tile.tile_type.pathing != working_tile.steps) || !isset(working_tile.steps)))
            {
                old_steps = working_tile.steps;
                working_tile.steps = min_neighbor.val + working_tile.tile_type.pathing;

                //This part doesn't work.  If the updated path is worse than the old one, something needs to happen upstream
                //to tiles that try to walk through this path, since they will obviously all get worse.
                if(old_steps < working_tile.steps)
                {
                    GONADS.map.dirty_pointing_at(working_tile);
                }
                //The tile you leave this one to go home doesn't need to be checked again, there's no way it got shorter.
                for(i in min_neighbor.key)
                {
                    directions = directions.replace(min_neighbor.key[i],'');
                }
                //Infinity means completely unpathable.  Hitting a wall means you never need to dirty any other tiles.
                //Otherwise, by dirtying the other directions, you make the function check them next.
                if(working_tile.steps != INFINITY)
                {
                    this.dirty_directions(working_tile,directions);
                }
                //randomly chose from the list of shortest neighbors.
                var new_direction = min_neighbor.key[Math.floor(Math.random() * min_neighbor.key.length)];
                //and set one to the direction robots will leave the working square from.
                working_tile.path = new_direction;
            }
            for(i in neighbor_steps)
            {
                //Make sure all un-dirty, uncalculated (but extant) adjacent tiles are dirtied.  By doing it this way
                //instead of just having them all start dirty, you start with better data and recalculate less initially.
                if(neighbor_steps[i] && !isset(neighbor_steps[i]['steps']))
                {
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
        //If the string of directions contains the given direction, and that direction is on the map, dirty it.
        if(directions.indexOf('N') != -1 && this.coord(x,y+1)) this.dirty_tile(this.coord(x,y+1));
        if(directions.indexOf('S') != -1 && this.coord(x,y-1)) this.dirty_tile(this.coord(x,y-1));
        if(directions.indexOf('E') != -1 && this.coord(x+1,y)) this.dirty_tile(this.coord(x+1,y));
        if(directions.indexOf('W') != -1 && this.coord(x-1,y)) this.dirty_tile(this.coord(x-1,y));
    },
    dirty_tile: function(tile){
        //Prevents the same tile from entering the recalculation queue multiple times.  Note the moment it is recalculated,
        //it is eligable to be calculated again.
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
    //Dirtys any adjacent tile that points towards the given tile.  Good for voiding upstream paths.
    dirty_pointing_at: function (tile) {
        var neighbors = this.get_neighbors(tile.x, tile.y);
        var opposites = {N:'S',S:'N',E:'W',W:'E'};

        for(i in neighbors)
        {
            if(neighbors[i] && neighbors[i].path == opposites[i])
            {
                this.dirty_tile(neighbors[i]);
                neighbors[i].steps = INFINITY;
            }
        }
    },
    //My cop-out pathing solution for paths that get worse.  This is a massive performance hit and wouldn't be good
    //to do on larger maps.
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
    initialState: 'in_limbo',
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
