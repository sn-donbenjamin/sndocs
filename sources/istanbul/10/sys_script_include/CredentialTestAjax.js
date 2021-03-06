var CredentialTestAjax = Class.create();

CredentialTestAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	ajaxFunction_testCredential: function() {
		var credential_data = this.getParameter('sysparm_credential_data');
		var target = this.getParameter('sysparm_target');
		var port = this.getParameter('sysparm_port');
		var agent = this.getParameter('sysparm_agent');
		
		session.getUser().setPreference('test_credential.target', target); 
		session.getUser().setPreference('test_credential.midserver_name', agent);
		
		return SNC.CredentialTest.test(credential_data, target, port, agent);
	},
	
	ajaxFunction_testCredentialJdbc: function() {
		var credential_data = this.getParameter('sysparm_credential_data');
		var target = this.getParameter('sysparm_target');
		var port = this.getParameter('sysparm_port');
		var agent = this.getParameter('sysparm_agent');
		var db_type = this.getParameter('sysparm_db_type');
		var db_name = this.getParameter('sysparm_db_name');
		
		session.getUser().setPreference('test_credential.target', target); 
		session.getUser().setPreference('test_credential.midserver_name', agent);
		
		return SNC.CredentialTest.testJdbc(credential_data, target, port, agent, db_type, db_name);
	},
	
	ajaxFunction_testCredentialJms: function() {
		var credential_data = this.getParameter('sysparm_credential_data');
		var target = this.getParameter('sysparm_target');
		var port = this.getParameter('sysparm_port');
		var agent = this.getParameter('sysparm_agent');
		var initial_context_factory = this.getParameter('sysparm_initial_context_factory');
		
		session.getUser().setPreference('test_credential.target', target); 
		session.getUser().setPreference('test_credential.midserver_name', agent);
		
		return SNC.CredentialTest.testJms(credential_data, target, port, agent, initial_context_factory);
	},
	
	ajaxFunction_testCredentialAws: function() {
		var credential_id = this.getParameter('sysparm_credential_id');

		return new AWSCredentialTest(credential_id).run();
	},
	
	ajaxFunction_parseCredentialTestResult: function() {
		var ecc_sys_id = this.getParameter('sysparm_ecc_sys_id');
		var gr = new GlideRecord('ecc_queue');
		gr.get(ecc_sys_id);
		
		var parser = new CredentialTestParser(gr.payload);
		return parser.getResult();
	},
	
	ajaxFunction_checkProgress: function() {
		var agent = this.getParameter('sysparm_agent');
		if (JSUtil.notNil(agent)) {
			// If MID Server is down, bail
			var mid = MIDServer.getByName(agent);
			if (!mid)
				return "error:Could not find MID Server: " + agent;
		
			if (mid.status !== "Up")
				return "error:MID Server: " + agent + " is not up";
			
			if (!JSUtil.toBoolean(mid.validated))
				return "error:MID Server: " + agent + " is not validated";
		}
		
		var ecc_sys_id = this.getParameter('sysparm_ecc_sys_id');
		var ecc_gr = new GlideRecord('ecc_queue');
		ecc_gr.addQuery('response_to', ecc_sys_id);
		ecc_gr.query();
		if (!ecc_gr.next())
			return "processing";
		
		return ecc_gr.sys_id;
	},

	type: 'CredentialTestAjax'
});