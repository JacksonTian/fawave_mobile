V5.registerCard("publish", function () {
  var initialize = function () {
    var card = this;
    var view = V5.View(card.node);

    var pre = view.$(".pre");
    view.headerIScroll = new iScroll(view.$(".accounts")[0], {
      snap: 'li',
      useTransform : true,
      hScrollbar: false,
      vScrollbar: false,
      onScrollEnd: function () {
        if (this.currPageX > 0) {
          pre.addClass("active");
        } else {
          pre.removeClass("active");
        }
      }
    });

    view.bind("send", function (event) {
      $.ajax("url", function () {

      });
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
