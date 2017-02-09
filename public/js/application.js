///////////////////////////////////////////////////
////           APPLICATION POST LOAD           ////
///////////////////////////////////////////////////
//
//  Some variables are defined in this scope:
//      -   application [=> application.js]
//      -   pageManager [=> page-manager.js]
//

$(document).on("keydown", function disableF5(e) { if ((e.which || e.keyCode) == 116) e.preventDefault(); });
