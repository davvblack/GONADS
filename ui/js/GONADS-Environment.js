INFINITY = 2E+10308;

EOC = function(a){return Em.Object.create(a)};

GONADS.TILES = EOC({
    FLAT:       EOC({img_class:"flat",      variants:8, id:0, pathing:1}),
    IMPASSABLE: EOC({img_class:"impassable",variants:1, id:1, pathing:INFINITY}),
    WOOD:       EOC({img_class:"wood",      variants:1, id:2, pathing:6}),
    STONE:      EOC({img_class:"stone",     variants:1, id:3, pathing:8}),
    METAL:      EOC({img_class:"metal",     variants:1, id:4, pathing:10}),
    NEST:       EOC({img_class:"nest",      variants:1, id:5, pathing:INFINITY}),
    GOAL:       EOC({img_class:"goal",      variants:1, id:6, pathing:0, goal:true}),
});

/*
GONADS.TILES = EOC({
    FLAT:       'flat',
    IMPASSABLE: 'impassable',
});*/

GONADS.Core = Em.Object.create({
    footprint_width: 140,
    footprint_height: 80,
    tile_x_delta: 70,
    tile_y_delta: 40,
    x_origin: 400,
    y_origin: 400,
});
