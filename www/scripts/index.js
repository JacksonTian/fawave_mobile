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
      onBeforeScrollStart: function (e) {},
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
          // get new datas
          pullDownEl.addClass('loading');
          pullDownEl.find('.pullDownLabel').html('Loading...');
          getTimeline(); // Execute custom function (ajax call?)
        } else if (pullUpEl.hasClass('flip')) {
          pullUpEl.addClass('loading');
          pullUpEl.find('.pullUpLabel').html('Loading...');
          nextPage(); // Execute custom function (ajax call?)
        }
      }
    });

    var currentUser = {
      blogType: 'tsina',
      authtype: 'oauth',
      oauth_token_key: 'd1ef5fa9aa9fee08fdc6267193a59d6a',
      oauth_token_secret: '798722589f339cc4e9e0a66a9b53f693' 
    };
    if (!navigator.notification) {
      currentUser.proxy = location.origin + '/proxy';
    }

    proxy.assignAlways("template", "data", function (template, data) {
      var api = tapi.api_dispatch(currentUser);
      data.api = api;
      if (data.append) {
        view.$(".statuses ul").append(_.template(template, data));
      } else {
        view.$(".statuses ul").html(_.template(template, data));
      }
      view.iScroll.refresh();
    });

    proxy.assignAlways('counts', function (counts) {
      counts = counts || [];
      for (var i = 0, l = counts.length; i < l; i++) {
        var count = counts[i];
        var $status = view.$('.statuses li[data-id="' + count.id + '"]');
        $status.find('.comment_count span').html(count.comments);
        $status.find('.repost_count span').html(count.rt);
      }
    });

    var getTimeline = function () {
      tapi.friends_timeline({ user: currentUser }, function (err, statuses) {
        proxy.fire("data", { statuses: statuses });
        showCounts(statuses);
      });
    };

    var nextPage = function () {
      var max_id = view.$('.statuses li:last-child').data('id');
      tapi.friends_timeline({
        user: currentUser,
        max_id: max_id
      }, function (err, statuses) {
        proxy.fire('data',  { statuses: statuses, append: true });
        showCounts(statuses);
      });
    };

    var showCounts = function (statuses) {
      if (!statuses || statuses.length === 0) {
        return;
      }
      var ids = {};
      for (var i = 0, l = statuses.length; i < l; i++) {
        var status = statuses[i];
        ids[status.id] = 1;
        if (status.retweeted_status) {
          ids[status.retweeted_status.id] = 1;
        }
      }
      ids = Object.keys(ids);
      tapi.counts({ user: currentUser, ids: ids.join(',') }, function (err, counts) {
        proxy.fire('counts', counts);
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

    view.bind("zoomin", function (event) {
      // var img = $(event.currentTarget);
      // if (img.data("state") === "thumbnail") {
      //   img.attr("src", img.data("bmiddle"));
      //   img.data("state", "bmiddle");
      // } else {
      //   img.attr("src", img.data("thumbnail"));
      //   img.data("state", "thumbnail");
      // }
      // view.iScroll.refresh();
    });

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
      "click .write": "goPublish",
      "click .refresh": "refresh",
      "click .status img": "zoomin",
      "click footer a": "go",
      "click footer a.add": "goSetting"
    });

  };

  return {
    initialize: initialize
  };
});
