/*! RESOURCE: /scripts/slushbucket.js */
var slushbucketFieldsAdded = false;
if (typeof isMSIE6 === 'undefined')
  var isMSIE6 = false;

function moveSelectElement3(
  sourceSelect,
  targetSelect,
  sourceLabel,
  targetLabel,
  keepTarget) {
  if (sourceSelect.selectedIndex > -1) {
    for (i = 0; i < sourceSelect.length; ++i) {
      var selectedOption = sourceSelect.options[i];
      if (selectedOption.selected) {
        if (selectedOption.text != sourceLabel) {
          var newOption = new Option(selectedOption.text, selectedOption.value);
          if (targetSelect.options.length > 0 &&
            targetSelect.options[0].text == targetLabel) {
            targetSelect.options[0] = newOption;
            targetSelect.selectedIndex = 0;
          } else {
            targetSelect.options[targetSelect.options.length] = newOption;
            targetSelect.selectedIndex = targetSelect.options.length - 1;
          }
        } else {
          sourceSelect.selectedIndex = -1;
        }
      }
    }
    if (!keepTarget) {
      removeSelectElement3(sourceSelect, sourceLabel);
    }
  }
}

function moveOptionToSelected(
  sourceSelect,
  targetSelect,
  keepSourceLabel,
  unmovableSourceValues,
  keepTargetLabel) {
  moveOption(sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel, "to");
}
var SLUSHBUCKET_LABELED_PREFIX = ".labeled.";
var SLUSHBUCKET_LABELED_DISPLAY = "* ";

function moveOptionToSelectedLabeled(
  sourceSelect,
  targetSelect,
  keepSourceLabel,
  unmovableSourceValues,
  keepTargetLabel) {
  moveOption(sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel, "to", SLUSHBUCKET_LABELED_PREFIX);
}

function moveOptionFromSelected(
  sourceSelect,
  targetSelect,
  keepSourceLabel,
  unmovableSourceValues,
  keepTargetLabel) {
  moveOption(sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel, "from");
}

function moveCorrespondingOption(sourceSelect, targetSelect,
  correspondingSelect, correspondingTarget,
  keepSourceLabel,
  unmovableSourceValues,
  keepTargetLabel) {
  var selectedIds = moveOptionReturnIdArray(sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel);
  moveSelectedOptions(selectedIds, correspondingSelect, correspondingTarget, keepSourceLabel, unmovableSourceValues, keepTargetLabel);
}

function moveOption(
  sourceSelect,
  targetSelect,
  keepSourceLabel,
  unmovableSourceValues,
  keepTargetLabel,
  direction,
  property,
  sort) {
  moveOptionReturnIdArray(sourceSelect, targetSelect, keepSourceLabel,
    unmovableSourceValues, keepTargetLabel, direction, property, sort);
}

function moveOptionReturnIdArray(
  sourceSelect,
  targetSelect,
  keepSourceLabel,
  unmovableSourceValues,
  keepTargetLabel,
  direction,
  property,
  sort) {
  var sourceOptions = sourceSelect.options;
  var canMove;
  var option;
  var selectedIds = new Array();
  var index = 0;
  for (var i = 0; i < sourceOptions.length; i++) {
    option = sourceOptions[i];
    if (option.selected) {
      var optText = option.text;
      canMove = (option.text != keepSourceLabel);
      if (canMove && getHeaderAttr(option))
        canMove = false;
      if (canMove && getDoNotMove(option) == 'true')
        canMove = false;
      if (canMove && unmovableSourceValues != null) {
        for (var j = 0; j < unmovableSourceValues.length; j++) {
          if (unmovableSourceValues[j] == option.value) {
            canMove = false;
            break;
          }
        }
      }
      if (canMove) {
        selectedIds[index] = i;
        index++;
      } else {
        option.selected = false;
      }
    }
  }
  moveSelectedOptions(selectedIds, sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel,
    direction, property, sort);
  return selectedIds;
}

function moveSelectedOptions(selectedIds, sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel,
  direction, property, sort) {
  var targetSelectedIndex = targetSelect.selectedIndex;
  targetSelect.selectedIndex = -1;
  var sourceOptions = sourceSelect.options;
  var group = targetSelect.getElementsByTagName("optgroup");
  if (group != null && group.length > 1)
    group = document.getElementById('ac');
  else
    group = null;
  if (selectedIds.length > 0) {
    var targetOptions = targetSelect.options;
    for (var i = 0; i < selectedIds.length; i++) {
      var soption = sourceOptions[selectedIds[i]];
      if (group == null) {
        var label = getTrueLabel(soption);
        if (label === undefined || label == null)
          label = soption.text;
        var optionValue = soption.value;
        if (typeof property != "undefined" && property != null) {
          if (optionValue.substring(0, 1) != ".") {
            optionValue = property + optionValue;
            if (property == SLUSHBUCKET_LABELED_PREFIX)
              label = SLUSHBUCKET_LABELED_DISPLAY + label;
          }
        }
        if (direction == "from" && optionValue.startsWith(SLUSHBUCKET_LABELED_PREFIX)) {
          optionValue = optionValue.substring(SLUSHBUCKET_LABELED_PREFIX.length);
          label = label.substring(SLUSHBUCKET_LABELED_DISPLAY.length);
        }
        option =
          new Option(
            label,
            optionValue);
        option.cl = label;
        var title = getTitle(soption);
        option.title = title;
        if (option.value.indexOf("ref_") != -1)
          option.style.color = 'darkred';
        else
          option.style.color = soption.style.color;
        if (getCopyAttributes(soption)) {
          option = soption.cloneNode();
          option.text = label;
        } else if (getMultipleAllowed(soption)) {
          option.setAttribute("multipleAllowed", true);
        }
        if (getShowAnnotation(soption)) {
          option.setAttribute("showAnnotation", true);
          option.setAttribute("annotationText", "");
        }
        if (getShowChart(soption))
          option.setAttribute("showChart", true);
        var skipAdd = false;
        var ov = option.value;
        if ((direction != "to") || !getMultipleAllowed(soption)) {
          for (var ti = 0; ti < targetOptions.length; ti++) {
            var toption = targetOptions[ti];
            if (toption.value == ov || (ov.substr(0, 2) !== "u_" && (ov.indexOf(".annotation.") == 0 || ov.indexOf(".chart.") == 0))) {
              skipAdd = true;
              break;
            }
          }
        }
        if (skipAdd)
          continue;
        if (targetOptions.length == 1 && targetOptions[0].text == keepTargetLabel) {
          targetOptions[0] = option;
          targetOptions[0].setAttribute('selected', true);
        } else {
          var position = targetSelectedIndex >= 0 ? targetSelectedIndex + 1 : targetSelect.length;
          if (direction == 'from')
            position = targetSelect.length;
          if (sort)
            position = getInsertIndex(targetSelect, option);
          copySelectOptionToIndex(targetSelect, option, position);
          if (!isMSIE6)
            targetOptions[position].selected = true;
          else
            targetOptions[position].setAttribute("selected", true);
        }
      } else {
        var t = soption.value;
        var label = soption.text;
        if (sort)
          appendSelectOption(group, t, document.createTextNode(label), getInsertIndex(group, soption)).setAttribute('selected', true);
        else
          appendSelectOption(group, t, document.createTextNode(label)).setAttribute('selected', true);
      }
    }
  }
  removeSelectedOptions(selectedIds, sourceSelect, direction);
  if (sourceSelect.options.length == 0)
    addOption(sourceSelect, "", "--" + getMessage("None") + "--");
  if (selectedIds.length > 0)
    try {
      targetSelect.focus();
    } catch (e) {}
  if (targetSelect["onLocalMoveOptions"])
    targetSelect.onLocalMoveOptions();
  if (sourceSelect["onLocalMoveOptions"])
    sourceSelect.onLocalMoveOptions();
}

function removeSelectedOptions(selectedIds, sourceSelect, direction) {
  for (var i = selectedIds.length - 1; i > -1; i--) {
    var option = sourceSelect[selectedIds[i]];
    if (!getDoNotDelete(option) && (direction != "to" || !getMultipleAllowed(option))) {
      sourceSelect.remove(selectedIds[i]);
    }
  }
  if (sourceSelect["onchange"])
    sourceSelect.onchange();
  sourceSelect.disabled = true;
  sourceSelect.disabled = false;
}

function moveOptionAndSort(
  sourceSelect,
  targetSelect,
  keepSourceLabel,
  unmovableSourceValues,
  keepTargetLabel) {
  moveOption(sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues, keepTargetLabel, null, null, sortSupported(targetSelect));
}

function removeSelectElement3(sourceSelect, sourceLabel) {
  if (sourceSelect.selectedIndex > -1) {
    for (i = sourceSelect.length - 1; i > -1; i--) {
      if (sourceSelect.options[i].selected)
        sourceSelect.options[i] = null;
    }
    if (sourceSelect.length == 0)
      addOption(sourceSelect, "", sourceLabel);
  }
}

function removeSection(sourceSelect) {
  var option = getSingleSelectedOption(sourceSelect);
  if (option) {
    var gajax = new GlideAjax("RemoveFormSectionAjax");
    gajax.addParam("sysparm_value", option.value);
    gajax.getXML();
  }
}

function moveUp(sourceSelect) {
  if (sourceSelect.length > 1) {
    var options = sourceSelect.options;
    var selectedIds = new Array();
    var index = 0;
    for (var i = 1; i < sourceSelect.length; i++) {
      if (options[i].selected) {
        selectedIds[index] = i;
        index++;
      }
    }
    var selId;
    for (var i = 0; i < selectedIds.length; i++) {
      selId = selectedIds[i];
      privateMoveUp(options, selId);
      options[selId].selected = false;
      options[selId - 1].selected = true;
    }
    sourceSelect.focus();
    if (sourceSelect["onLocalMoveUp"])
      sourceSelect.onLocalMoveUp();

    function resetFields() {
      sourceSelect.removeAttribute("multiple");
      setTimeout(function() {
        sourceSelect.setAttribute("multiple", "multiple");
        $(sourceSelect).stopObserving('click', resetFields);
      });
    }
    if (isMSIE8 || isMSIE9 || isMSIE10 || isMSIE11)
      $(sourceSelect).observe('click', resetFields);
  }
}

function moveDown(sourceSelect) {
  if (sourceSelect.length > 1) {
    var options = sourceSelect.options;
    var selectedIds = new Array();
    var index = 0;
    for (var i = sourceSelect.length - 2; i >= 0; i--) {
      if (sourceSelect.options[i].selected) {
        selectedIds[index] = i;
        index++;
      }
    }
    var selId;
    for (var i = 0; i < selectedIds.length; i++) {
      selId = selectedIds[i];
      privateMoveDown(options, selId);
      options[selId].selected = false;
      options[selId + 1].selected = true;
    }
    sourceSelect.focus();
    if (sourceSelect["onLocalMoveDown"])
      sourceSelect.onLocalMoveDown();

    function resetFields() {
      sourceSelect.removeAttribute("multiple");
      setTimeout(function() {
        sourceSelect.setAttribute("multiple", "multiple");
        $(sourceSelect).stopObserving('click', resetFields);
      });
    }
    if (isMSIE8 || isMSIE9 || isMSIE10 || isMSIE11)
      $(sourceSelect).observe('click', resetFields);
  }
}

function moveTop(sourceSelect) {
  var selIndex = sourceSelect.selectedIndex;
  if (sourceSelect.length > 1 && selIndex > 0) {
    var options = sourceSelect.options;
    for (var i = selIndex; i > 0; i--) {
      privateMoveUp(options, i);
    }
    sourceSelect.focus();
    sourceSelect.selectedIndex = 0;
    if (sourceSelect["onLocalMoveTop"])
      sourceSelect.onLocalMoveTop();
  }
}

function moveBottom(sourceSelect) {
  var selIndex = sourceSelect.selectedIndex;
  if (sourceSelect.length > 1 && selIndex > -1 && selIndex < sourceSelect.length - 1) {
    var options = sourceSelect.options;
    for (var i = selIndex; i < sourceSelect.length - 1; i++) {
      privateMoveDown(options, i);
    }
    sourceSelect.focus();
    sourceSelect.selectedIndex = sourceSelect.length - 1;
    if (sourceSelect["onLocalMoveBottom"])
      sourceSelect.onLocalMoveBottom();
  }
}

function copyOption(sourceSelect, targetSelect,
  keepSourceLabel, unmovableSourceValues,
  keepTargetLabel) {
  var sourceOptions = sourceSelect.options;
  var canMove;
  var option;
  var selectedIds = new Array();
  var index = 0;
  for (var i = 0; i < sourceSelect.length; i++) {
    option = sourceOptions[i];
    if (option.selected) {
      canMove = (option.text != keepSourceLabel);
      if (canMove && unmovableSourceValues != null) {
        for (var j = 0; j < unmovableSourceValues.length; j++) {
          if (unmovableSourceValues[j] == option.value) {
            canMove = false;
            break;
          }
        }
      }
      if (canMove) {
        selectedIds[index] = i;
        index++;
      } else {
        option.selected = false;
      }
    }
  }
  var targetOptions = targetSelect.options;
  if (selectedIds.length > 0) {
    targetSelect.selectedIndex = -1;
    for (var i = 0; i < selectedIds.length; i++) {
      option = new Option(sourceOptions[selectedIds[i]].text, sourceOptions[selectedIds[i]].value);
      if (targetOptions.length == 1 && targetOptions[0].text == keepTargetLabel) {
        targetOptions[0] = option;
        targetOptions[0].selected = true;
      } else {
        targetOptions[targetOptions.length] = option;
        targetOptions[targetOptions.length - 1].selected = true;
      }
    }
  }
  if (targetSelect["onchange"]) {
    targetSelect.onchange();
  }
  if (sourceSelect["onchange"]) {
    sourceSelect.onchange();
  }
}

function removeOption(sourceSelect, targetSelect,
  keepSourceLabel, unmovableSourceValues,
  keepTargetLabel) {
  var sourceOptions = sourceSelect.options;
  var canMove;
  var option;
  var selectedIds = new Array();
  var index = 0;
  for (var i = 0; i < sourceSelect.length; i++) {
    option = sourceOptions[i];
    if (option.selected) {
      canMove = (option.text != keepSourceLabel);
      if (canMove && unmovableSourceValues != null) {
        for (var j = 0; j < unmovableSourceValues.length; j++) {
          if (unmovableSourceValues[j] == option.value) {
            canMove = false;
            break;
          }
        }
      }
      if (canMove) {
        selectedIds[index] = i;
        index++;
      } else {
        option.selected = false;
      }
    }
  }
  for (var i = selectedIds.length - 1; i > -1; i--) {
    var option = sourceSelect[selectedIds[i]];
    if (!getDoNotDelete(option))
      sourceSelect.remove(selectedIds[i]);
  }
  sourceSelect.disabled = true;
  sourceSelect.disabled = false;
  if (sourceOptions.length == 0)
    addOption(sourceOptions, "", keepSourceLabel);
}

function privateMoveUp(options, index) {
  privateSwapOptions(options[index - 1], options[index]);
}

function privateMoveDown(options, index) {
  privateSwapOptions(options[index], options[index + 1]);
}

function privateSwapOptions(option1, option2) {
  var newOption = new Option(option1.text, option1.value);
  newOption.cl = getTrueLabel(option1);
  newOption.cv = getCV(option1);
  newOption.multipleAllowed = getMultipleAllowed(option1);
  newOption.showAnnotation = getShowAnnotation(option1);
  newOption.annotationText = getAnnotationText(option1);
  newOption.annotationIsPlainText = getAnnotationTextType(option1);
  newOption.annotationType = getAnnotationType(option1);
  newOption.annotationID = getAnnotationID(option1);
  newOption.showChart = getShowChart(option1);
  newOption.chartID = getChartID(option1);
  newOption.chartLabel = getChartLabel(option1);
  newOption.style.color = option1.style.color;
  newOption.doNotMove = getDoNotMove(option1);
  newOption.title = getTitle(option1);
  newOption.dataScopeID = getDataScopeID(option1);
  newOption.dataScopeName = getDataScopeName(option1);
  newOption.dataScopeLabel = getDataScopeLabel(option1);
  newOption.dataScopeConfigurable = getDataScopeConfigurable(option1);
  newOption.dataParentId = getDataParentId(option1);
  option1.text = option2.text;
  option1.value = option2.value;
  option1.setAttribute("doNotMove", getDoNotMove(option2));
  option1.cl = getTrueLabel(option2);
  option1.cv = getCV(option2);
  option1.setAttribute("cl", getTrueLabel(option2));
  option1.setAttribute("cv", getCV(option2));
  option1.setAttribute("title", getTitle(option2));
  option1.multipleAllowed = getMultipleAllowed(option2);
  option1.showAnnotation = getShowAnnotation(option2);
  option1.annotationText = getAnnotationText(option2);
  option1.annotationIsPlainText = getAnnotationTextType(option2);
  option1.annotationType = getAnnotationType(option2);
  option1.annotationID = getAnnotationID(option2);
  option1.showChart = getShowChart(option2);
  option1.chartID = getChartID(option2);
  option1.chartLabel = getChartLabel(option2);
  option1.dataScopeID = getDataScopeID(option2);
  option1.dataScopeName = getDataScopeName(option2);
  option1.dataScopeLabel = getDataScopeLabel(option2);
  option1.dataScopeConfigurable = getDataScopeConfigurable(option2);
  option1.dataParentId = getDataParentId(option2);
  option1.setAttribute("multipleallowed", getMultipleAllowed(option2));
  option1.setAttribute("showannotation", getShowAnnotation(option2));
  option1.setAttribute("annotationtext", getAnnotationText(option2));
  option1.setAttribute("annotationisplaintext", getAnnotationTextType(option2));
  option1.setAttribute("annotationtype", getAnnotationType(option2));
  option1.setAttribute("annotationid", getAnnotationID(option2));
  option1.setAttribute("showchart", getShowChart(option2));
  option1.setAttribute("chartlabel", getChartLabel(option2));
  option1.setAttribute("chartid", getChartID(option2));
  option1.setAttribute("data-scope_id", getDataScopeID(option2));
  option1.setAttribute("data-scope_name", getDataScopeName(option2));
  option1.setAttribute("data-scope_label", getDataScopeLabel(option2));
  option1.setAttribute("data-scope_configurable", getDataScopeConfigurable(option2));
  option1.setAttribute("data-parent_id", getDataParentId(option2));
  option1.style.color = option2.style.color;
  option2.text = newOption.text;
  option2.value = newOption.value;
  option2.style.color = newOption.style.color;
  option2.setAttribute("doNotMove", getDoNotMove(newOption));
  option2.cl = getTrueLabel(newOption);
  option2.setAttribute("cl", getTrueLabel(newOption));
  option2.cv = getCV(newOption);
  option2.setAttribute("cv", getCV(newOption));
  option2.setAttribute("title", getTitle(newOption));
  option2.multipleAllowed = getMultipleAllowed(newOption);
  option2.showAnnotation = getShowAnnotation(newOption);
  option2.annotationText = getAnnotationText(newOption);
  option2.annotationIsPlainText = getAnnotationTextType(newOption);
  option2.annotationType = getAnnotationType(newOption);
  option2.annotationID = getAnnotationID(newOption);
  option2.showChart = getShowChart(newOption);
  option2.chartID = getChartID(newOption);
  option2.chartLabel = getChartLabel(newOption);
  option2.dataScopeID = getDataScopeID(newOption);
  option2.dataScopeName = getDataScopeName(newOption);
  option2.dataScopeLabel = getDataScopeLabel(newOption);
  option2.dataScopeConfigurable = getDataScopeConfigurable(newOption);
  option2.dataParentId = getDataParentId(newOption);
  option2.setAttribute("multipleallowed", getMultipleAllowed(newOption));
  option2.setAttribute("showannotation", getShowAnnotation(newOption));
  option2.setAttribute("annotationtext", getAnnotationText(newOption));
  option2.setAttribute("annotationisplaintext", getAnnotationTextType(newOption));
  option2.setAttribute("annotationtype", getAnnotationType(newOption));
  option2.setAttribute("annotationid", getAnnotationID(newOption));
  option2.setAttribute("showchart", getShowChart(newOption));
  option2.setAttribute("chartlabel", getChartLabel(newOption));
  option2.setAttribute("chartid", getChartID(newOption));
  option2.setAttribute("data-scope_id", getDataScopeID(newOption));
  option2.setAttribute("data-scope_name", getDataScopeName(newOption));
  option2.setAttribute("data-scope_label", getDataScopeLabel(newOption));
  option2.setAttribute("data-scope_configurable", getDataScopeConfigurable(newOption));
  option2.setAttribute("data-parent_id", getDataParentId(newOption));
}

function saveAllActuallySelected(fromSelectArray, toArray, delim, escape, emptyLabel, doEscape) {
  var i, j, escapedValue;
  var translatedEmptyLabel = getMessage(emptyLabel);
  for (i = 0; i < fromSelectArray.length; i++) {
    toArray[i].value = '';
    var count = 0;
    for (j = 0; j < fromSelectArray[i].length; j++) {
      var option = fromSelectArray[i].options[j];
      if (!option.selected)
        continue;
      if (!(fromSelectArray[i].length == 1 && fromSelectArray[i].options[0].value == translatedEmptyLabel)) {
        var val = fromSelectArray[i].options[j].value;
        if (doEscape) {
          val = encodeURIComponent(val);
        }
        val = val.replace(new RegExp(escape + escape, "g"), escape + escape);
        if (count != 0) {
          toArray[i].value += delim;
        }
        count = count + 1;
        toArray[i].value += val.replace(new RegExp(delim, "g"), escape + delim);
      }
    }
  }
}

function clearAllSelected(fromSelectArray) {
  var i, j, escapedValue;
  for (i = 0; i < fromSelectArray.length; i++) {
    var count = 0;
    for (j = 0; j < fromSelectArray[i].length; j++) {
      var option = fromSelectArray[i].options[j];
      option.selected = false;
    }
  }
}

function addNewField(selectBox, formElement) {
  var title = formElement.newOption.value;
  title = trim(title);
  formElement.newOption.value = "";
  if (title == '')
    return;
  var type = formElement.newType.value;
  var refTable = formElement.refTable.value;
  var length = formElement.lengthSelect.value;
  var fieldName = title;
  var fnid = formElement.fieldName;
  if (fnid != null) {
    fieldName = fnid.value;
    if (fieldName == '')
      fieldName = title;
    fnid.value = "";
  }
  var opt = document.createElement("option");
  var safetitle = makeitsafe(title);
  fieldName = makeitsafe(fieldName);
  opt.value = encodeURIComponent("TBD-" + type + "-" + length + "-" + safetitle + "-" + refTable + "-" + fieldName);
  opt.text = title;
  selectBox.options.add(opt);
  slushbucketFieldsAdded = true;
}

function makeitsafe(title) {
  title = title.replace(/&/g, "");
  title = title.replace(/</g, "");
  title = title.replace(/>/g, "");
  title = title.replace(/\"/g, "");
  var safetitle = title.replace(/-/g, "!DASH!");
  return safetitle;
}

function addChoiceKeyPress(event, input, selectBox, selectTable) {
  if (event.keyCode != 13)
    return true;
  addChoiceOption(selectBox, input, selectTable);
  return false;
}

function ignoreEnter(event) {
  if (event.keyCode != 13)
    return true;
  return false;
}

function addNumericChoiceKeyPress(event, formElement, selectBox) {
  if (event.keyCode != 13)
    return true;
  addNumericChoiceOption(selectBox, formElement);
  return false;
}

function addChoiceOption(selectBox, input, selectTable) {
  var title = input.value;
  input.value = "";
  var opt = document.createElement("option");
  opt.value = "TBD-" + title;
  opt.text = title;
  addTargetedChoice(selectBox, opt, selectTable);
}

function addChoice(selectBox, formElement, selectTable) {
  var input = formElement.newOption;
  var title = input.value;
  input.value = "";
  var opt = document.createElement("option");
  opt.value = "TBD-" + title;
  opt.text = title;
  addTargetedChoice(selectBox, opt, selectTable);
}

function addNumericChoice(selectBox, formElement, selectTable) {
  var input = formElement.newOption.value;
  formElement.newOption.value = '';
  var number = formElement.newOptionValue.value;
  formElement.newOptionValue.value = '';
  var opt = document.createElement("option");
  opt.value = "TBD-" + input + "-TBDVALUE-" + number;
  opt.text = input;
  addTargetedChoice(selectBox, opt, selectTable);
}

function addTargetedChoice(selectBox, opt, selectTable) {
  if (selectTable != null && selectTable.selectedIndex > -1) {
    opt.value += "-TBDTARGET-" + selectTable.options[selectTable.selectedIndex].value;
  }
  selectBox.options.add(opt);
}

function addChoiceFromInput(selectBox, inputElement) {
  var title;
  if (inputElement.tagName == 'SELECT') {
    title = inputElement.options[inputElement.selectedIndex].value;
    inputElement.selectedIndex = 0;
  } else {
    title = inputElement.value;
    inputElement.value = '';
  }
  var opt = document.createElement("option");
  opt.value = title;
  opt.text = title;
  selectBox.options.add(opt);
}

function addChoiceFromValue(selectBox, title) {
  var opt = document.createElement("option");
  opt.value = title;
  opt.text = title;
  selectBox.options.add(opt);
}

function addChoiceFromValueAndDisplay(selectBox, value, title) {
  var opt = document.createElement("option");
  opt.value = value;
  opt.text = title;
  selectBox.options.add(opt);
}

function removeUsedSlush(avail, used, mainID) {
  var itemCnt = avail.options.length;
  for (var ib = 0; ib < itemCnt; ib++) {
    if (sortSupported(used))
      var exists = itemExistsInSorted(used, avail.options[ib]);
    else
      var exists = itemExists(used, avail.options[ib].value);
    if (exists || avail.options[ib].value == mainID) {
      avail.options[ib] = null;
      itemCnt--;
      ib--;
    }
  }
}

function itemExistsInSorted(sel, option) {
  return _bsearchOptions(sel, option, false);
}

function getInsertIndex(sel, option) {
  if (sel.length == 0)
    return 0;
  return _bsearchOptions(sel, option, true);
}

function _bsearchOptions(sel, option, returnIndex) {
  if (!sel)
    return false;
  if (!option)
    return false;
  var max = sel.length - 1;
  var min = 0;
  var i = Math.floor(max / 2);
  while (max >= min) {
    if (sel.options[i].text == option.text &&
      sel.options[i].value == option.value) {
      if (returnIndex)
        return i + 1;
      else
        return true;
    }
    if (sel.options[i].text.toLowerCase() < option.text.toLowerCase())
      min = i + 1;
    else
      max = i - 1;
    i = Math.floor((max - min) / 2) + min;
  };
  if (returnIndex)
    return i + 1;
  return false;
}

function itemExists(sel, value) {
  if (!sel || !value)
    return false;
  for (var i = 0; i < sel.options.length; i++) {
    if (sel.options[i].value == value)
      return true;
  }
  return false;
}

function slushChanged(avail, used, mainID) {
  removeUsedSlush(avail, used, mainID);
  populateIfEmpty(avail);
  populateIfEmpty(used);
}

function slushLoaded(fA, fB) {
  populateIfEmpty(fA);
  populateIfEmpty(fB);
}

function populateIfEmpty(sbox) {
  if (sbox.options && sbox.options.length == 0)
    addOption(sbox, "", "--" + getMessage("None") + "--")
}

function getColumns(select) {
  var sourceOptions = select.options;
  var index = 0;
  var selectedIndex = -1;
  for (var i = 0; i < select.length; i++) {
    option = sourceOptions[i];
    if (option.selected) {
      selectedIndex = i;
      index++;
      if (index > 1)
        break;
    }
  }
  if (index == 1) {
    var option = sourceOptions[selectedIndex];
    var colName = option.value;
    var colLabel = getTrueLabel(option);
    var tableName = getTablenameFromOption(option);
    if (tableName === undefined || tableName == null || tableName == '')
      tableName = "";
    if (tableName.length > 0) {
      var bt = getBaseTable(option);
      var btl = getBaseTableLabel(option);
      var tableLabel = getTablelabelFromOption(option);
      var tableParent = getParentTable(option)
      var tableDef = Table.get(tableName, tableParent);
      var ext = getHeaderAttr(option);
      processColumns(tableDef, new Array(colName, colLabel, tableName, tableLabel, bt, btl, 'replace', ext));
    }
  }
}

function refreshAvailable() {
  var button = document.getElementById('expand_x0');
  if (button) {
    button.style.display = "none";
  }
  button = document.getElementById('expand_x0s');
  if (button) {
    button.style.display = "block";
  }
  var select = document.getElementById('select_0');
  var tableName = select.getAttribute("gsft_basetable");
  if (tableName.length > 0) {
    var tableDef = Table.get(tableName, tableName);
    var tableLabel = tableDef.getLabel();
    processColumns(tableDef, new Array(tableName, tableLabel + " fields", tableName, tableLabel, tableName, tableLabel, 'append', true));
  }
}

function expandFile(select, prefix) {
  if (!prefix)
    prefix = "";
  var button = document.getElementById(prefix + 'expand_x0');
  if (button) {
    button.style.display = "none";
  }
  button = document.getElementById(prefix + 'expand_x0s');
  if (button) {
    button.style.display = "block";
  }
  var select = document.getElementById(prefix + 'select_0');
  var option = getSingleSelectedOption(select);
  if (option != null) {
    var colName = option.value;
    var colLabel = getTrueLabel(option);
    var tableName = getTablenameFromOption(option);
    var tableLabel = getTablelabelFromOption(option);
    var bt = getBaseTable(option);
    var btl = getBaseTableLabel(option);
    var ext = getHeaderAttr(option);
    var listItemId = gel(prefix + 'sc_list_item_id');
    if (isVariables(colName) && tableName == 'item_option_new' && listItemId) {
      reflistOpen(listItemId.id, 'cat_item', 'sc_cat_item');
      return;
    }
    if (tableName.length > 0) {
      var tableParent = getParentTable(option);
      var tableDef = Table.get(tableName, tableParent);
      processColumns(tableDef, new Array(colName, colLabel, tableName, tableLabel, bt, btl, 'append', ext, prefix));
    }
  }
}

function isVariables(colName) {
  return colName && (colName == 'variables' || colName.endsWith('.variables'));
}

function getScItemVariables(request) {
  var scItemVariables = [];
  if (request.responseXML.documentElement) {
    var items = request.responseXML.getElementsByTagName("item");
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      scItemVariables.push({
        variableId: 'variables.' + item.getAttribute('variable_id'),
        questionText: item.getAttribute('question_text')
      });
    }
  }
  return scItemVariables;
}

function appendHeaderOption(select, baseTable, baseTableLabel, label) {
  appendOption(select, baseTable, label);
  var addedOption = select.options[select.options.length - 1];
  addedOption.style.color = 'blue';
  addedOption.reference = baseTable;
  addedOption.tl = baseTableLabel;
  addedOption.cl = baseTableLabel + " fields";
  addedOption.btl = baseTableLabel;
  addedOption.bt = baseTable;
  addedOption.cv = '';
  addedOption.headerAttr = 'true';
}

function appendOption(select, baseTable, label) {
  appendSelectOption(select, baseTable, document.createTextNode(label));
  return select.options[select.options.length - 1];
}

function appendVariableOption(select, baseTable, label, scItemLabel) {
  var addedOption = appendOption(select, baseTable, label);
  addedOption.innerHTML = "&nbsp;&nbsp;&nbsp;" + addedOption.innerHTML;
  addedOption.cl = label;
}

function processVariables(prefix) {
  if (!prefix)
    prefix = '';
  var scItemId = $(prefix + 'sc_list_item_id').value;
  if (scItemId) {
    var glideAjax = new GlideAjax("ServiceCatalogVariables");
    glideAjax.addParam("sysparm_type", "get_sc_item_variables");
    glideAjax.addParam("sysparm_sc_item_id", scItemId);
    glideAjax.getXML(setVariableOptions, null, [prefix, scItemId]);
  }
}

function setVariableOptions(request, args) {
  var prefix = args[0];
  var scItemId = args[1];
  var scItemLabel = $('sys_display.' + prefix + 'sc_list_item_id').value;
  var select = $(prefix + 'select_0');
  var option = getSingleSelectedOption(select);
  var baseTable = getBaseTable(option);
  var baseTableLabel = getBaseTableLabel(option);
  select.options.length = 0;
  appendHeaderOption(select, baseTable, baseTableLabel, baseTableLabel + " fields");
  appendHeaderOption(select, baseTable, baseTableLabel, ".Variables-->" + scItemLabel);
  var variables = getScItemVariables(request);
  var selectedOptions = document.getElementById(prefix + 'select_1').options;
  for (var i = 0; i < variables.length; i++) {
    var variableId = variables[i].variableId;
    var questionText = variables[i].questionText;
    if (isNotInSelectedOptions(variableId, selectedOptions))
      appendVariableOption(select, variableId, questionText, scItemLabel);
  }
  return true;
}

function isNotInSelectedOptions(variableId, selectedOptions) {
  for (var i = 0; i < selectedOptions.length; i++) {
    if (variableId == selectedOptions[i].value)
      return false;
  }
  return true;
}

function showExpandFile(select, prefix) {
  if (!prefix)
    prefix = "";
  var select = document.getElementById(prefix + 'select_0');
  var option = getSingleSelectedOption(select);
  if (option != null) {
    if (option.value == "ext_separator") {
      setPreference("show_extended_fields", "false");
      showExtFields = "false";
      setSingleSelectOption(select.options