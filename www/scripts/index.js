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
    var pullDownEl = view.$('.pullDown');
    var pullDownOffset = pullDownEl.height();
    var pullUpEl = view.$('.pullUp');
    var pullUpOffset = pullUpEl.height();
    view.iScroll = new iScroll(view.$("article")[0], {
        onBeforeScrollStart : function (e) {
      },
      useTransition: true,
      topOffset: pullDownOffset,
      onRefresh: function () {
        if (pullDownEl.hasClass('loading')) {
          pullDownEl.removeClass('loading').removeClass('flip');
          pullDownEl.find('.pullDownLabel').html('Pull down to refresh...');
        } else if (pullUpEl.hasClass('loading')) {
          pullUpEl.removeClass('loading').removeClass('flip');
          pullUpEl.find('.pullUpLabel').html('Pull up to load more...');
        }
      },
      onScrollMove: function () {
        if (this.y > 5 && !pullDownEl.hasClass('flip')) {
          pullDownEl.addClass('flip');
          pullDownEl.find('.pullDownLabel').html('Release to refresh...');
          this.minScrollY = 0;
        } else if (this.y < 5 && pullDownEl.hasClass('flip')) {
          pullDownEl.removeClass('flip');
          pullDownEl.find('.pullDownLabel').html('Pull down to refresh...');
          this.minScrollY = -pullDownOffset;
        } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.hasClass('flip')) {
          pullUpEl.addClass('flip');
          pullUpEl.find('.pullUpLabel').html('Release to refresh...');
          this.maxScrollY = this.maxScrollY;
        } else if (this.y > (this.maxScrollY + 5) && pullUpEl.hasClass('flip')) {
          pullUpEl.removeClass('flip');
          pullUpEl.find('.pullUpLabel').html('Pull up to load more...');
          this.maxScrollY = pullUpOffset;
        }
      },
      onScrollEnd: function () {
        if (pullDownEl.hasClass('flip')) {
          pullDownEl.addClass('loading');
          pullDownEl.find('.pullDownLabel').html('Loading...');
          getTimeline(); // Execute custom function (ajax call?)
        } else if (pullUpEl.hasClass('flip')) {
          pullUpEl.addClass('loading');
          pullUpEl.find('.pullUpLabel').html('Loading...');
          getTimeline(); // Execute custom function (ajax call?)
        }
      }
    });
    proxy.assignAlways("template", "data", function (template, data) {
      view.$(".statuses ul").html(_.template(template, data));
      view.iScroll.refresh();
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
    V5.getTemplate("status", function (template) {
      proxy.fire("template", template);
    });
    getTimeline();
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
