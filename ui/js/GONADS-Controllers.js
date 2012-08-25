GONADS.Lobby = Em.Object.create({
        init: function(){

        }

    })

GONADS.Game = Em.Object.extend({
    init: function() {
        GONADS.map = GONADS.Map.create();
    },


    destroy: function() {
        delete GONADS.map;
    }
});

GONADS.Map = Em.Object.extend({
    init: function() {
        
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
