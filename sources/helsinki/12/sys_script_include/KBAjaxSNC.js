var KBAjaxSNC = Class.create();

KBAjaxSNC.prototype = Object.extendsObject(AbstractAjaxProcessor, {

	saveUseful: function() {
		
		// (1) Declare helper variables
		var fields = {};
		fields.article = this.getParameter("sysparm_article_id") || "";
		fields.useful = this.getParameter("sysparm_useful") || "";
		fields.user = gs.getUserID();
		fields.query = this.getParameter("sysparm_query") || "";
		var passMessage = this._i18n("Submitted your helpful rating");
		var failMessage = this._i18n("Could not submit your helpful rating");
		
		// (2) Validate sampler parameter values		
		if (JSUtil.nil(fields.article) || JSUtil.nil(fields.useful) || JSUtil.nil(fields.user))
			return this._encode({success: false, message: failMessage});		
		
		// (3) Insert a new kb_feedback record
		var kbFeedbackGr = new GlideRecord("kb_feedback");
		kbFeedbackGr.initialize();
		for (var name in fields)
			kbFeedbackGr[name] = fields[name];
		var recordId = kbFeedbackGr.insert();
		if (recordId)
			return this._encode({success: true, message: passMessage});
		
		// (4) Tell the caller that the request failed
		return this._encode({success: false, message: failMessage});
	},
	
	saveStarRating: function() {
		
		// (1) Declare helper variables
		var fields = {};
		fields.article = this.getParameter("sysparm_id") || "";
		fields.rating = this.getParameter("sysparm_rating") || "";
		fields.user = gs.getUserID();
		fields.query = this.getParameter("sysparm_query") || "";
		var passMessage = this._i18n("Submitted your star rating");
		var failMessage = this._i18n("Could not submit your star rating");

		// (2) Validate sampler parameter values		
		if (JSUtil.nil(fields.article) || JSUtil.nil(fields.rating) || JSUtil.nil(fields.user))
			return this._encode({success: false, message: failMessage});

		// (3) Insert a new kb_feedback record
		var kbFeedbackGr = new GlideRecord("kb_feedback");
		kbFeedbackGr.initialize();
		for (var name in fields)
			kbFeedbackGr[name] = fields[name];
		
		var recordId = kbFeedbackGr.insert();

		if (recordId)
			return this._encode({success: true, message: passMessage});

		// (4) Tell the caller that the request failed
		return this._encode({success: false, message: failMessage});
	},

	isPubVersion3: function() {
		return new KBCommon().isPubVersion3(this.getParameter("sysparm_pub"));
	},
	
	kbWriteComment: function() {
		var feedback = unescape(this.getParameter("sysparm_feedback"));
		var view_id = this.getParameter("view_id");
		var fb = new GlideRecord('kb_feedback');
		if(view_id && view_id != "") {
			fb.addQuery("view_id",view_id);
			fb.query();
			if (!fb.next()) 
				view_id = gs.generateGUID();
		} else {
			view_id = gs.generateGUID();
		}
		fb.article = this.getParameter("sysparm_id");
		fb.user.setValue(gs.getUserID());
		fb.comments = feedback;
		fb.query = unescape(this.getParameter("sysparm_search"));
		if (this.getParameter("sysparm_flag") == "true")
			fb.flagged = "true";
		fb.view_id = view_id;
		fb.insert();
		
		var item = this.newItem();
		item.setAttribute("name", fb.user.getDisplayValue());
		item.setAttribute("date", fb.sys_created_on.getDisplayValue());
		item.setAttribute("comment", this._getFeedbackComment(fb.comments.getDisplayValue()));
	},
	
	_getFeedbackComment: function(feedback) {
		feedback = feedback.replace(/\n/g, "INSERTNEWLINE");
		feedback = GlideStringUtil.escapeHTML(feedback) + '';
		feedback = feedback.replace(/INSERTNEWLINE/g, "<br/>");
		return feedback;
	},

	/**
 	* Prevent public access to this script
 	*/
	isPublic: function() {
		return false;
	},
	
	process: function() {
		// Call method via reflection
		if (this[type])
			return this[type]();
	},
	
    _i18n: function(message, array) {
		message = message || "";
		var padded = " " + message + " ";
		var translated = gs.getMessage(padded, array);
		var trimmed = translated.trim();
        return trimmed;
    },

	_encode: function(object) {
		return new JSON().encode(object);
	},

	type: "KBAjaxSNC"
});