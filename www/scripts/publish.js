V5.registerCard("publish", function () {
  var initialize = function () {
    var card = this;
    var view = V5.View(card.node);

    view.bind("send", function () {

    });

    view.bind("goHome", function (event) {
      card.openCard("index");
    });

    view.delegateEvents({
        "click .back": "goHome",
        "click .send": "send"
    });
  };

  return {
    initialize: initialize
  };
});
