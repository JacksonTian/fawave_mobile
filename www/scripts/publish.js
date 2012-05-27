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
      var text = view.$('article textarea').val();
      var user = V5.Model.currentUser;
      tapi.update({ status: text, user: user }, function (err, status) {
        if (err) {
          return alert(err.message);
        }
        view.$('article textarea').val('');
        card.openCard("index");
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
