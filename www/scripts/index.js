V5.registerCard("index", function () {
  var initialize = function () {
    var card = this;
    var view = V5.View(card.node);

    view.$(".publish").bind("click", function () {
      card.openCard("publish");
    });
    view.$(".view").bind("click", function () {
      card.openCard("timeline");
    });
  };

  return {
    initialize: initialize
  };
});
