/*! RESOURCE: /scripts/app.$sp/directive.spTinymceEditor.js */
angular.module('sn.$sp').directive('spTinymceEditor', function(getTemplateUrl, snAttachmentHandler, $timeout) {
  return {
    templateUrl: getTemplateUrl('sp_tinymce_editor.xml'),
    restrict: 'E',
    replace: true,
    scope: {
      model: '=ngModel',
      field: '=?',
      options: '=ngModelOptions',
      snBlur: '&',
      snDisabled: '=?',
      getGlideForm: '&glideForm',
      ngChange: '&',
      attachmentGuid: '=?',
      recordTableName: '=?'
    },
    controller: function($scope, $element, $attrs) {
      $scope.options = $scope.options || {};
      var thisEditor = {};
      var g_form;
      var field;
      if (typeof $attrs.glideForm != "undefined") {
        g_form = $scope.getGlideForm();
      }
      if (typeof $attrs.field != "undefined") {
        field = $scope.field;
      }
      var langs = 'cs,de,en,es,fi,fr,he,it,ja,ko,nl,pl,pt,ru,zh,zt';
      var userLanguage = g_lang;
      if (!userLanguage || langs.indexOf(userLanguage) == -1)
        userLanguage = g_system_lang;
      if (!userLanguage || langs.indexOf(userLanguage) == -1)
        userLanguage = 'en';
      $scope.tinyMCEOptions = {
        skin: 'lightgray',
        theme: 'modern',
        menubar: false,
        language: userLanguage,
        statusbar: false,
        plugins: "codesample code paste",
        toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | codesample code',
        paste_data_images: true,
        setup: function(ed) {
          thisEditor = ed;
          ed.addCommand('imageUpload', function(ui, v) {
            $scope.clickAttachment();
          });
          ed.addButton('image', {
            icon: 'image',
            tooltip: 'Insert image',
            onclick: function(e) {
              ed.execCommand('imageUpload');
            },
            stateSelector: 'img:not([data-mce-object],[data-mce-placeholder])'
          });
          ed.on('blur', function() {
            if (angular.isDefined($scope.snBlur))
              $scope.snBlur();
          });
        },
        images_upload_handler: function(blobInfo, success, failure) {
          var blob = blobInfo.blob();
          var data = {};
          data.sysparm_table = null;
          data.sysparm_sys_id = null;
          if ($scope.getGlideForm()) {
            data.sysparm_table = $scope.getGlideForm().getTableName();
            data.sysparm_sys_id = $scope.getGlideForm().getSysId();
            if ($scope.getGlideForm().getSysId() == -1)
              data.sysparm_sys_id = $scope.attachmentGuid;
            if (data.sysparm_table === null) {
              data.sysparm_table = $scope.getGlideForm().recordTableName;
            }
          }
          if (data.sysparm_table === null && $scope.recordTableName) {
            data.sysparm_table = $scope.recordTableName;
          }
          if (data.sysparm_sys_id === null && $scope.attachmentGuid) {
            data.sysparm_sys_id = $scope.attachmentGuid;
          }
          if (data.sysparm_table && data.sysparm_sys_id) {
            snAttachmentHandler.create(data.sysparm_table, data.sysparm_sys_id).uploadAttachment(blob, null, {}).then(function(response) {
              success("/sys_attachment.do?sys_id=" + response.sys_id);
            })
          } else {
            console.log("GlideForm or table and record id is not provided");
          }
        }
      };
      $scope.attachFiles = function(data) {
        snAttachmentHandler.create("kb_social_qa_question", "-1").uploadAttachment(data.files[0], null, {}).then(function(response) {
          var args = tinymce.extend({}, {
            src: encodeURI("/" + response.sys_id + ".iix"),
            style: "max-width: 100%; max-height: 480px;"
          });
          thisEditor.execCommand('mceInsertContent', false, thisEditor.dom.createHTML('img', args), {
            skip_undo: 1
          });
        });
      };
      if (g_form && field) {
        g_form.$private.events.on('propertyChange', function(type, fieldName, propertyName) {
          if (fieldName != field.name)
            return;
          if (propertyName == "readonly" && typeof thisEditor.setMode == "function") {
            if (thisEditor.getContainer()) {
              var isReadOnly = g_form.isReadOnly(fieldName);
              thisEditor.setMode(isReadOnly ? 'readonly' : 'design');
              thisEditor.getDoc().body.style.backgroundColor = isReadOnly ? "#eeeeee" : "#fff";
            } else {
              thisEditor.on('init', function() {
                var isReadOnly = g_form.isReadOnly(fieldName);
                thisEditor.setMode(isReadOnly ? 'readonly' : 'design');
                thisEditor.getDoc().body.style.backgroundColor = isReadOnly ? "#eeeeee" : "#fff";
              });
            }
          }
        });
      } else if (typeof $attrs.snDisabled != "undefined") {
        $scope.$watch('snDisabled', function(newValue) {
          if (angular.isDefined(newValue) && typeof thisEditor.setMode == "function") {
            if (thisEditor.getContainer())
              thisEditor.setMode(newValue ? 'readonly' : 'design');
            else {
              thisEditor.on('init', function() {
                thisEditor.setMode(newValue ? 'readonly' : 'design');
              });
            }
          }
        });
      }
    },
    link: function(scope, element, attrs) {
      scope.attrs = attrs;
      scope.clickAttachment = function() {
        element.find("input").click();
      };
    }
  }
});