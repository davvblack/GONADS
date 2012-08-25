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

GONADS.TilesViewer = Em.ArrayProxy.extend({
    content: function(){

    }
})

GONADS.TileArt = GONADS.View.extend({
        init: function(){

        }
    })

GONADS.Map = GONADS.View.extend({
    
})
