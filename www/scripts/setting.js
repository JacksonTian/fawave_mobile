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

    view.bind("authorize", function (event) {
      card.openCard("authorize");
    });

    view.delegateEvents({
      "click footer a": "go",
      "click footer a.add": "goSetting",
      "click footer a.home": "goHome",
      "click header a.home": "goHome"
    });

    view.$('article li').bind('click', function (event) {
      var current = $(event.currentTarget);
      var blogType = current.data('type') || 'weibo';
      var user = { blogType: blogType, oauth_callback: 'http://club.fawave.net4team.net/oauth_callback.html' };
      if (V5.Model.proxy) {
        user.proxy = V5.Model.proxy;
      }
      tapi.get_authorization_url(user, function (err, auth_info) {
        if (err) {
          alert(err.message);
          return;
        }
        weibo.utils.extend(user, auth_info);
        V5.Model.auth_info = user; 
        card.openCard("authorize/" + blogType + '?r=' + new Date().getTime());
      });
    });
  };

  return {
    initialize: initialize
  };
});
