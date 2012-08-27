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

        this.$().css({left:bl.left+'px',bottom:bl.bottom+'px'}).css('z-index',-bl.bottom);
    },
    templateName: "tile",
    place: function () {
        //console.log(this.get('content.player._id'));
        //SDD.Quickdraft.un_draft_player(this.get('content.player._id'));
    },

    tile_bkg_class: function () {
        return String(this.get('content.tile_type.img_class')) + '1';
    }.property('content.tile_type.img_class'),

    count_steps: function () {
        console.log(this.get('content.steps'));
        console.log(this.get('content.path'));
    },

    classNameBindings:['tile_bkg_class'],
    classNames: ['tile'],

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
    itemViewClass: GONADS.TileArt.extend()
})

GONADS.EntityArt = GONADS.View.extend({
    didInsertElement: function () {
        this.reposition();
    },
    reposition: function() {
        var coord_delta = delta_from_cardinal(this.get('content.facing'));
        //console.log(coord_delta);
        var bl = bl_from_xy(this.get('content.x'), this.get('content.y'));
        //console.log(bl);
        var bl_next = bl_from_xy(this.get('content.x')+coord_delta.x, this.get('content.y')+coord_delta.y);

        this.$().css({left:bl.left+'px',bottom:bl.bottom+'px'}).css('z-index',-bl.bottom);
        this.$().animate({left:bl_next.left+'px',bottom:bl_next.bottom+'px'}, this.get('content.speed'))
    }.observes('content.x','content.y','content.facing'),
    templateNameBinding:'template_computer',
    template_computer: function () {
        return 'robot-template';
    }.property(),
    classNames: ['tile'],
});

GONADS.EntityView = Ember.CollectionView.extend({
    tagName: 'div',
    contentBinding: "GONADS.entities",
    itemViewClass: GONADS.EntityArt.extend()
})



GONADS.MapView = GONADS.View.extend({
    templateName: 'map-view',
    didInsertElement: function() {
        GONADS.map.rect(1,1,14,4,GONADS.TILES.get('IMPASSABLE'));
        GONADS.map.rect(10,4,14,10,GONADS.TILES.get('IMPASSABLE'));
        GONADS.map.spot(11,4,GONADS.TILES.get('FLAT'));
        GONADS.map.spot(12,10,GONADS.TILES.get('NEST'));
        GONADS.map.spot(2,4,GONADS.TILES.get('FLAT'));

        GONADS.map.rect(1,7,6,11,GONADS.TILES.get('IMPASSABLE'));
        GONADS.map.spot(6,9,GONADS.TILES.get('FLAT'));
        GONADS.map.spot(2,9,GONADS.TILES.get('GOAL'));

        var stop = GONADS.map.coord(2,9);
        stop.steps = 0;
        GONADS.map.dirty = [stop];
        GONADS.map.refresh_pathing();

        //GONADS.map.spot(2,3,GONADS.TILES.get('IMPASSABLE'));
    }
})
