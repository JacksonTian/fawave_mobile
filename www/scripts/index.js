V5.registerCard("index", function () {
  var initialize = function () {
    var card = this;
    var view = V5.View(card.node);

    // Write down your initialize code at here.
    $.get(V5.proxy("http://www.baidu.com/"), function (data) {
      view.$(".area").html(data);
    });
  };

  return {
    initialize: initialize
  };
});
