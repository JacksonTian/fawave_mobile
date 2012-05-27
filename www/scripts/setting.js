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

    view.$('article li').bind('click', function (event) {
      var $this = $(this);
      var blogType = $this.data('type') || 'weibo';
      var user = { blogType: blogType, oauth_callback: location.href };
      if (V5.Model.proxy) {
        user.proxy = V5.Model.proxy;
      }
      tapi.get_authorization_url(user, function (err, auth_info) {
        console.log(auth_info);
        location.href = auth_info.auth_url;
      });
    });
  };

  return {
    initialize: initialize
  };
});
