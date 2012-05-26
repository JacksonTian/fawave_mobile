V5.registerCard("index", function () {
  var initialize = function () {
    var card = this;
    var view = V5.View(card.node);

    // Write down your initialize code at here.
    $.get("http://www.baidu.com/", function (data) {
      view.html(data);
    });
  };

  return {
    initialize: initialize
  };
});
