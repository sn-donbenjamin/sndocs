/*! RESOURCE: /scripts/app.ng_chat/conversation/js_includes_connect_conversation.js */
/*! RESOURCE: /scripts/sn/common/ui/popover/js_includes_ui_popover.js */
/*! RESOURCE: /scripts/sn/common/ui/popover/_module.js */
angular.module('sn.common.ui.popover', []);;
/*! RESOURCE: /scripts/sn/common/ui/popover/directive.snBindPopoverSelection.js */
angular.module('sn.common.ui.popover').directive('snBindPopoverSelection', function(snCustomEvent) {
  "use strict";
  return {
    restrict: "A",
    controller: function($scope, $element, $attrs, snCustomEvent) {
      snCustomEvent.observe('list.record_select', recordSelectDataHandler);

      function recordSelectDataHandler(data, event) {
        if (!data || !event)
          return;
        event.stopPropagation();
        var ref = ($scope.field) ? $scope.field.ref : $attrs.ref;
        if (data.ref === ref) {
          if (window.g_form) {
            if ($attrs.addOption) {
              addGlideListChoice('select_0' + $attrs.ref, data.value, data.displayValue);
            } else {
              var fieldValue = typeof $attrs.ref === 'undefined' ? data.ref : $attrs.ref;
              window.g_form._setValue(fieldValue, data.value, data.displayValue);
              clearDerivedFields(data.value);
            }
          }
          if ($scope.field) {
            $scope.field.value = data.value;
            $scope.field.displayValue = data.displayValue;
          }
        }
      }

      function clearDerivedFields(value) {
        if (window.DerivedFields) {
          var df = new DerivedFields($scope.field ? $scope.field.ref : $attrs.ref);
          df.clearRelated();
          df.updateRelated(value);
        }
      }
    }
  };
});;
/*! RESOURCE: /scripts/sn/common/ui/popover/directive.snComplexPopover.js */
angular.module('sn.common.ui.popover').directive('snComplexPopover', function(getTemplateUrl, $q, $http, $templateCache, $compile, $timeout) {
  "use strict";
  return {
    restrict: 'E',
    replace: true,
    templateUrl: function(elem, attrs) {
      return getTemplateUrl(attrs.buttonTemplate);
    },
    controller: function($scope, $element, $attrs, $q, $document, snCustomEvent, snComplexPopoverService) {
      $scope.type = $attrs.complexPopoverType || "complex_popover";
      if ($scope.closeEvent) {
        snCustomEvent.observe($scope.closeEvent, destroyPopover);
        $scope.$on($scope.closeEvent, destroyPopover);
      }
      $scope.$parent.$on('$destroy', destroyPopover);
      $scope.$on('$destroy', function() {
        snCustomEvent.un($scope.closeEvent, destroyPopover);
      });
      var newScope;
      var open;
      var popover;
      var content;
      var popoverDefaults = {
        container: 'body',
        html: true,
        placement: 'auto',
        trigger: 'manual',
        template: '<div class="complex_popover popover" role="dialog"><div class="arrow"></div><div class="popover-content"></div></div>'
      };
      var popoverConfig = angular.extend(popoverDefaults, $scope.popoverConfig);
      $scope.loading = false;
      $scope.initialized = false;
      $scope.popOverDisplaying = false;
      $scope.togglePopover = function(event) {
        if (!open) {
          showPopover(event);
        } else {
          destroyPopover();
        }
        $scope.popOverDisplaying = !$scope.popOverDisplaying;
      };

      function showPopover(e) {
        if ($scope.loading)
          return;
        $scope.$toggleButton = angular.element(e.target);
        $scope.loading = true;
        $scope.$emit('list.toggleLoadingState', true);
        _getTemplate()
          .then(_insertTemplate)
          .then(_createPopover)
          .then(_bindHtml)
          .then(function() {
            $scope.initialized = true;
            if (!$scope.loadEvent)
              _openPopover();
          });
      }

      function destroyPopover() {
        if (!newScope)
          return;
        $scope.$toggleButton.on('hidden.bs.popover', function() {
          open = false;
          $scope.$toggleButton.data('bs.popover').$element.removeData('bs.popover').off('.popover');
          $scope.$toggleButton = null;
          snCustomEvent.fire('hidden.complexpopover.' + $scope.ref);
        });
        $scope.$toggleButton.popover('hide');
        snCustomEvent.fire('hide.complexpopover.' + $scope.ref, $scope.$toggleButton);
        newScope.$broadcast('$destroy');
        newScope.$destroy();
        newScope = null;
        $scope.initialized = false;
        angular.element(window).off({
          'click': complexHtmlHandler,
          'keydown': keyDownHandler
        });
      }

      function _getTemplate() {
        return snComplexPopoverService.getTemplate(getTemplateUrl($attrs.template));
      }

      function _createPopover() {
        $scope.$toggleButton.popover(popoverConfig);
        return $q.when(true);
      }

      function _insertTemplate(response) {
        newScope = $scope.$new();
        if ($scope.loadEvent)
          newScope.$on($scope.loadEvent, _openPopover);
        content = $compile(response.data)(newScope);
        popoverConfig.content = content;
        newScope.open = true;
        snCustomEvent.fire('inserted.complexpopover.' + $scope.ref, $scope.$toggleButton);
        return $q.when(true);
      }

      function _bindHtml() {
        angular.element(window).on({
          'click': complexHtmlHandler,
          'keydown': keyDownHandler
        });
        return $q.when(true);
      }

      function complexHtmlHandler(e) {
        var parentComplexPopoverScope = angular.element(e.target).parents('.popover-content').children().scope();
        if (parentComplexPopoverScope && (parentComplexPopoverScope.type = "complex_popover") && $scope.type === "complex_popover")
          return;
        if (!open || angular.element(e.target).parents('html').length === 0)
          return;
        if ($scope.initialized && !$scope.loading && !$scope.$toggleButton.is(e.target) && content.parents('.popover').has(angular.element(e.target)).length === 0) {
          _eventClosePopover(e);
          destroyPopover(e);
        }
      }

      function keyDownHandler(e) {
        if (e.keyCode != 27)
          return;
        if (!open || angular.element(e.target).parents('html').length === 0)
          return;
        if ($scope.initialized && !$scope.loading && !$scope.$toggleButton.is(e.target) && content.parents('.popover').has(angular.element(e.target)).length > 0) {
          _eventClosePopover(e);
          destroyPopover();
        }
      }

      function _eventClosePopover(e) {
        e.preventDefault();
        e.stopPropagation();
      }

      function createAndActivateFocusTrap(popover) {
        var deferred = $q.defer();
        if (!window.focusTrap) {
          deferred.reject('Focus trap not found');
        } else {
          if (!$scope.focusTrap) {
            $scope.focusTrap = window.focusTrap(popover, {
              clickOutsideDeactivates: true
            });
          }
          try {
            $scope.focusTrap.activate({
              onActivate: function() {
                deferred.resolve();
              }
            });
          } catch (e) {
            console.warn("Unable to activate focus trap", e);
          }
        }
        return deferred.promise;
      }

      function deactivateAndDestroyFocusTrap() {
        var deferred = $q.defer();
        if (!$scope.focusTrap) {
          deferred.reject("Focus trap not found");
        } else {
          try {
            $scope.focusTrap.deactivate({
              returnFocus: false,
              onDeactivate: function() {
                deferred.resolve();
              }
            });
          } catch (e) {
            console.warn("Unable to deactivate focus trap", e);
          }
          $scope.focusTrap = null;
        }
        return deferred.promise;
      }

      function _openPopover() {
        if (open) {
          return;
        }
        open = true;
        $timeout(function() {
          $scope.$toggleButton.popover('show');
          $scope.loading = false;
          snCustomEvent.fire('show.complexpopover.' + $scope.ref, $scope.$toggleButton);
          $scope.$toggleButton.on('shown.bs.popover', function(evt) {
            var popoverObject = angular.element(evt.target).data('bs.popover'),
              $tooltip,
              popover;
            $tooltip = popoverObject && popoverObject.$tip;
            popover = $tooltip && $tooltip[0];
            if (popover) {
              createAndActivateFocusTrap(popover);
            }
            snCustomEvent.fire('shown.complexpopover.' + $scope.ref, $scope.$toggleButton);
          });
          $scope.$toggleButton.on('hide.bs.popover', function() {
            deactivateAndDestroyFocusTrap().finally(function() {
              $scope.$toggleButton.focus();
            });
          });
        }, 0);
      }
    }
  };
});;
/*! RESOURCE: /scripts/sn/common/ui/popover/service.snComplexPopoverService.js */
angular.module('sn.common.ui.popover').service('snComplexPopoverService', function($http, $q, $templateCache) {
  "use strict";
  return {
    getTemplate: getTemplate
  };

  function getTemplate(template) {
    return $http.get(template, {
      cache: $templateCache
    });
  }
});;;
/*! RESOURCE: /scripts/app.ng_chat/conversation/_module.js */
angular.module("sn.connect.conversation", ["ng.common", "sn.connect.util", "sn.connect.profile", "sn.connect.message", "sn.connect.resource", 'sn.connect.presence', 'sn.common.ui.popover']);;
/*! RESOURCE: /scripts/app.ng_chat/conversation/factory.Conversation.js */
angular.module('sn.connect.conversation').factory('conversationFactory', function(
  conversationPersister, unreadCountService, profiles, messageFactory, ChatActionHandler, liveProfileID,
  notificationPreferences, queueEntries, documentsService, resourcePersister, messageBatcherService, inSupportClient) {
  'use strict';

  function formatUnreadCount(count) {
    return count > 99 ? "99+" : count;
  }

  function fromObject(data) {
    var frameState = data.frame_state || 'open';
    var frameOrder = data.frame_order || 0;
    var amMember = true;
    var visible = data.visible;
    var pendingMessage = "";
    try {
      pendingMessage = sessionStorage.getItem("messagePersist." + data.sys_id) || "";
    } catch (ignored) {}
    unreadCountService.set(data.sys_id, data.last_viewed, data.unread_messages);
    messageBatcherService.addMessages(messageFactory.fromObject(data.last_message), true);

    function getMemberIndexByID(id) {
      for (var i = 0, len = data.members.length; i < len; i++)
        if (data.members[i].sys_id === id)
          return i;
      return -1;
    }

    function setFrameState(value) {
      if (frameState === value)
        return;
      frameState = value;
      conversationPersister.frameState(data.sys_id, value);
    }
    if (!data.members) {
      data.members = [];
    }
    var memberProfiles = [];
    profiles.addMembers(data.members);
    if (data.queueEntry)
      queueEntries.addRaw(data.queueEntry);
    return {
      get name() {
        return (!data.group && this.peer) ? this.peer.name : data.name;
      },
      set name(newName) {
        if (!data.group)
          return;
        data.name = newName;
      },
      get access() {
        return data.access || "unlisted";
      },
      set access(newAccess) {
        data.access = newAccess;
      },
      get peer() {
        if (data.group || !this.members || this.members.length < 2) {
          return null;
        }
        return (this.members[0].sysID === liveProfileID) ? this.members[1] : this.members[0];
      },
      get members() {
        if (memberProfiles.length !== data.members.length) {
          memberProfiles.length = 0;
          angular.forEach(data.members, function(member) {
            if (member.table !== 'sys_user')
              return;
            var memberProfile = profiles.get(member.sys_id || member);
            if (!memberProfile)
              return;
            if (memberProfiles.indexOf(memberProfile) >= 0)
              return;
            memberProfiles.push(memberProfile);
          });
        }
        return memberProfiles;
      },
      get avatarMembers() {
        if (!data.isHelpDesk)
          return this.members;
        return this.members.filter(function(member) {
          return member.sys_id !== liveProfileID;
        });
      },
      get pendingMessage() {
        return pendingMessage
      },
      set pendingMessage(message) {
        pendingMessage = message;
        try {
          sessionStorage.setItem("messagePersist." + this.sysID, message);
        } catch (ignored) {}
      },
      get description() {
        return data.description;
      },
      set description(newDescription) {
        data.description = newDescription;
      },
      resetUnreadCount: function() {
        if (this.sysID)
          unreadCountService.reset(this.sysID);
      },
      get messageBatcher() {
        return messageBatcherService.getBatcher(this.sysID);
      },
      get ariaMessages() {
        var messages = messageBatcherService.getAriaMessages(this.sysID, 5);
        return messages.filter(function(message) {
          return message.timestamp >= data.last_viewed;
        });
      },
      get lastMessage() {
        return messageBatcherService.getLastMessage(this.sysID) || {};
      },
      get firstMessage() {
        return messageBatcherService.getFirstMessage(this.sysID) || {};
      },
      get hasUnreadMessages() {
        return this.unreadCount > 0;
      },
      get unreadCount() {
        return unreadCountService.get(this.sysID);
      },
      get lastReadMessageTime() {
        return unreadCountService.getLastTimestamp(this.sysID);
      },
      get formattedUnreadCount() {
        return formatUnreadCount(this.unreadCount);
      },
      get isDirectMessage() {
        return !(this.isGroup || this.isDocumentGroup || this.isHelpDesk);
      },
      get isGroup() {
        return data.group;
      },
      get isHelpDesk() {
        return !!this.queueEntry && !!this.queueEntry.sysID;
      },
      get queueEntry() {
        return queueEntries.get(this.sysID);
      },
      get isDocumentGroup() {
        return !!data.document || this.isHelpDesk;
      },
      restricted: data.restricted,
      avatar: data.avatar,
      get sysID() {
        return data.sys_id;
      },
      get href() {
        return '/$c.do#/' + (this.isHelpDesk ? 'support' : 'chat') + '/' + this.sysID;
      },
      get document() {
        return data.document;
      },
      get table() {
        return data.table;
      },
      get hasRecord() {
        var documentDetails = this.documentDetails;
        return documentDetails && !!documentDetails.sysID;
      },
      get documentDetails() {
        if (data.table === 'chat_queue_entry')
          return;
        if (!this._documentsServiceRetrieve) {
          this._documentsServiceRetrieve = true;
          documentsService.retrieve(data.table, data.document);
        }
        return documentsService.getDocument(data.document);
      },
      get resources() {
        return resourcePersister.get(this.sysID);
      },
      get preferences() {
        return notificationPreferences.get(this.sysID);
      },
      get chatActions() {
        if (!this.chatActionHandler)
          this.chatActionHandler = ChatActionHandler.create(this);
        return this.chatActionHandler;
      },
      frameOrder: frameOrder,
      openFrameState: function() {
        setFrameState('open');
      },
      get isFrameStateOpen() {
        return frameState === 'open';
      },
      minimizeFrameState: function() {
        setFrameState('minimized');
      },
      get isFrameStateMinimize() {
        return frameState === 'minimized';
      },
      closeFrameState: function() {
        setFrameState('closed');
      },
      get isFrameStateClosed() {
        return frameState === 'closed';
      },
      get amMember() {
        return amMember || getMemberIndexByID(liveProfileID) !== -1;
      },
      get visible() {
        return visible;
      },
      set visible(value) {
        if (visible === value)
          return;
        visible = value;
        conversationPersister.visible(this.sysID, visible);
      },
      get sortIndex() {
        if (inSupportClient && this.isHelpDesk) {
          var queueEntry = this.queueEntry;
          if (queueEntry.workEnd)
            return queueEntry.workEnd;
          if (queueEntry.workStart)
            return queueEntry.workStart;
        }
        return this.lastMessage.timestamp || 0;
      },
      get canSaveWorkNotes() {
        return data.can_save_work_notes;
      },
      addMember: function(member) {
        if (getMemberIndexByID(member.sys_id) < 0) {
          data.members.push(member);
          if (member.sys_id === liveProfileID)
            amMember = true;
        }
      },
      removeMember: function(member) {
        var memberIndex = getMemberIndexByID(member.sys_id);
        if (memberIndex < 0)
          return;
        data.members.splice(memberIndex, 1);
        memberProfiles.splice(memberIndex, 1);
        if (member.sys_id === liveProfileID)
          amMember = false;
      }
    };
  }
  return {
    fromObject: fromObject,
    fromRawConversation: function(data) {
      data.memberData = data.members;
      var preference = data.notification_preference;
      preference.sys_id = data.sys_id;
      notificationPreferences.addRaw(preference);
      return fromObject(data);
    },
    formatUnreadCount: formatUnreadCount
  };
});;
/*! RESOURCE: /scripts/app.ng_chat/conversation/service.activeConversation.js */
angular.module('sn.connect.conversation').service('activeConversation', function(
  $rootScope, $filter, $location, $q, i18n, userPreferences, conversations, documentsService, messageService,
  snTabActivity, startingTab, inFrameSet, inSupportClient, supportEnabled, chatEnabled, supportAddMembers, messageBatcherService,
  snNotification) {
  "use strict";
  var WINDOW_TYPE = inFrameSet ? 'frameSet' : 'standAlone';
  var PREFERENCE_ROOT = 'connect.conversation_list.active_list.' + WINDOW_TYPE;
  var restrictedConversationText = 'The conversation you requested could not be found';
  i18n.getMessages([restrictedConversationText], function(array) {
    restrictedConversationText = array[restrictedConversationText];
  });

  function ConversationHandler(preferenceName, isSupport) {
    var conversationID;

    function contains(conversation) {
      if (!conversation)
        return false;
      if (!conversation.sysID)
        return false;
      if (conversation.isPending)
        return false;
      var isSupportConv = (supportEnabled || !supportAddMembers) ? isSupport : undefined;
      var conversationList = $filter('conversation')(conversations.all, true, isSupportConv);
      return conversations.find(conversation, conversationList).index >= 0;
    }
    return {
      get sysID() {
        return conversationID;
      },
      set sysID(newSysID) {
        conversationID = newSysID;
        setPreference(preferenceName, conversationID);
      },
      get conversation() {
        return conversations.indexed[this.sysID] || conversations.emptyConversation;
      },
      set conversation(newConversation) {
        this.sysID = contains(newConversation) ? newConversation.sysID : undefined;
      }
    };
  }
  var inFrameSetConversationHandler;
  if (inFrameSet)
    inFrameSetConversationHandler = new ConversationHandler(PREFERENCE_ROOT + ".id");

  function TabData(isSupport) {
    var tab = isSupport ? "support" : "chat";
    var preferenceName = PREFERENCE_ROOT + '.' + tab + '.id';
    var conversationHandler = inFrameSetConversationHandler || new ConversationHandler(preferenceName, isSupport);
    if (!inSupportClient) {
      var startingLocation = location();
      if (!inFrameSet && (startingLocation.tab === tab) && startingLocation.conversationID) {
        initialize(startingLocation.conversationID, true).catch(function() {
          snNotification.show('error', restrictedConversationText);
          setPreference(preferenceName);
        });
      } else {
        userPreferences.getPreference(preferenceName).then(initialize).catch(function() {
          setPreference(preferenceName);
        });
      }
    }

    function initialize(id, makeVisible) {
      if (!id || id === "null")
        return $q.when();
      return conversations.get(id).then(function(conversation) {
        if (!conversation)
          return;
        if (!conversation.visible && !makeVisible)
          return;
        conversationHandler.sysID = conversation.sysID;
      });
    }
    return {
      get tab() {
        return tab;
      },
      get isSupport() {
        return isSupport;
      },
      get sysID() {
        return conversationHandler.sysID;
      },
      get conversation() {
        return conversationHandler.conversation;
      },
      set conversation(conv) {
        conversationHandler.conversation = conv;
      }
    };
  }
  var tabDataList = {
    chat: new TabData(false),
    support: new TabData(true)
  };
  var tab = checkedLocation().tab || (inSupportClient ? tabDataList.support.tab : startingTab[WINDOW_TYPE]);
  if (tab == "chat" && !chatEnabled)
    tab = "support";
  else if (tab == "support" && !supportEnabled)
    tab = "chat";
  var activeTabData = tabDataList[tab];
  $rootScope.$on("connect.action.create_record", function(evt, data) {
    documentsService.create(activeTabData.conversation, data);
  });

  function setPreference(name, value) {
    if (inSupportClient)
      return;
    userPreferences.setPreference(name, value || '');
  }
  messageService.watch(function(message) {
    if (activeTabData.sysID !== message.conversationID)
      $rootScope.$broadcast("connect.aria.new_unread_message", message);
    conversations.get(message.conversationID).then(function(conversation) {
      if (!conversation)
        return;
      if (conversation.isGroup)
        message.groupName = conversation.name;
      if (!message.isSystemMessage && (message.timestamp > conversation.lastReadMessageTime))
        conversation.visible = true;
      if (conversation.sysID !== activeTabData.sysID)
        return;
      if (snTabActivity.idleTime >= snTabActivity.defaultIdleTime)
        return;
      if (!snTabActivity.isVisible)
        return;
      conversation.resetUnreadCount();
    });
  });
  snTabActivity.on("tab.primary", function() {
    if (snTabActivity.isActive())
      activeTabData.conversation.resetUnreadCount();
  });

  function location() {
    var path = $location.path().split('/');
    return {
      tab: path[1],
      conversationID: path[2]
    };
  }

  function checkedLocation() {
    var path = location();
    if (path.tab === 'with')
      return {
        profileID: path.conversationID
      };
    return isValidTab(path.tab) ? path : {};
  }

  function isValidTab(tab) {
    return angular.isDefined(tabDataList[tab])
  }
  var pendingConversation;
  return {
    get tab() {
      return activeTabData.tab;
    },
    get sysID() {
      return activeTabData.sysID;
    },
    get conversation() {
      return activeTabData.conversation;
    },
    get isEmpty() {
      return !this.sysID || this.conversation.isEmpty;
    },
    get isSupport() {
      return activeTabData.isSupport;
    },
    get location() {
      return checkedLocation();
    },
    getTab: function(tab) {
      if (!isValidTab(tab))
        throw "Not a valid tab name";
      return tabDataList[tab];
    },
    set conversation(conv) {
      if (conv)
        conv.visible = true;
      else
        conv = conversations.emptyConversation;
      var old = activeTabData.conversation;
      if (!old.isEmpty) {
        old.resetUnreadCount();
        if (conv.sysID !== old.sysID)
          messageBatcherService.clearAriaMessages(old.sysID);
      }
      activeTabData.conversation = conv;
      if (this.isEmpty)
        return;
      if (inFrameSet)
        conv.openFrameState();
      this.conversation.resetUnreadCount();
      $rootScope.$broadcast("connect.message.focus", this.conversation);
    },
    set tab(newTab) {
      if (this.tab === newTab)
        return;
      activeTabData = this.getTab(newTab);
      if (!this.isEmpty)
        this.conversation.resetUnreadCount();
      setPreference(PREFERENCE_ROOT, newTab);
    },
    clear: function(check) {
      if (!check || check.sysID === this.sysID)
        this.conversation = undefined;
    },
    isActive: function(conversation) {
      return !this.pendingConversation && !this.isEmpty && conversation && conversation.sysID === this.sysID;
    },
    get pendingConversation() {
      return pendingConversation;
    },
    set pendingConversation(pending) {
      pendingConversation = pending;
    }
  };
});;
/*! RESOURCE: /scripts/app.ng_chat/conversation/service.conversationPersister.js */
angular.module('sn.connect.conversation').service('conversationPersister', function(
  snHttp, CONNECT_CONTEXT, isLoggedIn) {
  "use strict";
  var REST_API_PATH = isLoggedIn ? '/api/now/connect/conversations' : '/api/now/connect/support/anonymous/conversations';

  function createGroup(optionalParams) {
    optionalParams = optionalParams || {};
    return snHttp.post(REST_API_PATH, optionalParams).then(extractResult);
  }

  function addUser(conversationID, profileID) {
    return snHttp.post(REST_API_PATH + '/' + conversationID + '/members', {
      "member_id": profileID
    }).then(extractResult);
  }

  function removeUser(conversationID, profileID) {
    return snHttp.delete(REST_API_PATH + '/' + conversationID + '/members/' + profileID).then(extractResult);
  }

  function update(conversationID, data) {
    return snHttp.put(REST_API_PATH + '/' + conversationID, data).then(extractResult);
  }

  function extractResult(response) {
    return response.data.result;
  }
  var conversationURL = REST_API_PATH;
  return {
    createGroup: createGroup,
    addUser: addUser,
    removeUser: removeUser,
    update: update,
    getConversations: function(queueID) {
      if (queueID) {
        conversationURL = isLoggedIn ? '/api/now/connect/support/queues/' + queueID + '/sessions' :
          '/api/now/connect/support/anonymous/queues/' + queueID + '/sessions';
      }
      return snHttp.get(conversationURL).then(extractResult);
    },
    getConversation: function(conversationID) {
      return snHttp.get(REST_API_PATH + '/' + conversationID)
        .then(extractResult)
    },
    lastViewed: function(conversationID, timestamp) {
      return update(conversationID, {
        last_viewed: timestamp
      })
    },
    visible: function(conversationID, visible) {
      return update(conversationID, {
        visible: visible
      });
    },
    frameState: function(conversationID, state) {
      var data = {
        frame_state: state
      };
      if (state === 'closed')
        data.frame_order = -1;
      return update(conversationID, data);
    },
    changeFrameOrder: function(conversations) {
      var data = {
        frame_order: conversations.join(',')
      };
      return snHttp.post(REST_API_PATH + '/order', data).then(extractResult);
    },
    createConversation: function(groupName, recipients, message) {
      var recipientJIDs = recipients.map(function(recipient) {
        return recipient.jid;
      });
      var data = {
        group_name: groupName,
        recipients: recipientJIDs,
        message: message.text,
        reflected_field: message.reflectedField || "comments",
        attachments: message.attachmentSysIDs,
        context: CONNECT_CONTEXT
      };
      return snHttp.post(REST_API_PATH, data).then(extractResult);
    },
    createDocumentConversation: function(table, sysID) {
      var data = {
        table: table,
        sys_id: sysID
      };
      return snHttp.post(REST_API_PATH + '/records', data).then(extractResult);
    },
    setDocument: function(profileID, table, document) {
      var data = {
        table: table,
        document: document
      };
      return snHttp.put(REST_API_PATH + '/' + profileID + '/records', data);
    }
  };
});;
/*! RESOURCE: /scripts/app.ng_chat/conversation/service.conversations.js */
angular.module('sn.connect.conversation').service('conversations', function(
  $rootScope, $q, $timeout, amb, i18n, conversationFactory, conversationPersister, documentsService, liveProfileID,
  userID, snHttp, queueEntries, snComposingPresence, snCustomEvent, snTabActivity, snNotification, profiles,
  snNotifier, userPreferences, messageBatcherService, isLoggedIn, sessionID, supportEnabled) {
  "use strict";
  var i18nText;
  i18n.getMessages(['and', 'more', 'You have been mentioned'], function(i18nNames) {
    i18nText = i18nNames;
  });
  var currentLiveProfile;
  profiles.getAsync(liveProfileID).then(function(liveProfile) {
    currentLiveProfile = liveProfile;
  });
  var conversationsIndex = {};
  var onNextUpdate = function() {};
  var lastRefresh = $q.when();
  var firstRefresh = $q.defer();
  var loaded = false;
  var channelId = isLoggedIn ? userID : sessionID;
  amb.getChannel("/connect/" + channelId).subscribe(function(response) {
    var event = response.data;
    var type = event.event_type;
    var data = event.event_data;
    var conversationID = event.event_target || event.group || data.conversation_id;
    var conversation = conversationsIndex[conversationID];
    if (!conversation)
      return;
    if (type === "conversation_member_removed") {
      conversation.removeMember(data);
      if (data.sys_id !== liveProfileID)
        return;
      if (conversation.isPending)
        return;
      snComposingPresence.set(conversation.sysID, [], []);
      delete conversationsIndex[conversation.sysID];
      return;
    }
    if (type === "conversation_member_added") {
      conversation.addMember(data);
      if (data.sys_id === liveProfileID) {
        $rootScope.$broadcast("conversation.refresh_messages", conversation);
      }
      return;
    }
    if (type === "conversation_deauthorized") {
      conversation.restricted = true;
      return;
    }
    if (type === "conversation_updated")
      refreshConversation(conversationID).then(onNextUpdate).then(function() {
        onNextUpdate = function() {};
      });
  });
  amb.getChannel("/notifications/" + liveProfileID).subscribe(function(message) {
    userPreferences.getPreference("connect.notifications.desktop").then(function(value) {
      var allowWebNotifications = angular.isString(value) ? value === "true" : value;
      if (allowWebNotifications && snTabActivity.isPrimary) {
        var body = i18nText[message.data.message] || message.data.message;
        snNotifier().notify(message.data.title, {
          body: body,
          lifespan: 7000,
          onClick: function() {
            window.open("/nav_to.do?uri=/" + message.data.table + ".do?sys_id=" + message.data.document, "_blank");
          }
        });
      }
    });
  });
  amb.connect();
  snCustomEvent.observe('connect:set_document', function(data) {
    conversationPersister.setDocument(data.conversation, data.table, data.document)
      .then(function() {
        onNextUpdate = function(conversation) {
          documentsService.show(conversation.table, conversation.document);
        };
      });
  });
  $rootScope.$on("amb.connection.recovered", function() {
    refreshAll();
  });
  snTabActivity.on("tab.primary", function() {
    refreshAll();
  });

  function refreshAll(queueID) {
    var deferred = $q.defer();
    lastRefresh = deferred.promise;
    conversationPersister.getConversations(queueID).then(function(conversations) {
      if (!loaded) {
        loaded = true;
        firstRefresh.resolve();
      }
      conversationsIndex = {};
      angular.forEach(conversations, addRawConversation);
      deferred.resolve();
    });
    return lastRefresh;
  }

  function refreshConversation(id) {
    return conversationPersister.getConversation(id).then(addRawConversation,
      function(response) {
        if (response.status === 403)
          snNotification.show("error", response.data.result);
        return $q.reject(response)
      });
  }

  function addRawConversation(conversationData) {
    if (!conversationData)
      return;
    var conversation = new conversationFactory.fromRawConversation(conversationData);
    return conversationsIndex[conversation.sysID] = conversation;
  }

  function _get(conversationID) {
    if (conversationsIndex[conversationID])
      return $q.when(conversationsIndex[conversationID]);
    return refreshConversation(conversationID).then(function() {
      if (conversationID === 'pending')
        return NewConversation();
      if (!conversationsIndex[conversationID])
        throw "Conversation " + conversationID + " does not exist";
      return conversationsIndex[conversationID];
    })
  }

  function get(conversationID) {
    return lastRefresh.then(function() {
      return _get(conversationID);
    }, function() {
      return _get(conversationID);
    })
  }

  function getCachedPeerConversations(userSysID) {
    return allConversations().filter(function(conversation) {
      return conversation.isDirectMessage && conversation.members.some(function(member) {
        return member.userID === userSysID;
      });
    });
  }

  function allConversations() {
    return Object.keys(conversationsIndex).map(function(key) {
      return conversationsIndex[key];
    });
  }

  function find(conversation, conversationList) {
    conversationList = conversationList || allConversations();
    var sysID = conversation.sysID || conversation;
    for (var i = 0; i < conversationList.length; ++i) {
      var conv = conversationList[i];
      if (conv.sysID === sysID)
        return {
          conversation: conv,
          index: i
        };
    }
    return {
      index: -1
    };
  }

  function close(conversationID) {
    var conversation = conversationsIndex[conversationID];
    if (!conversation)
      return false;
    if (!conversation.isHelpDesk) {
      remove(conversation);
      return true;
    }
    var queueEntry = conversation.queueEntry;
    if (queueEntry.isWaiting || queueEntry.isEscalated || queueEntry.isTransferRejected || queueEntry.isTransferCancelled) {
      removeSupport(conversation.sysID);
      return true;
    }
    if (queueEntry.isClosedByAgent || !queueEntry.isAssignedToMe) {
      if (!supportEnabled && !conversation.restricted) {
        $rootScope.$broadcast('connect.non_agent_conversation.close_prompt', conversation);
        return false;
      }
      closeSupport(conversationID, true);
      return true;
    }
    $rootScope.$broadcast('connect.support_conversation.close_prompt', conversation, true);
    return false;
  }

  function remove(conversation) {
    conversation.closeFrameState();
    conversation.resetUnreadCount();
    conversation.visible = false;
  }

  function closeSupport(conversationID, agentLeave) {
    queueEntries.close(conversationID, agentLeave);
    if (agentLeave)
      removeSupport(conversationID);
  }

  function removeSupport(conversationID) {
    queueEntries.remove(conversationID);
    delete conversationsIndex[conversationID];
  }

  function removeUser(conversationID, userID) {
    var conversation = conversationsIndex[conversationID];
    if (userID === liveProfileID) {
      remove(conversation);
      if (conversation.isHelpDesk)
        removeSupport(conversation.sysID);
    }
    conversationPersister.removeUser(conversationID, userID);
  }

  function exists(conversationID) {
    return conversationID in conversationsIndex;
  }
  var NewConversation = function() {
    messageBatcherService.removeMessageBatcher("pending");

    function listRecipients(recipients, shorten) {
      var names = recipients.map(function(recipient) {
        return shorten ?
          recipient.name.split(" ")[0] :
          recipient.name;
      });
      var and = shorten ?
        " & " :
        (" " + i18nText["and"] + " ");
      var more = shorten ?
        (" +" + (recipients.length - 3)) :
        (and + (recipients.length - 3));
      more += " " + i18nText["more"];
      switch (recipients.length) {
        case 0:
          return "";
        case 1:
          return names[0];
        case 2:
          return names[0] + and + names[1];
        case 3:
          return names[0] + ", " + names[1] + ", " + and + names[2];
        case 4:
          return names[0] + ", " + names[1] + ", " + names[2] + ", " + and + names[3];
        default:
          return names[0] + ", " + names[1] + ", " + names[2] + ", " + more;
      }
    }
    return {
      sysID: "pending",
      isPending: true,
      pendingRecipients: [],
      name: "New Conversation",
      frameState: 'open',
      frameOrder: 0,
      get messageBatcher() {
        return messageBatcherService.getBatcher(this.sysID);
      },
      get firstMessage() {
        return messageBatcherService.getFirstMessage(this.sysID);
      },
      get isPendingNoRecipients() {
        return this.pendingRecipients.length === 0;
      },
      getGroupName: function() {
        var nameArray = this.pendingRecipients.slice();
        nameArray.unshift(currentLiveProfile);
        return listRecipients(nameArray, true);
      },
      get displayRecipients() {
        return listRecipients(this.pendingRecipients, false);
      },
      closeFrameState: function() {},
      openFrameState: function() {},
      $reset: function() {
        return newConversation = new NewConversation();
      }
    };
  };
  var newConversation = new NewConversation();
  var emptyConversation = conversationFactory.fromObject({});
  emptyConversation.isEmpty = true;
  return {
    get all() {
      return allConversations();
    },
    get indexed() {
      return conversationsIndex;
    },
    loaded: firstRefresh.promise,
    get: get,
    getCachedPeerConversations: getCachedPeerConversations,
    refreshAll: refreshAll,
    refreshConversation: refreshConversation,
    exists: exists,
    find: find,
    addUser: function(conversationID, userID) {
      return conversationPersister.addUser(conversationID, userID).then(get, function(response) {
        if (response.status === 403)
          snNotification.show("error", response.data.result);
        return $q.reject(response)
      });
    },
    removeUser: removeUser,
    followDocumentConversation: function(data) {
      return conversationPersister.createDocumentConversation(data.table, data.sysID).then(addRawConversation);
    },
    unfollowDocumentConversation: function(data) {
      var conversationID = data.conversationID;
      if (conversationID === "undefined")
        conversationID = undefined;
      if (!conversationID) {
        for (var id in conversationsIndex) {
          if (!conversationsIndex.hasOwnProperty(id))
            continue;
          var conversation = conversationsIndex[id];
          if (conversation.document === data.sysID) {
            conversationID = conversation.sysID;
            break;
          }
        }
      }
      return removeUser(conversationID, liveProfileID);
    },
    close: close,
    closeSupport: closeSupport,
    update: function(conversationID, data) {
      var conversation = conversationsIndex[conversationID];
      data.name = data.name.trim();
      if (data.name.length === 0)
        data.name = conversation.name;
      data.description = data.description.trim();
      if (data.description.length === 0)
        data.description = conversation.description;
      if ((data.name === conversation.name) &&
        (data.description === conversation.description) &&
        (data.access === conversation.access))
        return;
      conversation.name = data.name;
      conversation.description = data.description;
      conversation.access = data.access;
      var element = {
        name: data.name,
        short_description: data.description,
        access: data.access
      };
      return conversationPersister.update(conversationID, element).then(addRawConversation);
    },
    beginNewConversation: function(groupName, recipients, message) {
      messageBatcherService.addMessages(message);
      return conversationPersister.createConversation(groupName, recipients, message).then(addRawConversation);
    },
    get newConversation() {
      return newConversation;
    },
    get emptyConversation() {
      return emptyConversation;
    }
  }
});;
/*! RESOURCE: /scripts/app.ng_chat/conversation/directive.snConversation.js */
angular.module('sn.connect.conversation').directive('snConversation', function(
      getTemplateUrl, $rootScope, $timeout, messageService, activeConversation, profiles) {
      "use strict";
      return {
        restrict: 'E',
        templateUrl: getTemplateUrl("snConversation.xml"),
        replace: true,
        scope: {
          conversation: "=",
          shouldAnnounce: "=readmessages",
          showSenderPresence: "@"
        },
        link: function(scope, element) {
          scope.loading = false;
          scope.$watch("messagesLoadedOnce", function() {
            var isConversationActive = !activeConversation.pendingConversation;
            if (isConversationActive)
              $timeout(function() {
                var el = element.find('.new-message');
                el.focus()
              }, 0, false);
            $timeout(function() {
              scope.loading = !scope.messagesLoadedOnce && isConversationActive;
            }, 0, true);
          });
          scope.checkForUnloadedMessages = function() {
            $timeout(function() {
              var scrollHeight = element.find(".sn-feed-messages")[0].scrollHeight;
              var containerHeight = element.find(".sn-feed-messages").height();
              if (scrollHeight < containerHeight) {
                scope.retrieveMessageHistory().then(function(retrievedMessages) {
                  if (retrievedMessages.length === 30)
                    scope.checkForUnloadedMessages();
                  else
                    $timeout(function() {
                      scope.$broadcast('connect.auto_scroll.jump_to_bottom');
                    }, 0, false);
                });
              }
            });
          };

          function onClick(evt) {
            $timeout(function() {
              var profileID = angular.element(evt.target).attr('class').substring("at-mention at-mention-user-".length);
              profiles.getAsync(profileID).then(function(profile) {
                scope.showPopover = true;
                scope.mentionPopoverProfile = profile;
                scope.clickEvent = evt;
              });
            }, 0, false);
          }
          element.on("click", ".at-mention", function(evt) {
            if (scope.showPopover) {
              var off = scope.$on("snMentionPopover.showPopoverIsFalse", function() {
                onClick(evt);
                off();
              });
            } else {
              onClick(evt);
            }
          });
          element.on("click", function(evt) {
            scope.focusOnConversation();
          });
        },
        controller: function($scope, $element, $q, snRe