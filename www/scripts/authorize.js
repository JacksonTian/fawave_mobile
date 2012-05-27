V5.registerCard("authorize", function () {
  var initialize = function (blogType) {
    var card = this;
    var view = V5.View(card.node);

    var url = V5.Model[blogType + '_auth_info'];
    view.el.html('<iframe src="' + url.auth_url + '"></iframe>');
    window.addEventListener("message", function (event) {
      console.log(event.data);
    }, false);

    view.delegateEvents({
    });
  };

  return {
    initialize: initialize
  };
});
