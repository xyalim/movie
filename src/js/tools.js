
function picFix(url){
    if(typeof url == 'string'){
        return url.replace('w.h','128.180');
    }
}

function picFixs(url,w,h){
    const type = w + '.' + h;
    if(typeof url == 'string'){
        return url.replace('w.h',type);
    }
}


export default {
    picFix,picFixs
}