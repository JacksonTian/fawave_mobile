V5.registerCard("index", function () {
  var initialize = function () {
    var card = this;
    var view = V5.View(card.node);

    // Write down your initialize code at here.
    $.post(V5.proxy("http://www.baidu.com/"), {
      text: 'processDataprocessDataprocessDataprocessDataprocessDataprocessDataprocessDataprocessDataprocessDataprocessDataprocessData'
    }, function (data) {
      view.$(".area").html(data);
    });
    view.$(".publish").bind("click", function () {
      card.openCard("publish");
    });
  };

  return {
    initialize: initialize
  };
});
