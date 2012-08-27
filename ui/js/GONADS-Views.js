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
        var bottom = (this.get('content.y') - this.get('content.x')) * GONADS.Core.get('tile_y_delta');
        var left = (this.get('content.x') + this.get('content.y')) * GONADS.Core.get('tile_x_delta');
        this.$().css({left:left+'px',bottom:bottom+'px'}).css('z-index',-bottom);
    },
    templateName: "tile",
    place: function () {
        //console.log(this.get('content.player._id'));
        //SDD.Quickdraft.un_draft_player(this.get('content.player._id'));
    },
    tile_bkg_class: function () {
        return String(this.get('content.tile_type.img_class')) + '1';
    }.property('content.tile_type.img_class'),

    flat1: function () {
        return String(this.get('content.tile_type.img_class')) =='flat';
        //return false;
    }.property('content.tile_type.img_class'),

    impassable1: function () {
        return String(this.get('content.tile_type.img_class')) =='impassable';
    }.property('content.tile_type.img_class'),

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




GONADS.MapView = GONADS.View.extend({
    templateName: 'map-view',
    didInsertElement: function() {
        GONADS.map.rect(1,1,3,3,GONADS.TILES.get('IMPASSABLE'));
        GONADS.map.spot(2,3,GONADS.TILES.get('FLAT'));
        GONADS.map.rect(1,5,3,8,GONADS.TILES.get('IMPASSABLE'));
        GONADS.map.spot(3,7,GONADS.TILES.get('FLAT'));

        //GONADS.map.spot(2,3,GONADS.TILES.get('IMPASSABLE'));
    }
})
