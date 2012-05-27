V5.registerCard("setting", function () {
  var initialize = function () {
    var card = this;
    var view = V5.View(card.node);


    var footer = view.$("footer");
    view.bind("go", function (event) {
      var current = $(event.currentTarget);
      footer.find(".active").removeClass("active");
      current.addClass("active");
    });

    view.bind("goSetting", function (event) {
      card.openCard("setting");
    });

    view.bind("goHome", function (event) {
      card.openCard("index");
    });

    view.delegateEvents({
      "click footer a": "go",
      "click footer a.add": "goSetting",
      "click footer a.home": "goHome",
      "click header a.home": "goHome"
    });
  };

  return {
    initialize: initialize
  };
});
