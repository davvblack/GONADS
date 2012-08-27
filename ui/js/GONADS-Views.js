GONADS.View = Em.View.extend();

GONADS.AView = Em.View.extend({
    didInsertElement: function () {
        this.$().slideDown(1000);
    },
    tear_down: function (callback) {
        //to_remove=this;
        //
        this.$().slideUp(1000, function () {
            callback();
        });
    }

});

GONADS.LobbyMenu = GONADS.AView.extend({
    enter_game: function(){
        GONADS.GameState.goToState('in_game');
    },
    templateName: 'lobby-menus',

})

GONADS.TileArt = GONADS.View.extend({
    init: function () {

    },
    didInsertElement: function () {
        var bl = bl_from_xy(this.get('content.x'), this.get('content.y'));

        this.$().css({left:bl.left+'px',bottom:bl.bottom+'px'}).css('z-index',-bl.bottom+1000);
    },
    templateName: "tile",
    /*place: function () {
        //console.log(this.get('content.player._id'));
        //SDD.Quickdraft.un_draft_player(this.get('content.player._id'));
    },*/

    tile_bkg_class: function () {
        return String(this.get('content.tile_type.img_class')) + '1';
    }.property('content.tile_type.img_class'),

    count_steps: function () {
        console.log(this.get('content.steps'));
        console.log(this.get('content.path'));
        console.log(this.get('content.x'));
    },

    classNameBindings:['tile_bkg_class'],
    classNames: ['tile'],

    place: function () {
        GONADS.game.place_tile(this.get('content.x'),this.get('content.y'));

    }

})

/*
GONADS.TilesList = Ember.ArrayController.extend({
    init: function(){
        this.set('content',[]);
    }

})
*/

GONADS.TilesView = Ember.CollectionView.extend({
    tagName: 'div',
    content: [],
    itemViewClass: GONADS.TileArt.extend(),
    classNames: ['map']
})

GONADS.EntityArt = GONADS.View.extend({
    didInsertElement: function () {
        var bl = bl_from_xy(this.get('content.x'), this.get('content.y'));
        this.$().css({left:bl.left+30+'px',bottom:bl.bottom+30+'px'})
        this.reposition();
        //console.log(this.get('content'));
    },
    cardinality: 'south',
    reposition: function() {
        if(this.get('content.facing'))
        {
            //console.log(this.get('content'));
            var coord_delta = delta_from_cardinal(this.get('content.facing'));
            //console.log(coord_delta);
            var bl = bl_from_xy(this.get('content.x'), this.get('content.y'));
            //console.log(bl);
            var bl_next = bl_from_xy(this.get('content.x')+coord_delta.x, this.get('content.y')+coord_delta.y);
            //css({left:bl.left+30+'px',bottom:bl.bottom+30+'px'})
            //-Math.min(bl.bottom,bl_next.bottom)
            this.$().css('z-index',-Math.min(bl.bottom,bl_next.bottom)+60 + 1000);
            //console.log(bl.left, bl_next.left);
            this.$().animate({left:bl_next.left+30+'px',bottom:bl_next.bottom+50+'px'}, this.get('content.speed')-300);
            var direction_names = {N:'north',S:'south',E:'east',W:'west'};
            this.set('cardinality', direction_names[this.get('content.facing')]);

            //this.$().html(this.get('content.x') + this.get('content.y') + this.get('content.facing'));
        }
    }.observes('content.x','content.y','content.facing'),
    templateName:'robot-template',
    /*
     template_computer: function () {
        return 'robot-template';
    }.property(),
    */
    classNames: ['tile','robot'],
    classNameBindings: ['cardinality']
});

GONADS.EntityView = Ember.CollectionView.extend({
    tagName: 'div',
    contentBinding: "GONADS.entities",
    itemViewClass: GONADS.EntityArt.extend(),
    classNames: ['map']
})



GONADS.MapView = GONADS.View.extend({
    templateName: 'map-view',
    didInsertElement: function() {
        /*
        GONADS.map.rect(1,1,14,4,GONADS.TILES.get('IMPASSABLE'));
        GONADS.map.rect(10,4,14,10,GONADS.TILES.get('IMPASSABLE'));
        GONADS.map.spot(11,4,GONADS.TILES.get('FLAT'));
        //GONADS.map.spot(12,4,GONADS.TILES.get('FLAT'));
        GONADS.map.spot(12,10,GONADS.TILES.get('NEST'));
        GONADS.map.spot(2,4,GONADS.TILES.get('FLAT'));

        GONADS.map.rect(1,7,6,11,GONADS.TILES.get('IMPASSABLE'));
        GONADS.map.spot(6,9,GONADS.TILES.get('FLAT'));
        GONADS.map.spot(2,9,GONADS.TILES.get('GOAL'));
        */

        var wall = GONADS.TILES.get('IMPASSABLE');
        var floor = GONADS.TILES.get('FLAT');

        GONADS.map.rect(5,2,10,2,wall);
        GONADS.map.rect(6,6,9,9,wall);
        GONADS.map.spot(9,5,wall);
        GONADS.map.rect(6,9,12,13,wall);
        GONADS.map.rect(9,13,12,16,wall);
        GONADS.map.rect(7,18,11,18,wall);
        GONADS.map.rect(9,20,12,20,wall);
        GONADS.map.spot(12,21,wall);
        GONADS.map.rect(2,7,2,9,wall);
        GONADS.map.rect(3,9,3,13,wall);
        GONADS.map.rect(2,13,2,15,wall);
        GONADS.map.rect(5,16,5,20,wall);
        GONADS.map.spot(6,16,wall);
        GONADS.map.rect(14,5,14,8,wall);
        GONADS.map.rect(15,8,15,14,wall);

        GONADS.map.spot(9,7,floor);
        GONADS.map.spot(9,8,floor);
        GONADS.map.spot(6,11,floor);
        GONADS.map.spot(12,11,floor);
        GONADS.map.spot(10,16,floor);
        GONADS.map.spot(11,16,floor);

        var goals = [[7,7],[9,11],[10,14]];
        for (var i =0; i<3; i++)
        {
            GONADS.map.spot(goals[i][0],goals[i][1],GONADS.TILES.get('GOAL'));
            var goal = GONADS.map.coord(goals[i][0],goals[i][1]);
            goal.steps = 0;
            GONADS.map.dirty = [goal];
            console.log(GONADS.map.dirty);
        }

        var nests = [[6,1],[1,11],[10,22],[15,7]];
        GONADS.nests = []
        for (var i =0; i<4; i++)
        {
            GONADS.nests.push(GONADS.Nest.create({x:nests[i][0],y:nests[i][1]-1,time_left:1000*i}));
            GONADS.map.spot(nests[i][0],nests[i][1],GONADS.TILES.get('NEST'));
        }
        GONADS.map.refresh_pathing();

        //GONADS.map.spot(2,3,GONADS.TILES.get('IMPASSABLE'));
    },
    //classNames: ['map']
})

GONADS.ButtonsPanel = GONADS.View.extend({
    templateName: 'buttons-panel',
    pickWood: function(){
        this.set('wood', true);
        this.set('stone', false);
        this.set('metal',false);
        GONADS.game.set_brush('WOOD');
    },
    pickStone: function(){
        this.set('wood', false);
        this.set('stone', true);
        this.set('metal',false);
        GONADS.game.set_brush('STONE');
    },
    pickMetal: function(){
        this.set('wood', false);
        this.set('stone', false);
        this.set('metal',true);
        GONADS.game.set_brush('METAL');
    },
    classNames: ['tools'],
    classNamesBindings: ['wood','metal','stone']
})
