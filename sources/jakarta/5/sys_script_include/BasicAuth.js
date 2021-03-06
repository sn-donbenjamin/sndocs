var BasicAuth = Class.create();

BasicAuth.prototype = {
   initialize : function(request, response, auth_type, auth_value) {
      this.request = request;
      this.response = response;
      this.auth_type = auth_type;
      this.auth_value = auth_value;
   },
   
   getAuthorized : function() {
      var up = GlideStringUtil.base64Decode(this.auth_value);
      var split = up.indexOf(":");
      
      if (split == -1) {
         gs.log("Basic authentication not well formed");
         return null;
      }
      
      // locate user and impersonate
      var userName = up.substring(0, split);
      var password = up.substring(split + 1);
	  var result = GlideUser.authenticateUser(userName, password);
      
      if (!result) {
         gs.log("Basic authentication failed for user: " + userName);
         return null;
      }

      this.updateLastLogin(result);
      
      // user is authenticated, so return it...
      return result;
   },

   updateLastLogin : function(userName) {
      if ('true' != gs.getProperty("glide.basicauth.update_last_login_time", "false"))
        return;

      var user = new GlideRecord("sys_user");
      user.addQuery("user_name", userName);
      user.query();
      if(user.next()){
         user.last_login_time = new GlideDateTime();
         user.update();
      }
   }
}