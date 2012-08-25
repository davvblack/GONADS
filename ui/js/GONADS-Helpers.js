function coord_name(x,y){
    return "X"+x+"Y"+y;
}

function isset(variable) {
    return typeof (variable) != "undefined" && variable !== null;
}

function is_array(a)
{
    return Object.prototype.toString.apply(a) === '[object Array]';
}


//Fixes the undefined console for IE.
if (typeof console == "undefined") {
    this.console = {
        log: function () {}
    };
}

/*
Sets a named stylesheet that will replace a previously creatad stylesheet with
the same name. (base stylesheets have no name, represented by an id tag in DOM)
*/
function set_named_stylesheet(id, css)
{
    $('#'+id).remove();

    var head = document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.id = id;
    style.type = 'text/css';
    if(style.styleSheet){
        style.styleSheet.cssText = css;
    }else{
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
};
