requirejs.config({
    paths : {
        "harmony" : "node_modules/harmony/harmony",
        "file" : "node_modules/requirejs-text/text",
        "centrifuge" : "node_modules/centrifuge/centrifuge"
    }
});

requirejs(["harmony-centrifuge"], function(centrifuge){

    window.centrifuge = centrifuge;

});