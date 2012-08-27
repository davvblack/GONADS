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

function min_object(object, key)
{
    var min_val = INFINITY;
    var min_key = [];
    for(i in object)
    {
        if(object.hasOwnProperty(i))
        {
            if(key)
            {
                if (object[i] && object[i][key]<min_val)
                {
                    min_key = [i];
                    min_val = object[i][key];
                }
                else if(object[i] && object[i][key]==min_val)
                {
                    min_key.push(i);
                }
            }
            else
            {
                if (object[i]<min_val)
                {
                    min_key = [i];
                    min_val = object[i];
                }
                else if(object[i]==min_val)
                {
                    min_key.push(i);
                }
            }
        }
    }
    return {val: min_val, key: min_key};
}


function max_object(object, key)
{
    var max_val = -INFINITY;
    var max_key = false;
    for(i in object)
    {
        if(object.hasOwnProperty(i))
        {
            if(key)
            {
                if (object[i] && object[i][key]>max_val)
                {
                    max_key = [i];
                    max_val = object[i][key];
                }
                else if(object[i] && object[i][key]==max_val)
                {
                    max_key.push(i);
                }
            }
            else
            {
                if (object[i]>max_val)
                {
                    max_key = [i];
                    max_val = object[i];
                }
                else if(object[i]==max_val)
                {
                    max_key.push(i);
                }
            }
        }
    }
    return {val: max_val, key: max_key};
}

function containsObject(list, obj) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}


/*
Sets a named stylesheet that will replace a previously creatad stylesheet with
the same name. (base stylesheets have no name, represented by an id tag in DOM)
*/
function set_named_stylesheet(id, css)
{
    $('style#'+id).remove();

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
