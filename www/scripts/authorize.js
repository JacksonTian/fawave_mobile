V5.registerCard("authorize", function () {

  var initialize = function (blogType) {
    var card = this;
    var view = V5.View(card.node);

    var auth_info = V5.Model.auth_info;
    V5.Model.auth_info = null;
    if (!auth_info) {
      return card.openCard('setting');
    }
    view.el.html('<iframe src="' + auth_info.auth_url + '"></iframe>');

    function callbackHandler(event) {
      window.removeEventListener('message', callbackHandler);
      var query = weibo.utils.querystring.parse(event.data);
      // alert(event.data);
      // auth_info.oauth_verifier = query.oauth_verifier;
      weibo.utils.extend(auth_info, query);
      tapi.get_access_token(auth_info, function (err, access_token) {
        if (err) {
          alert(err.message);
          card.openCard('setting');
        } else {
          weibo.utils.extend(auth_info, access_token);
          tapi.verify_credentials(access_token, function (err, user) {
            console.log(arguments);
            if (err) {
              alert(err.message);
            } else {
              user = user || {};
              weibo.utils.extend(user, access_token);
              V5.Model.users = V5.Model.users || [];
              V5.Model.users.push(user);
              V5.Model.currentUser = user;
              card.openCard('index/' + new Date().getTime());
            }
          });
        }
      });
    }
    
    window.addEventListener('message', callbackHandler, false);

    view.delegateEvents({
    });
  };

  return {
    initialize: initialize
  };
});
