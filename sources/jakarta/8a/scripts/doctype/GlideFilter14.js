/*! RESOURCE: /scripts/doctype/GlideFilter14.js */
MESSAGES_FILTER_BUTTONS = ['Run Filter', 'Run', 'Add AND Condition', 'Add OR Condition', 'and', 'or', 'Delete'];
MESSAGES_FILTER_MISC = ['Run Filter', 'Run', 'Order results by the following fields'];
var GlideFilter = Class.create();
GlideFilter.prototype = {
  VARIABLES: "variables",
  LABELS_QUERY: "HASLABEL",
  OPERATOR_EQUALS: "=",
  FILTER_DIV: "gcond_filters",
  fIncludedExtendedOperators: {},
  fUsageContext: "default",
  fUseVariable: true,
  initialize: function(name, query, fDiv, runnable, synchronous, callback, originalQuery, listCollectorId) {
    "use strict";
    this.synchronous = false;
    if (typeof synchronous != 'undefined')
      this.synchronous = synchronous;
    if (typeof query === 'function') {
      callback = query;
      query = null;
    }
    this.callback = callback;
    this.query = query;
    this.maintainPlaceHolder = false;
    this.conditionsWanted = !noConditionals;
    this.opsWanted = !noOps;
    this.defaultPlaceHolder = true;
    this.runable = runnable;
    this.textAreasWanted = useTextareas;
    this.tableName = name;
    this.restrictedFields = null;
    this.ignoreFields = null;
    this.onlyRestrictedFields = false;
    this.includeExtended = false;
    this.divName = "gcond_filters";
    this.filterReadOnly = false;
    this.isTemplate = false;
    this.listCollectorId = listCollectorId;
    if (fDiv != null)
      this.divName = fDiv + "gcond_filters";
    this.fDiv = getThing(this.tableName, this.divName);
    if (this.fDiv.filterObject) {
      this.fDiv.filterObject.destroy();
      this.fDiv.filterObject = null;
      this.fDiv = null;
    }
    this.fDiv = getThing(this.tableName, this.divName);
    this.fDiv.filterObject = this;
    this.fDiv.initialQuery = query;
    var mappingId = this.mappingId = this.fDiv.id.replace(/gcond_filters$/, "");
    this.elementSupportsMapping = !!gel("sys_mapping." + this.mappingId);
    this.sortElement = $('gcond_sort_order');
    if (this.sortElement)
      this.sortElement.filterObject = this;
    else
      this.sortElement = this.fDiv;
    this.sections = [];
    this.disabledFilter = false;
    this.originalQuery = originalQuery;
    var mappingRows = [];

    function cleanMappingFields() {
      for (var i = 0; mappingRows.length > i; i++) {
        var handler = mappingRows[i];
        if (!$j.contains(document.body, handler.tr)) {
          destroyHandler(handler);
          mappingRows.splice(i, 1);
          i--;
        }
      }
    }

    function initMapHandler(handler) {
      mappingRows.push(handler);
      CachedEvent.after("sys_mapping:loaded", function(mAPI) {
        mAPI.initOperand(handler, mappingId);
      });
      cleanMappingFields();
    }

    function destroyHandler(handler) {
      CachedEvent.after("sys_mapping:loaded", function(mAPI) {
        mAPI.destroyOperand(handler, mappingId);
      });
    }
    var currentMapState = "";

    function syncMappingStatus() {
      var active = false;
      for (var i = 0, l = mappingRows.length; l > i; i++) {
        if (mappingRows[i]._isMappingEnabled) {
          active = true;
          break;
        }
      }
      var status = active ? "partial" : "inactive";
      if (currentMapState !== status) {
        currentMapState = status;
        CustomEvent.fire("sys_mapping:set_field_state::" + mappingId, status);
      }
    }
    this.mappingMgr = {
      initElement: initMapHandler,
      destroyElement: function() {
        cleanMappingFields();
        syncMappingStatus();
      },
      notifyStateChange: function() {
        cleanMappingFields();
        syncMappingStatus();
      }
    };
    this.initMessageCache();
  },
  init2: function() {
    if (typeof this.query != 'undefined') {
      if (this.synchronous)
        this.setQuery(this.query);
      else
        this.setQueryAsync(this.query);
    } else {
      this.reset();
    }
    this.setOptionsFromParmsElement(this.tableName);
    if (this.callback) {
      this.callback(this);
    }
  },
  setValue: function(value) {
    this.setQuery(value);
  },
  _setValue: function(value) {
    this.setQuery(value);
  },
  setSectionClasses: function() {
    var tbody = $(this.getDiv() || getThing(this.tableName, this.divName));
    tbody.removeClassName('sn-filter-multi-clause');
    tbody.removeClassName('sn-filter-multi-condition');
    tbody.removeClassName('sn-filter-empty');
    if (!this.conditionsWanted)
      return;
    var showOr = false;
    $j("button.new-or-button").hide();
    var sections = this.sections;
    if (sections.length == 1) {
      var i = sections[0].conditions.length;
      if (i == 0)
        tbody.addClassName('sn-filter-empty');
      else if (i == 1)
        showOr = true;
      else if (i > 1) {
        tbody.addClassName('sn-filter-multi-condition');
        showOr = true;
      }
    } else if (sections.length > 1) {
      tbody.addClassName('sn-filter-multi-clause');
      showOr = true;
    }
    if (sections.length > 0)
      $j((sections[sections.length - 1]).table).addClass('sn-animate-filter-clause');
    if (showOr)
      $j("button.new-or-button").show();
  },
  setOptionsFromParmsElement: function(name) {
    var p = name.split(".");
    var elem = gel(p[1] + "." + p[2]);
    if (!elem)
      return;
    var ut = elem.getAttribute("data-usage_context");
    if (ut)
      this.setUsageContext(ut);
    var uv = elem.getAttribute("data-use-variables");
    if (uv)
      this.setUseVariables(uv);
    var rf = elem.getAttribute('data-restricted_fields');
    if (rf) {
      this.setRestrictedFields(rf);
      this.setOnlyRestrictedFields(true);
    }
    var eo = elem.getAttribute("data-extended_operators");
    if (eo)
      this.setIncludeExtended(eo);
  },
  setUsageContext: function(usage) {
    this.fUsageContext = usage;
    if (usage == "element_conditions") {
      this.addExtendedOperator("MATCH_PAT");
      this.addExtendedOperator("MATCH_RGX");
      this.ignoreVariables();
    }
  },
  getUsageContext: function() {
    return this.fUsageContext;
  },
  setUseVariables: function(useVariables) {
    this.fUseVariable = useVariables === 'true';
  },
  getUseVariables: function() {
    return this.fUseVariable;
  },
  destroy: function() {
    this.destroyed = true;
    if (this.fDiv) {
      this.fDiv.filterObject = null;
      this.fDiv = null;
    }
    this._clearSections();
  },
  _clearSections: function() {
    for (var i = 0; i < this.sections.length; i++)
      this.sections[i].destroy();
    if (this.sortSection)
      this.sortSection.destroy();
    this.sections = [];
    this.sortSection = null;
  },
  initMessageCache: function() {
    "use strict"
    var all = {};
    for (var key in sysvalues) {
      var values = sysvalues[key];
      var keys = buildMap(values, 0);
      for (var i = 0; i < keys.length; i++)
        all[keys[i]] = 't';
    }
    for (key in sysopers) {
      var values = sysopers[key];
      var keys = buildMap(values, 1);
      for (var i = 0; i < keys.length; i++)
        all[keys[i]] = 't';
    }
    var m = new Array();
    m = m.concat(MESSAGES_FILTER_BUTTONS, MESSAGES_FILTER_MISC, MESSAGES_CONDITION_RELATED_FILES);
    for (var i = 0; i < m.length; i++)
      all[m[i]] = 't';
    var send = [];
    for (key in all)
      send.push(key);
    NOW.msg.fetch(send, this.init2.bind(this));
  },
  setRestrictedFields: function(fields) {
    jslog("Received restricted fields " + fields);
    var fa = fields.split(",");
    if (fa.length == 0)
      return;
    this.restrictedFields = {};
    for (var i = 0; i < fa.length; i++)
      this.restrictedFields[fa[i]] = fa[i];
  },
  ignoreVariables: function(params) {
    var variables = params || ['variables', 'questions', 'sys_tags'];
    this.addIgnoreFields(variables.join(','));
  },
  addIgnoreFields: function(fields) {
    var fa = fields.split(",");
    if (fa.length == 0)
      return;
    if (!this.ignoreFields)
      this.ignoreFields = {};
    for (var i = 0; i < fa.length; i++)
      this.ignoreFields[fa[i]] = fa[i];
  },
  setOnlyRestrictedFields: function(only) {
    this.onlyRestrictedFields = only;
  },
  getIncludeExtended: function() {
    return this.fIncludedExtendedOperators;
  },
  setIncludeExtended: function(include) {
    var ops = include.split(";");
    for (var x = 0; x < ops.length; x++) {
      this.addExtendedOperator(ops[x]);
    }
  },
  addExtendedOperator: function(oper) {
    this.fIncludedExtendedOperators[oper] = true;
  },
  filterFields: function(item) {
    var name = item.getName();
    if (!this.restrictedFields) {
      if (!this.ignoreFields)
        return true;
      if (this.ignoreFields[name])
        return false;
      return true;
    }
    if (name.indexOf(".") > -1)
      return false;
    if (this.restrictedFields[name])
      return true;
    return false;
  },
  setFieldUsed: function(name) {},
  clearFieldUsed: function(name) {},
  refreshSelectList: function() {},
  isTemplatable: function() {
    return false;
  },
  setQuery: function(query) {
    jslog("setQuery Synchronously:  " + query);
    this.glideQuery = new GlideEncodedQuery(this.tableName, query);
    this.glideQuery.parse();
    this.reset();
    this.build();
  },
  setQueryAsync: function(query, defaultVal) {
    this.addLoadingIcon();
    this.glideQuery = new GlideEncodedQuery(this.tableName, query, this.setQueryCallback.bind(this));
    if (defaultVal)
      this.defaultVal = defaultVal.split(",");
    this.glideQuery.parse();
    this.queryProcessed = true;
  },
  setQueryCallback: function() {
    if (this.destroyed)
      return;
    this.reset();
    this.build();
    if (this.getFilterReadOnly()) {
      this.setReadOnly(true);
    }
    CustomEvent.fire('filter:' + this.type + '-done', true);
  },
  setRunable: function(b) {
    this.runable = b;
  },
  isRunable: function() {
    return this.runable;
  },
  setDefaultPlaceHolder: function(b) {
    this.defaultPlaceHolder = b;
  },
  setMaintainPlaceHolder: function(b) {
    this.maintainPlaceHolder = true;
  },
  getMaintainPlaceHolder: function() {
    return this.maintainPlaceHolder;
  },
  setFilterReadOnly: function(b) {
    this.filterReadOnly = b;
  },
  getFilterReadOnly: function() {
    return this.filterReadOnly;
  },
  setRunCode: function(code) {
    this.runCode = code;
  },
  reset: function() {
    var e = this.fDiv;
    if (!e)
      return;
    if (e.tagName == 'TBODY') {
      var toRemove = [];
      for (var i = 0; i < e.childNodes.length; i++) {
        var tr = e.childNodes[i];
        if ($(tr).hasClassName('no_remove'))
          continue;
        toRemove.unshift(i);
      }
      for (i = 0; i < toRemove.length; i++)
        e.removeChild(e.childNodes[toRemove[i]]);
    } else {
      clearNodes(this.fDiv);
    }
    this._clearSections();
  },
  getXML: function() {
    return this.glideQuery.getXML();
  },
  build: function() {
    this.queryProcessed = true;
    this.terms = this.glideQuery.getTerms();
    this.buildQuery();
    this.buildOrderBy();
  },
  buildOrderBy: function() {
    var orderArray = this.glideQuery.getOrderBy();
    if (orderArray.length == 0)
      return;
    for (var i = 0; i < orderArray.length; i++) {
      var order = orderArray[i];
      if (order.isAscending())
        this.addSortRow(order.getName(), 'ascending');
      else
        this.addSortRow(order.getName(), 'descending');
    }
  },
  buildQuery: function() {
    "use strict"
    this._loadTablesForQuery();
    this.preQuery();
    var partCount = 0;
    var section = this.addSection();
    var queryID = section.getQueryID();
    this.removeLoadingIcon();
    for (var i = 0; i < this.terms.length; i++) {
      var qp = this.terms[i];
      if (!qp.isValid())
        continue;
      partCount += 1;
      if (qp.isNewQuery()) {
        var section = this.addSection();
        queryID = section.getQueryID();
      }
      var field = qp.getField();
      var operator = qp.getOperator();
      var operands = qp.getValue();
      if (this.isHaslabelQuery(field, operator, operands)) {
        operands = operands.substring(1);
        field = "sys_tags";
        operator = this.OPERATOR_EQUALS;
      }
      if (this.defaultVal) {
        for (var n = 0; n < this.defaultVal.length; n++) {
          var fieldIsDefault = false;
          var defaultQuery = this.defaultVal[n].split("=");
          var defaultField = defaultQuery[0];
          if (defaultField == field) {
            fieldIsDefault = true;
            this.defaultVal.splice(n, 1);
            n = this.defaultVal.length;
          }
        }
      }
      gotoPart = qp.isGoTo();
      if (qp.isOR())
        this.currentCondition.addNewSubCondition(field, operator, operands);
      else
        this.addConditionRow(queryID, field, operator, operands, fieldIsDefault);
    }
    if (partCount == 0 && this.defaultPlaceHolder)
      this.addConditionRow(queryID);
    gotoPart = false;
  },
  addLoadingIcon: function() {
    var templateFilter = gel(this.fieldName + "filters_table");
    if (templateFilter && templateFilter.className !== 'filter_load_icon') {
      this.filterClasses = templateFilter.getAttribute("class");
      templateFilter.className = 'filter_load_icon';
    }
  },
  removeLoadingIcon: function() {
    var templateFilter = gel(this.fieldName + "filters_table");
    if (templateFilter && templateFilter.className === 'filter_load_icon')
      templateFilter.className = this.filterClasses;
  },
  isHaslabelQuery: function(field, operator, operands) {
    return field == this.VARIABLES &&
      operator == this.LABELS_QUERY &&
      operands.length > 1;
  },
  preQuery: function() {},
  isProtectedField: function(name) {
    return false;
  },
  _loadTablesForQuery: function() {
    for (var i = 0; i < this.terms.length; i++) {
      var qp = this.terms[i];
      if (!qp.isValid())
        continue;
      var field = qp.getField();
      this._loadTablesForField(field);
    }
  },
  _loadTablesForField: function(fieldName) {
    if (!fieldName)
      return;
    var tableName = this.tableName.split(".")[0];
    var parts = fieldName.split(".");
    for (var i = 0; i < parts.length; i++) {
      var tableDef = loadFilterTableReference(tableName, this.isTemplate);
      if (!tableDef)
        return;
      var edef = tableDef.getElement(parts[i]);
      if (edef == null && tableDef.glide_var)
        edef = tableDef.getElement(parts[i] + "." + parts[++i]);
      if (edef == null)
        return;
      if (!edef.isReference())
        return;
      tableName = edef.getReference();
    }
  },
  addSortRow: function(field, oper) {
    if (this.sortSection == null)
      this.sortSection = new GlideSortSection(this);
    this.sortSection.addField(field, oper);
    this.addRunButton();
  },
  addConditionRowToFirstSection: function() {
    if (this.sections.length == 0)
      this.addSection();
    var section = this.sections[0];
    this.addConditionRow(section.getQueryID());
  },
  addConditionRow: function(queryID, field, oper, value, defaultField) {
    var section = null;
    if (queryID) {
      var i = findInArray(this.sections, queryID);
      if (i != null)
        section = this.sections[i];
    }
    if (!section)
      section = this.addSection();
    var condition = section.addCondition(true, field, oper, value);
    if (defaultField) {
      condition.actionRow.className += " modal_template_icon";
    }
    this.setSectionClasses();
    if (!condition)
      return null;
    this.currentCondition = condition;
    return condition.getRow();
  },
  addSection: function() {
    var section = new GlideFilterSection(this);
    queryID = section._setup(this.sortSection == null, this.sections.length == 0);
    this.sections[this.sections.length] = section;
    if (this.sortSection != null && this.sortElement == this.fDiv) {
      var sortRow = this.sortSection.getSection().getRow();
      this.fDiv.insertBefore(section.getRow(), sortRow);
    }
    this.addRunButton();
    this.setSectionClasses();
    return section;
  },
  removeSection: function(queryID) {
    if (this.sortSection) {
      if (this.sortSection.getID() == queryID) {
        clearNodes(this.sortSection.getSection().getRow());
        fDiv = this.fDiv;
        var e = $('gcond_sort_order');
        if (e)
          fDiv = e;
        fDiv.removeChild(this.sortSection.getSection().getRow());
        this.sortSection = null;
        this.addRunButton();
        return;
      }
    }
    var i = findInArray(this.sections, queryID);
    if (i == null)
      return;
    var section = this.sections[i];
    this.sections.splice(i, 1);
    clearNodes(section.getRow());
    this.fDiv.removeChild(section.getRow());
    if (i == 0) {
      if (this.sections.length > 0)
        this.sections[0].setFirst(this.sections.length);
      else {
        if (this.defaultPlaceHolder)
          this.addConditionRow();
      }
    }
    this.addRunButton();
    this.updateDBValue();
    this.setSectionClasses();
  },
  singleCondition: function() {
    if (this.sections.length > 1)
      return false;
    var section = this.sections[0];
    count = section.getConditionCount();
    return count == 1;
  },
  runFilter: function() {
    var filter = getFilter(this.tableName, true);
    if (runFilterHandlers[this.tableName]) {
      runFilterHandlers[this.tableName](this.tableName, filter);
      return;
    }
    var url = buildURL(this.tableName, filter);
    window.location = url;
  },
  getName: function() {
    return this.tableName;
  },
  getSortDiv: function() {
    return this.fDiv;
  },
  getDiv: function() {
    return this.fDiv;
  },
  getConditionsWanted: function() {
    return this.conditionsWanted;
  },
  getOpsWanted: function() {
    return this.opsWanted;
  },
  getTextAreasWanted: function() {
    return this.textAreasWanted;
  },
  isQueryProcessed: function() {
    return this.queryProcessed;
  },
  addRunButton: function() {
    if (!this.runable)
      return;
    var max = (this.sortSection == null) ? this.sections.length - 1 : this.sections.length;
    for (var i = 0; i < max; i++) {
      var section = this.sections[i];
      section.removeRunButton();
    }
    var section = this.sortSection;
    if (section == null)
      section = this.sections[this.sections.length - 1];
    section.addRunButton();
  },
  setReadOnly: function(disabled) {
    var parentElement = this.fDiv.parentNode;
    this._toggleReadOnlyAttribute(disabled);
    this._hideClass(parentElement, "filerTableAction", disabled);
    this._disableClass(parentElement, "filerTableSelect", disabled);
    this._disableClass(parentElement, "filerTableInput", disabled);
    this.setFilterReadOnly(disabled);
    this.disabledFilter = disabled;
  },
  _toggleReadOnlyAttribute: function(disabled) {
    var fieldName,
      element;
    if (this.fDiv && this.fDiv.id)
      fieldName = this.fDiv.id.replace('gcond_filters', '');
    if (fieldName)
      element = gel(fieldName);
    if (element)
      element.readOnly = disabled;
    return !!element;
  },
  isReadOnly: function() {
    return this.getFilterReadOnly();
  },
  _disableClass: function(parentElement, className, disabled) {
    var elements = $(parentElement).select("." + className);
    for (var i = 0; i < elements.length; i++) {
      g_form.setDisabledControl(elements[i], disabled);
    }
  },
  _hideClass: function(parentElement, className, hideIt) {
    var elements = $(parentElement).select("." + className);
    for (var i = 0; i < elements.length; i++) {
      if (hideIt)
        hideObject(elements[i]);
      else
        showObjectInline(elements[i]);
    }
    if (this.type == "GlideTemplateFilter") {
      if (hideIt && parentElement && parentElement.parentElement)
        parentElement.parentElement.removeChild(parentElement);
      else
        showObjectInline(parentElement);
    }
  },
  getValue: function() {
    return getFilter(this.tableName, false);
  },
  isDisabled: function() {
    return this.disabledFilter;
  },
  updateDBValue: function() {},
  type: "GlideFilter"
};
var GlideFilterSection = Class.create();
GlideFilterSection.prototype = {
  PLACE_HOLDER_FIELD: "-- choose field --",
  initialize: function(filter) {
    this.filter = filter;
    this.sort = false;
    this.queryID = null;
    this.tdMessage = null;
    this.runRow = null;
    this.conditions = [];
    var msg = NOW.msg;
    var values = MESSAGES_FILTER_MISC;
    this.answer = msg.getMessages(values);
  },
  destroy: function() {
    this.runRow = null;
    if (this.runCondition)
      this.runCondition.destroy();
    this.row.rowObject = null;
    this.row = null;
    this.table = null;
    this.tbody = null;
    for (var i = 0; i < this.conditions.length; i++)
      this.conditions[i].destroy();
  },
  _setup: function(link, first) {
    this.queryID = 'QUERYPART' + guid();
    this.row = cel('tr');
    this.row.queryID = this.queryID;
    this.row.queryPart = 'true';
    this.row.rowObject = this;
    var e = this.filter.getDiv() || getThing(this.filter.tableName, this.filter.divName);
    if (this.sort)
      e = this.filter.sortElement;
    e.appendChild(this.row);
    var td = cel('td', this.row);
    td.style.verticalAlign = "top";
    td.style.width = "100%";
    this.table = cel('table', td);
    $(this.table).addClassName('sn-filter-clause');
    if (!this.filter.getConditionsWanted() || this.sort)
      this.table.className = "wide";
    this.tbody = cel('TBODY', this.table);
    this.tbody.id = this.queryID;
    if (this.sort)
      this.addSortHeader();
    else
      this.addConditionHeader(first);
    return this.queryID;
  },
  addSortHeader: function() {
    var tr = '<tr class="sn-filter-order-message"><td class="sn-filter-top" >';
    tr += "<hr></hr><span style='padding: 10px'>" + this.answer['Order results by the following fields'] + "</span>";
    tr += "</td></tr>";
    $j(this.tbody).append(tr);
  },
  addConditionHeader: function(first) {
    this._addHRTR(first);
    this._addMessageTR(first);
  },
  _addHRTR: function(first) {
    var tr = $j('<tr><td class="sn-filter-top sn_multiple_conditions"><hr></hr><td></tr>');
    $j(this.tbody).append(tr);
    if (first)
      tr.hide();
  },
  _addMessageTR: function(first) {
    if (first)
      var m = getMessage("All of these conditions must be met");
    else
      m = getMessage("OR all of these conditions must be met");
    var tr = '<tr class="sn-filter-section-message"><td class="sn-filter-top">';
    tr += m;
    tr += "</td></tr>";
    this.sectionSepMessage = $j(tr);
    $j(this.tbody).append(this.sectionSepMessage);
  },
  setFirst: function(length) {
    this.sectionSepMessage.find("td").html(getMessage("All of these conditions must be met"));
  },
  addSortCondition: function() {
    var condition = new GlideSectionCondition(this, this.queryID);
    this.conditions[this.conditions.length] = condition;
    condition.setOrWanted(false);
    if (this.runRow == null)
      condition.build(this.tbody);
    else {
      condition.build(null);
      this.tbody.insertBefore(condition.getRow(), this.runRow);
    }
    return condition;
  },
  newPlaceHolder: function() {
    this.addPlaceHolder(true);
  },
  removePlaceHolder: function() {
    if (this.placeHolderCondition)
      this.placeHolderCondition.remove();
  },
  clearPlaceHolder: function() {
    if (!this.filter.getMaintainPlaceHolder())
      this.placeHolderCondition = null;
    else
      this.newPlaceHolder();
  },
  addPlaceHolder: function(wantOR) {
    this.placeHolderCondition = new GlideSectionCondition(this, this.queryID);
    this.conditions[this.conditions.length] = this.placeHolderCondition;
    this.placeHolderCondition.setPlaceHolder(true);
    this.placeHolderCondition.setOrWanted(true);
    if (this.runRow == null)
      this.placeHolderCondition.buildRow(this.tbody, this.PLACE_HOLDER_FIELD);
    else {
      this.placeHolderCondition.buildRow(null, this.PLACE_HOLDER_FIELD);
      this.tbody.insertBefore(this.placeHolderCondition.getRow(), this.runRow);
    }
  },
  addCondition: function(wantOR, field, oper, value) {
    if (this.filter.getMaintainPlaceHolder())
      return this.addConditionWithPlaceHolder(wantOR, field, oper, value);
    if (!field && !oper && !value) {
      this.newPlaceHolder();
      return null;
    }
    if (this.placeHolderCondition == null) {
      if (typeof field == "undefined" || field == '') {
        this.newPlaceHolder();
        return null;
      }
    }
    if (typeof field == "undefined")
      return null;
    var condition = new GlideSectionCondition(this, this.queryID);
    this.conditions[this.conditions.length] = condition;
    condition.setOrWanted(wantOR);
    if (this.runRow == null)
      condition.buildRow(this.tbody, field, oper, value);
    else {
      condition.buildRow(null, field, oper, value);
      this.tbody.insertBefore(condition.getRow(), this.runRow);
    }
    return condition;
  },
  addConditionWithPlaceHolder: function(wantOR, field, oper, value) {
    if (this.placeHolderCondition == null) {
      this.newPlaceHolder();
      if (typeof field == "undefined")
        return null;
    }
    if (typeof field == "undefined")
      return null;
    var condition = new GlideSectionCondition(this, this.queryID);
    this.conditions[this.conditions.length - 1] = condition;
    this.conditions[this.conditions.length] = this.placeHolderCondition;
    condition.setOrWanted(wantOR);
    condition.buildRow(null, field, oper, value);
    this.tbody.insertBefore(condition.getRow(), this.placeHolderCondition.getRow());
    return condition;
  },
  addRunButton: function() {
    if (this.runRow != null)
      return;
    this.runCondition = new GlideSectionCondition(this, this.queryID);
    this.runCondition.build(this.tbody);
    this.runRow = this.runCondition.getRow();
    this.runRow.basePart = '';
    this.runCondition.setAsRunRow(this.PLACE_HOLDER_FIELD);
  },
  removeRunButton: function() {
    if (this.runRow == null)
      return;
    this.tbody.removeChild(this.runRow);
    clearNodes(this.runRow);
    this.runRow = null;
  },
  getQueryID: function() {
    return this.queryID;
  },
  getID: function() {
    return this.queryID;
  },
  getRow: function() {
    return this.row;
  },
  getFilterTable: function() {
    return this.tbody;
  },
  setSort: function(b) {
    this.sort = b;
  },
  getName: function() {
    return this.filter.getName();
  },
  getFilter: function() {
    return this.filter;
  },
  getConditionCount: function() {
    return this.conditions.length;
  },
  firstCondition: function(condition) {
    return this.conditions[0] == condition;
  },
  removeCondition: function(id) {
    var i = findInArray(this.conditions, id);
    if (i == null)
      return;
    var condition = this.conditions[i];
    this.conditions.splice(i, 1);
    var row = condition.getRow();
    clearNodes(row);
    this.tbody.removeChild(row);
    if (condition == this.placeHolderCondition)
      this.placeHolderCondition = null;
    if ((this.placeHolderCondition != null && this.conditions.length == 1) || this.conditions.length == 0) {
      this.filter.removeSection(this.queryID);
    } else if (i == 0)
      this.conditions[0].makeFirst();
  },
  refreshSelectList: function() {
    for (var i = 0; i < this.conditions.length; i++)
      this.conditions[i].refreshSelectList();
  },
  z: null
};
var GlideSectionCondition = Class.create();
GlideSectionCondition.prototype = {
  initialize: function(section, queryID) {
    this.section = section;
    this.filter = section.getFilter();
    this.queryID = queryID;
    this.id = guid();
    this.wantOR = true;
    this.subConditions = new Array();
    this.field = null;
    this.oper = null;
    this.value = null;
  },
  destroy: function() {
    this.section = null;
    this.filter = null;
    this.row = null;
    this.tbody.conditionObject = null;
    this.tbody = null;
    this.conditionRow.destroy();
    this.actionRow = null;
    for (var i = 0; i < this.subConditions.length; i++)
      this.subConditions[i].destroy();
  },
  build: function(parent) {
    trNew = celQuery('tr', parent, this.queryID);
    this.row = trNew;
    trNew.className = "filter_row";
    trNew.basePart = 'true';
    trNew.conditionObject = this;
    trNew.setAttribute("mapping_support", this.filter.elementSupportsMapping);
    var td = celQuery('td', trNew, this.queryID);
    td.style.width = "100%";
    var table = celQuery('table', td, this.queryID);
    if (!this.filter.getConditionsWanted())
      table.className = "wide";
    this.tbody = celQuery('TBODY', table, this.queryID);
    this.tbody.conditionObject = this;
    var first = this.section.firstCondition(this) && !this.isPlaceHolder();
    this.conditionRow = new GlideConditionRow(this, this.queryID, this.wantOR, first);
    var tr = this.conditionRow.getRow();
    this.tbody.appendChild(tr);
    this.actionRow = tr;
    tr.conditionObject = this;
  },
  buildRow: function(parent, field, oper, value) {
    this.field = field;
    this.oper = oper;
    if (value)
      this.value = value.replace(/&amp;/g, '&');
    else
      this.value = value;
    this.build(parent);
    this.conditionRow.build(this.field, this.oper, this.value);
  },
  addNewSubCondition: function(field, oper, value) {
    if (field == null || typeof(field) == "undefined") {
      field = this.conditionRow.getField();
      oper = this.conditionRow.getOper();
    }
    var sub = new GlideSubCondition(this, this.queryID);
    sub.buildRow(this.tbody, field, oper, value);
    this.subConditions[this.subConditions.length] = sub;
    var $select = $j(sub.getFieldSelect());
    $select.css("margin-left", "10px").css("display", "inline-block").css("width", "inherit");
  },
  addLeftButtons: function() {
    this.conditionRow.addLeftButtons();
  },
  getRow: function() {
    return this.row;
  },
  getBody: function() {
    return this.tbody;
  },
  getActionRow: function() {
    return this.actionRow;
  },
  setAsRunRow: function() {
    this.conditionRow.setAsRunRow();
  },
  setOrWanted: function(b) {
    this.wantOR = b;
  },
  remove: function() {
    if (this.conditionRow)
      this.conditionRow.destroy();
    this.section.removeCondition(this.id);
    this.section.filter.setSectionClasses();
  },
  removeSub: function(id) {
    var i = findInArray(this.subConditions, id);
    if (i == null)
      return;
    var orc = this.subConditions[i];
    clearNodes(orc.getRow());
    this.tbody.removeChild(orc.getRow());
    this.subConditions.splice(i, 1);
  },
  getID: function() {
    return this.id;
  },
  getFilter: function() {
    return this.filter;
  },
  isFirst: function() {
    return this.section.firstCondition(this);
  },
  makeFirst: function() {
    this.conditionRow.makeFirst();
  },
  getName: function() {
    return this.section.getName();
  },
  setPlaceHolder: function(b) {
    this.placeHolder = b;
  },
  isPlaceHolder: function() {
    return this.placeHolder;
  },
  removePlaceHolder: function() {
    if (this.section)
      this.section.removePlaceHolder();
  },
  newPlaceHolder: function() {
    if (this.section)
      this.section.newPlaceHolder();
  },
  clearPlaceHolder: function() {
    if (this.section)
      this.section.clearPlaceHolder();
  },
  refreshSelectList: function() {
    if (this.conditionRow)
      this.conditionRow.refreshSelectList();
  },
  z: null
};
var GlideSubCondition = Class.create();
GlideSubCondition.prototype = {
  initialize: function(condition, queryID) {
    this.condition = condition;
    this.filter = condition.getFilter();
    this.queryID = queryID;
    this.id = guid();
  },
  destroy: function() {
    this.filter = null;
    this.condition = null;
    if (this.row)
      this.row.destroy();
  },
  buildRow: function(parent, field, oper, value) {
    this.field = field;
    this.oper = oper;
    if (value)
      this.value = value.replace(/&amp;/g, '&');
    else
      this.value = value;
    this.row = new GlideConditionRow(this.condition, queryID, false, false);
    var tr = this.row.getRow();
    parent.appendChild(tr);
    tr.conditionObject = this;
    this.row.build(field, oper, this.value)
  },
  getNameTD: function() {
    return this.row.getNameTD();
  },
  getFieldSelect: function() {
    return this.row.getFieldSelect();
  },
  getRow: function() {
    return this.row.getRow();
  },
  getID: function() {
    return this.id;
  },
  isPlaceHolder: function() {
    return this.condition.isPlaceHolder();
  },
  remove: function() {
    this.condition.removeSub(this.id);
  },
  z: null
};
var GlideConditionRow = Class.create();
GlideConditionRow.prototype = {
    initialize: function(condition, queryID, wantOr, first) {
      this.condition = condition;
      this.filter = condition.getFilter();
      this.first = first;
      this.wantOr = wantOr;
      this.tableName = this.condition.getName();
      this.queryID = queryID;
      this.currentText = [];
      var tr = celQuery('tr', null, queryID);
      tr.conditionObject = this.condition;
      tr.rowObject = this;
      tr.className = "filter_row_condition";
      tr.style.display = "table";
      this.row = tr;
      tr.conditionRow = this;
      this.addAndOrTextCell();
      td = this.addTD(tr, queryID);
      this.tdName = td;
      if (this.filter.listCollectorId)
        td.id = this.filter.listCollectorId + "_field";
      else
        td.id = "field";
      td.className += " condition-row__field-cell";
      tr.tdField = td;
      td = this.addTD(tr, queryID);
      this.tdOper = td;
      if (this.filter.listCollectorId)
        td.id = this.filter.listCollectorId + "_oper";
      else
        td.id = "oper";
      td.className += " condition-row__operator-cell";
      tr.tdOper = td;
      if (!this.filter.getOpsWanted())
        td.style.display = "none";
      td.style.width = "auto";
      td = this.addTD(tr, queryID);
      this.tdValue = td;
      if (this.filter.listCollectorId)
        td.id = this.filter.listCollectorId + "_value";
      else
        td.id = "value";
      td.noWrap = true;
      tr.tdValue = td;
      td.className += " form-inline condition-row__value-cell";
      if (this.filter.elementSupportsMapping) {
        this.addMappingTd(tr);
      }
      if (this.filter.getTextAreasWanted())
        td.style.width = "90%";
      this.addPlusImageCell();
      this.addRemoveButtonCell();
      this.answer = getMessages(MESSAGES_FILTER_BUTTONS);
    },
    destroy: function() {
      this.filter.clearFieldUsed(this.getField(), this.condition);
      this.filter = null;
      this.condition = null;
      this.rowCondition = null;
      if (this.row.handler)
        this.row.handler.destroy();
      this.row.tdOper = null;
      this.row.tdValue = null;
      this.row.tdField = null;
      this.row.conditionObject = null;
      this.row.rowObject = null;
      this.row = null;
      this.tdOper = null;
      this.tdValue = null;
      this.tdName = null;
      if (this.fieldSelect) {
        this.fieldSelect.onchange = null;
        this.fieldSelect = null;
      }
      this.tdOrButton = null;
      this.tdRemoveButton.conditionObject = null;
      this.tdRemoveButton = null;
      this.tdAndOrText = null;
    },
    setAsRunRow: function(field) {
      this.build(field);
      this.tdName.style.visibility = 'hidden';
      this.tdOper.style.visibility = 'hidden';
      this.tdAndOrText.style.visibility = 'hidden';
      this.row.removeChild(this.tdValue);
      this.row.removeChild(this.tdOrButton);
      this.row.removeChild(this.tdRemoveButton);
      clearNodes(this.tdValue);
      clearNodes(this.tdOrButton);
      clearNodes(this.tdRemoveButton);
      var td = celQuery('td', this.row, this.queryID);
      td.style.width = "100%";
      td.style.paddingBottom = "4px";
      td.filterObject = this.filter;
      var runCode = "runThisFilter(this);";
      if (this.filter.runCode)
        runCode = this.filter.runCode;
      td.innerHTML = this.buildRunButton(runCode);
    },
    addAndOrTextCell: function() {
      var td = this.addTD(this.row, this.queryID);
      td.className += " condition-row__and-or-text-cell";
      this.tdAndOrText = td;
      td.style.textAlign = "right";
      if (!this.filter.getConditionsWanted())
        td.style.display = "none";
    },
    addPlusImageCell: function() {
      var td = this.addTD(this.row, this.queryID);
      td.style.whiteSpace = "nowrap";
      td.className += " condition_buttons_cell";
      this.tdOrButton = td;
      this.row.tdOrButton = td;
      if (!this.filter.getConditionsWanted())
        td.style.display = "none";
    },
    addRemoveButtonCell: function() {
      var td = this.addTD(this.row, this.queryID);
      this.tdRemoveButton = td;
      this.row.tdRemoveButton = td;
      td.conditionObject = this.condition;
      td.className += " condition-row__remove-cell";
      if (this.wantOr)
        td.hasOrButton = 'true';
    },
    addTD: function(row, queryID) {
      var td = celQuery('td', row, queryID);
      $j(td).addClass("sn-filter-top");
      return td;
    },
    addMappingTd: function(tr) {
      var mappingTd = cel("td");
      mappingTd.className = "condition-row__sys-mapping-cell form-inline";
      tr.appendChild(mappingTd);
      tr.tdMapping = mappingTd;
    },
    build: function(field, oper, value) {
      this.field = field;
      this.oper = oper;
      this.value = value;
      var tableName = this.getName();
      var tds = this.row.getElementsByTagName("td");
      this.fieldSelect = _createFilterSelect();
      this.fieldSelect.onchange = this.fieldOnChange.bind(this);
      var sname = tableName.split(".")[0];
      if (this.field != null)
        sname = sname + "." + field;
      this.filter.setFieldUsed(field);
      addFirstLevelFields(this.fieldSelect, sname, field, this.filter.filterFields.bind(this.filter), null, this.filter, this.filter);
      if (!this.tdName) {
        return [];
      }
      this.tdName.appendChild(this.fieldSelect);
      updateFields(tableName, this.fieldSelect, oper, value, this.filter.getIncludeExtended(), this.filter);
      if (this.filter.isProtectedField(field))
        this._setReadOnly();
      if (this.filter.fieldName == "sys_template.template" || this.filter.isTemplate)
        this.addHelpText();
      currentTable = tableName;
      this.addLeftButtons();
      return tds;
    },
    _setReadOnly: function() {
      this.filter._hideClass(this.row, "filerTableAction", true);
      this.filter._disableClass(this.row, "filerTableSelect", true);
      this.filter._disableClass(this.row, "filerTableInput", true);
    },
    fieldOnChange: function() {
      this.filter.setFieldUsed(this.getField());
      this.filter.clearFieldUsed(this.field, this.condition);
      this.field = this.getField();
      var b = this.condition.isPlaceHolder();
      this.condition.setPlaceHolder(false);
      updateFields(this.getName(), this.fieldSelect, null, null, this.filter.getIncludeExtended(), this.filter);
      if (b) {
        this.condition.setPlaceHolder(false);
        this.showFields();
        this.condition.clearPlaceHolder();
        if (this.condition.isFirst())
          this.makeFirst();
      }
      this.filter.refreshSelectList();
      if (this.filter.fieldName == "sys_template.template" || this.filter.isTemplate)
        this.addHelpText();
      var form = this.getFieldSelect().up('form');
      if (form) {
        var nameWithoutTablePrefix = this.getName().substring(this.getName().indexOf(".") + 1);
        form.fire("glideform:onchange", {
          id: nameWithoutTablePrefix,
          value: unescape(getFilter(this.getName())),
          modified: true
        });
      }
    },
    addHelpText: function() {
      this.fieldElements = this.condition.actionRow.getAttribute("type");
      if (this.fieldElements) {
        switch (this.fieldElements) {
          case "color":
            this.helpText("Insert HTML color name or hex value");
            break;
          case "glide_list":
          case "slushbucket":
          case "user_roles":
            this.helpText("Separate individual references with a comma");
            break;
          case "composite_name":
            this.helpText("Use the following format: TableName.FieldName");
            break;
          case "days_of_week":
            this.helpText("1 for Monday, 2 for Tuesday, etc. Multiple values can be entered, like '135' for Monday, Wednesday, and Friday");
            break;
          case "html":
          case "translated_html":
            this.helpText("Enter text in HTML format");
            break;
          default:
            this.removeHelpText();
        }
      }
    },
    helpText: function(text) {
      this.removeHelpText();
      var newDiv = document.createElement("div");
      var newContent = document.createTextNode(text);
      newDiv.appendChild(newContent);
      newDiv.id = this.fieldElements;
      newDiv.className = 'fieldmsg';
      var currentDiv = this.condition.tbody;
      currentDiv.insertBefore(newDiv, null);
      this.currentText.push(this.fieldElements);
    },
    removeHelpText: function() {
      for (i = 0; i < this.currentText.length; i++) {
        var parNode = gel(this.currentText[i]).parentElement;
        var chilNode = parNode.childNodes;
        chilNode[1].remove();
        this.currentText.splice(i, 1);
      }
    },
    getNameTD: function() {
      return this.tdName;
    },
    getFieldSelect: function() {
      return this.fieldSelect;
    },
    getField: function() {
      var select = getSelectedOption(this.fieldSelect);
      if (select != null)
        return select.value;
      return null;
    },
    getOper: function() {
      var s = this.getOperSelect();
      return getSelectedOption(s).value;
    },
    getOperSelect: function() {
      return this.tdOper.getElementsByTagName("select")[0];
    },
    getValueInput: function() {
      return this.tdValue.getElementsByTagName("input")[0];
    },
    getRow: function() {
      return this.row;
    },
    getName: function() {
      return this.tableName;
    },
    showFields: function() {
        this.tdRemoveButton.style.visibility = 'visible';
        this.tdOrButton.styl