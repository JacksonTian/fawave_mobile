V5.registerCard("setting", function () {
  var initialize = function (url) {
    var card = this;
    var view = V5.View(card.node);


    view.node.html('<iframe src="' + url + '"></iframe>');

    view.delegateEvents({
    });
  };

  return {
    initialize: initialize
  };
});
