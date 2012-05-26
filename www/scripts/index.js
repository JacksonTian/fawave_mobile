V5.registerCard("index", function () {
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

    $.getJSON(V5.proxy("http://api.t.sina.com.cn/statuses/public_timeline.json?source=117815021"), function (json) {
      proxy.fire("data", {statuses: json});
    });
    V5.getTemplate("status", function (template) {
      proxy.fire("template", template);
    });
  };

  return {
    initialize: initialize
  };
});
