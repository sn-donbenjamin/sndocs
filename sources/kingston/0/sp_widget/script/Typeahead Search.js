(function() {
	data.resultMsg = gs.getMessage("Search results");
	data.navigationMsg = gs.getMessage("To navigate, use up and down arrow keys while holding ");
	if (!options.contextual_search_sources)
		data.searchType = $sp.getParameter("t");
	else {
		var contextualSearchSources = options.contextual_search_sources.split(",");
		if (contextualSearchSources.length == 1) {
			var searchSourceGR = new GlideRecord("sp_search_source");
			if (searchSourceGR.get(contextualSearchSources[0]))
				data.searchType = searchSourceGR.getValue("id");
		} else
			data.searchType = $sp.getParameter("t");
	}

	data.results = [];
	data.searchMsg = gs.getMessage("Search");
	data.limit = options.limit || 15;
	var textQuery = '123TEXTQUERY321';

	if (!input) {
		data.typeaheadTemplates = {};

		var searchGroupTemplatesGR = new GlideRecord("sp_search_source");
		searchGroupTemplatesGR.query();
		while(searchGroupTemplatesGR.next()) {
			if (searchGroupTemplatesGR.advanced_typeahead_config)
				data.typeaheadTemplates["sp-typeahead-" + searchGroupTemplatesGR.getValue("id") + ".html"] = $sp.translateTemplate(searchGroupTemplatesGR.getValue("typeahead_template"));
		}

		return;
	}

	data.q = input.q;

	//Gotta decide if we want to use the portal's sources, or use the defaults declared by
	//the sys property
	var useDefaultPortals;
	if (!$sp.getPortalRecord()) {
		useDefaultPortals = true;
	} else {
		var searchSourcesForPortalGR = new GlideRecord("m2m_sp_portal_search_source");
		searchSourcesForPortalGR.addQuery("sp_portal", $sp.getPortalRecord().getUniqueValue());
		searchSourcesForPortalGR.query();
		useDefaultPortals = searchSourcesForPortalGR.getRowCount() == 0;
	}

	if (options.contextual_search_sources) {
		var contextualSearchSourceGR = new GlideRecord("sp_search_source");
		contextualSearchSourceGR.addQuery("sys_id", "IN", options.contextual_search_sources);
		contextualSearchSourceGR.query();
		while (contextualSearchSourceGR.next()) {
			data.searchType = contextualSearchSourceGR.getValue("id");
			getResults(contextualSearchSourceGR);
		}
	} else if (useDefaultPortals) {
		var defaultSearchSourceGR = new GlideRecord("sp_search_source");
		var defaultSearchSourceIDList = gs.getProperty("glide.service_portal.default_search_sources", "");
		defaultSearchSourceGR.addQuery("sys_id", "IN", defaultSearchSourceIDList);
		defaultSearchSourceGR.addQuery("enable_typeahead", true);
		defaultSearchSourceGR.query();
		while(defaultSearchSourceGR.next()) {
			getResults(defaultSearchSourceGR);
		}
	} else {
		var m2mSearchSourceGR = new GlideRecord("m2m_sp_portal_search_source");
		m2mSearchSourceGR.addQuery("sp_search_source.enable_typeahead", true);
		m2mSearchSourceGR.addQuery("sp_portal", $sp.getPortalRecord().getUniqueValue());
		m2mSearchSourceGR.query();
		while(m2mSearchSourceGR.next()) {
			getResults(m2mSearchSourceGR.getElement("sp_search_source").getRefRecord());
		}
	}

	function getResults(gr) {
		//Check if the user is allowed to see this source.
		var userCriteria = new GlideSPUserCriteria();
		if (userCriteria.isEnabled()) {
			if (!userCriteria.userCanSeeSearchSource(gr.getUniqueValue()))
				return;
		} else {
			var gs = GlideSession.get();
			var searchSourceRoles = gr.getValue("roles");
			if (searchSourceRoles && !gs.hasRole(searchSourceRoles))
				return;
		}

		if (gr.is_scripted_source) {
			var input = {};
			input.query = data.q;
			var evaluator = new GlideScopedEvaluator();
			var results = evaluator.evaluateScript(gr, "data_fetch_script", input);

			results.forEach(function(item) {
				if (gr.advanced_typeahead_config)
					item.templateID = "sp-typeahead-" + gr.getValue("id") + ".html";
				else {
					item.glyph = gr.getValue("typeahead_glyph");
					item.linkToPage = gr.getValue("page");
				}
				data.results.push(item);
			});
		} else {
			var primaryField = gr.getValue("primary_display_field");
			var displayFields = gr.getValue("display_fields");

			var resultGR = new GlideRecordSecure(gr.getValue("source_table"));
			var condition = gr.getValue("condition");
			if (condition)
				resultGR.addEncodedQuery(condition);
			if (data.q)
				resultGR.addQuery('123TEXTQUERY321', data.q);
			resultGR.query();

			var searchTableCount = 0;
			while (resultGR.next() && searchTableCount < data.limit) {
				if (!resultGR.canRead())
					continue;

				var secondaryValues = {};

				if (displayFields)
					displayFields.split(",").forEach(function(field) {
						var obj = getField(resultGR, field);
						secondaryValues[field] = obj;
					});

				var item = {
					primary: (primaryField) ? resultGR.getValue(primaryField) : resultGR.getDisplayValue(),
					sys_id: resultGR.getUniqueValue(),
					table: resultGR.getTableName(),
					fields: secondaryValues
				};

				if (gr.advanced_typeahead_config)
					item.templateID = "sp-typeahead-" + gr.getValue("id") + ".html";
				else {
					item.glyph = gr.getValue("typeahead_glyph");
					item.linkToPage = gr.getValue("page");
				}

				data.results.push(item);
				searchTableCount++;
			}
		}

		var pageGR = new GlideRecord("sp_page");
		if (pageGR.get(gr.getValue("page")))
			var pageID = pageGR.getValue("id");

		data.results.forEach(function(result) {
			if (result.url)
				return;

			if (pageID) {
				result.url = "?id=" + pageID;
				if (result.sys_id)
					result.url += "&sys_id=" + result.sys_id;
				if (result.table)
					result.url += "&table=" + result.table
			} else {
				result.url = "";
			}
		});
	}
	
	gs.flushMessages();
	
	function getField(gr, name) {
		var f = {};
		f.display_value = gr.getDisplayValue(name);
		f.value = gr.getValue(name);
		var ge = gr.getElement(name);
		if (ge == null)
			return f;

		f.type = ge.getED().getInternalType()
		f.label = ge.getLabel();
		return f;
	}
	
})();