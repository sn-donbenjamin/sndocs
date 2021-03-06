/*! RESOURCE: /scripts/popups.js */
var popupCurrent = null;
var lastMouseX;
var lastMouseY;
if (window.opener && !window.opener.closed && window.opener != window.self) {
  Event.observe(window, 'beforeunload', function() {
    if (window.opener && !window.opener.closed && window.opener.popupCurrent && window.opener.popupCurrent == window.self)
      window.opener.popupCurrent = null;
  });
}

function popupClose() {
  if (!popupCurrent)
    return;
  try {
    if (!popupCurrent.closed)
      popupCurrent.close();
  } catch (e) {}
  popupCurrent = null;
}

function mousePositionSave(e) {
  if (navigator.appName.indexOf("Microsoft") != -1)
    e = window.event;
  lastMouseX = e.screenX;
  lastMouseY = e.screenY;
}

function imageListOpen(elementName, img_dirs, ignore, name) {
  var url = new GlideURL("image_picker.do");
  url.addParam("sysparm_element", elementName);
  url.addParam("sysparm_img_dirs", img_dirs);
  url.addParam("sysparm_ignore", ignore);
  url.addParam("sysparm_name", name || "");
  popupOpenStandard(url.getURL(), "imagepicker");
}

function imageBrowseOpen(elementName, directory, name, color, icon) {
  if (!color)
    color = "color-normal";
  var url = new GlideURL("icon_browse.do");
  url.addParam("sysparm_dir", directory);
  url.addParam("sysparm_name", name || "");
  url.addParam("sysparm_element", elementName);
  url.addParam("sysparm_color", color);
  url.addParam("sysparm_icon", icon);
  popupOpenStandard(url.getURL(), "imagepicker");
}
var g_IconBrowseHelpers = {
  getIconColor: function() {
    var spanElem = jQuery("span.bookmark_image");
    if (spanElem.length) {
      var color = jQuery.grep(spanElem.prop('class').split(" "), function(v) {
        return v.indexOf('color-') === 0;
      });
      return color.length ? color[0] : '';
    }
  },
  getIcon: function() {
    var spanElem = jQuery("span.bookmark_image");
    if (spanElem.length) {
      var fontIcon = jQuery.grep(spanElem.prop('class').split(" "), function(v) {
        return v.indexOf('icon-') === 0;
      });
      return fontIcon.length ? fontIcon[0] : '';
    }
  }
};

function imagePickedCustomEvent(options) {
  CustomEvent.fire('glide:image_picked', options);
}

function imageListPick(elementName, value) {
  var element = document.getElementById(elementName);
  if (element.nodeName == "IMG" || element.nodeName == "INPUT") {
    var imgel = document.getElementById("img." + elementName);
    element.value = value;
    if (element['onchange'])
      element.onchange();
    if (imgel != null) {
      if (value && value.length > 0)
        imgel.src = value;
      else
        imgel.src = "images/s.gifx";
    }
  } else {
    element.className = "";
    element.className = "image-browse-icon " + value;
  }
  popupClose();
  return false;
}

function reflistOpen(target, elementName, refTableName, dependent, useQBE, refQualElements, additionalQual, parentID, forceReference) {
  var url = reflistOpenUrl(target, target, elementName, refTableName, dependent, useQBE, refQualElements, additionalQual, parentID, forceReference);
  popupOpenStandard(url, "lookup");
}

function reflistOpenUrl(target, targetElementID, elementName, refTableName, dependent, useQBE, refQualElements, additionalQual, parentID, forceReference) {
  var url;
  if (useQBE == 'true')
    url = new GlideURL(refTableName + '_search.do');
  else
    url = new GlideURL(refTableName + '_list.do');
  url.addParam("sysparm_target", target);
  var et = gel(targetElementID);
  if (et)
    url.addParam("sysparm_target_value", et.value);
  var dspEl = gel("sys_display." + targetElementID);
  if (dspEl && !et.value)
    url.addParam("sysparm_reference_value", dspEl.value);
  url.addParam("sysparm_nameofstack", "reflist");
  url.addParam("sysparm_clear_stack", "true");
  url.addParam("sysparm_element", elementName);
  url.addParam("sysparm_reference", refTableName);
  url.addParam("sysparm_view", "sys_ref_list");
  url.addParam("sysparm_additional_qual", additionalQual);
  if (parentID != null && parentID != '')
    url.addParam("sysparm_parent_id", parentID);
  if (forceReference)
    url.addParam("sysparm_force_ref", "true");
  var v = getDependentValue(target, dependent);
  if (v != null)
    url.addParam("sysparm_dependent", v);
  var refQual = getRefQualURI(target, refQualElements);
  return url.getURL() + refQual;
}

function emailClientOpen(e, table, row, rows) {
  var query = e.getAttribute("query");
  var addOn = '&sysparm_record_row=' + row + '&sysparm_record_rows=' + rows + '&sysparm_record_list=' + encodeURIComponent(query);
  emailClientOpenPop(table, false, null, null, addOn);
}

function showPopupLiveFeedList(sysId, table) {
  var box = GlideBox.get('showLiveFeed');
  if (box)
    box.close(0);
  var iframe_src = 'show_live_feed.do?sysparm_stack=no&sysparm_sys_id=' + sysId + '&sysparm_table=' + table;
  box = new GlideBox({
    id: 'showLiveFeed',
    iframe: iframe_src,
    width: 600,
    height: "95%",
    title: "Live Feed",
    noTitle: true
  });
  box.render();
  var g_feedResizer;
  Event.observe(window, 'resize', function() {
    g_feedResizer = setTimeout(function() {
      box.autoPosition();
      box.autoDimension();
    }, 50);
  });
}

function emailClientOpenPop(table, immediate, replyType, replyID, addOn) {
  var id = document.getElementsByName("sys_uniqueValue")[0];
  if (!id)
    return;
  var url = new GlideURL("email_client.do");
  url.addParam("sysparm_table", table);
  url.addParam("sysparm_sys_id", id.value);
  url.addParam("sysparm_target", table);
  if (replyType != null) {
    url.addParam("replytype", replyType);
    url.addParam("replyid", replyID);
  }
  popupOpenEmailClient(url.getURL() + g_form.serializeChangedAll());
}

function reflistPick(elementName, value, display) {
  "use strict";
  var listName = "select_0" + elementName;
  var list = $(listName);
  if (list) {
    addGlideListChoice(listName, value, display, true);
    popupClose();
    return false;
  }
  if (gel("sys_display.LIST_EDIT_" + elementName))
    elementName = "LIST_EDIT_" + elementName;
  var element = $("sys_display." + elementName);
  if (element && element.onRefPick)
    element.onRefPick(element);
  if (element && element.ac && typeof(element.ac.referenceSelect) == "function") {
    element.ac.referenceSelectTimeout(value, display);
    popupClose();
    return;
  }
  var elementActual = $(elementName);
  elementActual.value = value;
  element = $("sys_display." + elementName);
  element.value = display;
  if (typeof(elementActual.onchange) == "function")
    elementActual.onchange();
  if (typeof(element.onchange) == "function")
    element.onchange();
  var eDep = element;
  var itemName = eDep.getAttribute("function");
  if (itemName != null) {
    eval(itemName);
  }
  element = document.getElementsByName("sys_select." + elementName)[0];
  if (element != null) {
    var options = element.options;
    var optionFound = false;
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      option.selected = false;
      var o = option.value;
      if (o == value) {
        option.selected = true;
        optionFound = true;
      }
    }
    if (!optionFound) {
      element.selectedIndex = -1;
      var opt = document.createElement("option");
      opt.value = value;
      opt.appendChild(document.createTextNode(display));
      opt.selected = true;
      element.appendChild(opt);
      var options = element.options;
      element.selectedIndex = options.length - 1;
      element.disabled = true;
      element.disabled = false;
    }
    element.onchange();
  } else {
    var fcs = "updateRelatedGivenNameAndValue('" + elementName + "','" + value + "');";
    setTimeout(fcs, 0);
  }
  popupClose();
  return false;
}

function picklistOpen(baseURL, width, modified, searchParam, target, dependent) {
  if (modified == '1')
    baseURL = baseURL + searchParam;
  baseURL += getDependent(target, dependent);
  popupOpenStandard(baseURL, "lookup");
}

function getDependent(target, dependent) {
  var value = getDependentValue(target, dependent);
  if (value == null)
    return "";
  return "&sysparm_dependent=" + encodeURIComponent(value);
}

function getDependentValue(target, dependent) {
  if (dependent == null)
    return null;
  var table = target.split('.')[0];
  var tfield = dependent.split(',')[0];
  var elname = table + '.' + tfield;
  if (tfield == 'sys_id') {
    tfield = 'sys_uniquevalue';
    elname = 'sys_uniquevalue';
  }
  var el = document.getElementsByName(elname)[0];
  if (el == null)
    return null;
  var selectValue = "";
  if (el.tagName == "INPUT")
    var selectValue = el.value;
  else
    selectValue = el.options[el.selectedIndex].value;
  return selectValue;
}

function getRefQualURI(target, refQualElements) {
  if (!refQualElements || typeof g_form == "undefined")
    return "";
  var aj = new GlideAjax("FormStateAjax");
  aj.addEncodedString(g_form.serialize());
  aj.getXMLWait();
  return "&sysparm_client_record=session";
}

function picklistPick(elementName, value) {
  var element = document.getElementsByName(elementName)[0];
  element.value = value;
  if (element["onchange"]) {
    element.onchange();
  }
  element.value = replaceRegEx