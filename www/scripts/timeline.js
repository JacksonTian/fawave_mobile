V5.registerCard("timeline", function () {
  var initialize = function () {
    var page = this;
    var view = V5.View(page.node);

    var proxy = new EventProxy();
    proxy.assign("template", "data", function (template, data) {
      view.$(".statuses").html(_.template(template, data));
      view.iscroll = new iScroll(view.$("article")[0], {
        useTransform : false,
        onBeforeScrollStart : function (e) {
        }
      });
    });

    var user = {
      blogType: 'tsina'
    };
    if (!navigator.notification) {
      user.proxy = location.host + '/proxy';
    }
    console.log(user);
    weibo.TAPI.public_timeline({ user: user }, function (err, statuses) {
      proxy.fire("data", { statuses: statuses });
    });

    V5.getTemplate("status", function (template) {
      proxy.fire("template", template);
    });
  };

  return {
    initialize: initialize
  };
});
