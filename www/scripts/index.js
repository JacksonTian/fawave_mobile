V5.registerCard("index", function () {
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

    var proxy = new EventProxy();
    proxy.assign("template", "data", function (template, data) {
      view.$(".statuses").html(_.template(template, data));
      if (view.iScroll) {
        view.iScroll.destory();
        view.iScroll = null;
      }
      view.iScroll = new iScroll(view.$("article")[0], {
        useTransform : false,
        onBeforeScrollStart : function (e) {
        }
      });
    });

    var getTimeline = function () {
      var user = {
        blogType: 'tsina',
        authtype: 'oauth',
        oauth_token_key: '10860b4bd170b003381ea6d953f3aba6',
        oauth_token_secret: 'c0af7008eba4d9de8e14a4c61e45b318' 
      };
      if (!navigator.notification) {
        user.proxy = location.origin + '/proxy';
      }
      weibo.TAPI.friends_timeline({ user: user }, function (error, statuses) {
        proxy.fire("data", { statuses: statuses });
      });
      
    };
    getTimeline();
    V5.getTemplate("status", function (template) {
      proxy.fire("template", template);
    });

    view.bind("goPublish", function (event) {
      card.openCard("publish");
    });

    view.bind("refresh", function (event) {
      getTimeline();
    });

    view.delegateEvents({
        "click .write": "goPublish",
        "click .refresh": "refresh"
    });

  };

  return {
    initialize: initialize
  };
});
