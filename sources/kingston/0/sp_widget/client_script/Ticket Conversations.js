function spTicketConversation($scope, nowAttachmentHandler, $animate, $rootScope, cabrillo, $timeout, snRecordWatcher, spUtil, spAriaUtil, $http, $window) {
	$scope.showLocationIcon = false;
	$scope.msg = "";
	$scope.isNative = cabrillo.isNative();
	$scope.errorMessages = [];
	var existingEntries = {}
	var skipNextRecordWatchUpdate = false;
	$scope.typing = [];
	if (!$scope.data.hasReadableJournalField && !$scope.data.isNewRecord)
		console.warn("No readable journal field (comments, work notes, etc.) available in the stream for this record");
	if ($scope.page && $scope.page.g_form)
		hideParentJournalFields();

	function hideParentJournalFields() {
		if (!$scope.data.stream)
			return;

		var fields = $scope.data.stream.journal_fields;
		var g_form = $scope.page.g_form;
		for (var f in fields)
			g_form.setDisplay(fields[f].name, false);
	}
	var liveProfiles = {};
	liveProfiles[$scope.user.sys_id] = {
		userID: $scope.user.sys_id,
		name: $scope.user.name,
		initials: $window.NOW.user_initials
	};
	if ($window.NOW.user_avatar) {
		liveProfiles[$scope.user.sys_id].userImage = $window.NOW.user_avatar;
	}

	$scope.getLiveProfileByUserId = function (userId){
		return liveProfiles[userId];
	}

	var pending = {};

	//Little caching implementation to make sure we only get a given user's profile once.
	$scope.hasLiveProfile = function hasLiveProfile(userId){
		if (liveProfiles[userId])
			return true;
		else if (pending[userId])
			return false;
		else {
			pending[userId] = $http.get('/api/now/live/profiles/sys_user.' + userId).then(function (response) {
				liveProfiles[userId] = {
					userID: userId,
					name: response.data.result.name,
					initials: buildInitials(response.data.result.name),
					avatar: response.data.result.avatar
				};
			});
			return false;
		}
	}

	function buildInitials(name) {
		if (!name)
			return "--";

		var initials = name.split(" ").map(function(word) {
			return word.toUpperCase();
		}).filter(function(word) {
			return word.match(/^[A-Z]/);
		}).map(function(word) {
			return word.substring(0,1);
		}).join("");

		return (initials.length > 3) ? initials.substr(0, 3) : initials;
	}


	function setupAttachmentHandler(){
		$scope.attachmentHandler = new nowAttachmentHandler(attachSuccess, appendError);

		function attachSuccess() {
			$rootScope.$broadcast("sp.attachments.update", $scope.data.sys_id);
			spAriaUtil.sendLiveMessage($scope.data.attachAddedMsg);
		}

		function appendError(error) {
			spUtil.addErrorMessage(error.msg + error.fileName);
			$scope.errorMessages.push(error);
			spAriaUtil.sendLiveMessage($scope.data.attachFailMsg);
		}

		$timeout(function() {
			$scope.attachmentHandler.setParams($scope.data.table, $scope.data.sys_id, 1024 * 1024 * $scope.data.maxAttachmentSize);
		})
	}
	setupAttachmentHandler();

	var recordWatcherTimer;
	$scope.$on('record.updated', function(name, data) {
		// Use record watcher update if:
		//	This record was updated AND This widget didn't trigger the update.
		if (data.table_name == $scope.data.table && data.sys_id == $scope.data.sys_id){
			$timeout.cancel(recordWatcherTimer);
			recordWatcherTimer = $timeout(function(){
				if (skipNextRecordWatchUpdate)
					skipNextRecordWatchUpdate = false;
				else
					spUtil.update($scope).then(function(r){
						$scope.data.stream = r.stream;
					});
			}, 250);
		}
	});

	$scope.$on('sp.show_location_icon', function(evt) {
		$scope.data.showLocationIcon = true;
	});

	$rootScope.$on('sp.sessions', function(evt, sessions) {
		$scope.typing = [];
		Object.keys(sessions).forEach(function (session) {
			session = sessions[session];
			if (session.status != 'typing')
				return;

			$scope.typing.push(session);
		})
	})

	$scope.$on('sp.conversation_title.changed', function(evt, text) {
		$scope.data.ticketTitle = text;
	})

	$scope.$watch("data.canWrite", function() {
		$rootScope.$broadcast("sp.record.can_write", $scope.data.canWrite);
	});

	var streamUpdateTimer;
	$scope.$watch("data.stream", function() {
		$timeout.cancel(streamUpdateTimer);
		streamUpdateTimer = $timeout(function() {
			mergeStreamEntries();
		}, 50);
	});

	function mergeStreamEntries() {
		$scope.placeholder = $scope.data.placeholderNoEntries;
		if (!$scope.data.stream || !$scope.data.stream.entries)
			return;

		$scope.placeholder = $scope.data.placeholder;
		var entries = $scope.data.stream.entries;
		if (!$scope.data.mergedEntries) {
			$scope.data.mergedEntries = $scope.data.stream.entries.slice();
			for (var i = 0; i < entries.length; i++) {
				existingEntries[entries[i].sys_id] = true;
			}

			return;
		}

		var mergedEntries = $scope.data.mergedEntries;
		for (var i = entries.length-1; i >= 0; i--) {
			var curEntry = entries[i];
			if (isNewEntry(mergedEntries, curEntry)){
				mergedEntries.unshift(curEntry);
				existingEntries[curEntry.sys_id] = true;
			}
		}
	}

	function isNewEntry(mergedEntries, item) {
		for (var i=0; i < mergedEntries.length; i++) {
			if (mergedEntries[i].sys_id === item.sys_id) {
				return false;
			}
		}
		return true;
	}

	$scope.getPlaceholder = function() {
		if ($scope.data.use_dynamic_placeholder && $scope.data.useSecondaryJournalField)
			return $scope.data.secondaryJournalField.label;
		return $scope.placeholder;
	};

	var colorCache;
	$scope.getFieldColor = function(fieldName) {
		var defaultColor = "transparent";
		if (colorCache) {
			if (fieldName in colorCache)
				return colorCache[fieldName];
			else
				return defaultColor;
		}

		colorCache = {};
		var jf = $scope.data.stream.journal_fields;
		for (var i=0; i<jf.length;i++) {
			colorCache[jf[i].name] = jf[i].color || defaultColor;
		}
		return $scope.getFieldColor(fieldName);
	}

	$scope.checkInLocation = function() {
		$rootScope.$broadcast("check_in_location");
		$rootScope.$broadcast("location.sharing.start");
	}

	$scope.$on("location.sharing.end", function() {
		$timeout(function() {$scope.msg = ""}, 500);
	})

	$scope.$on("location.sharing.start", function() {
		$scope.msg = $scope.data.sharingLocMsg;
	})

	$scope.scanBarcode = function() {
		$rootScope.$broadcast("scan_barcode");
	}

	$scope.$on("attachment.upload.start", function() {
		$scope.msg = $scope.data.uploadingAttachmentMsg;
	})

	$scope.$on("attachment.upload.stop", function() {
		$scope.msg = "";
		//update the stream so we get the new attachment
		spUtil.update($scope).then(function(r) {
			$scope.data.stream = r.stream;
		});
	});

	$scope.data.isPosting = false;
	$scope.postEntry = function(input){

		if (!input)
			return;

		input = input.trim();
		$scope.data.journalEntry = input;

		if ($scope.data.useSecondaryJournalField)
			$scope.data.journalEntryField = $scope.data.secondaryJournalField.name;
		else
			$scope.data.journalEntryField = $scope.data.primaryJournalField.name;
		$scope.data.isPosting = true;
		spUtil.update($scope).then(function(){
			$scope.data.isPosting = false;
			reset();
			spAriaUtil.sendLiveMessage($scope.data.messagePostedMsg);
			$timeout(function() {
				$scope.setFocus(); // sets focus back on input, defined in "link"
			});
		});
		skipNextRecordWatchUpdate = true;
		$scope.setFocus(); // sets focus back on input, defined in "link"
	};

	var reset = function(){
		$scope.userTyping("");
		$scope.data.journalEntry = "";
		$scope.data.useSecondaryJournalField = false;
		$scope.data.journalEntryField = "";
	}

	$scope.keyPress = function(event) {
		if (event.keyCode === 13 && !event.shiftKey) {
			event.preventDefault();
			if ($scope.data.journalEntry)
				$scope.postEntry($scope.data.journalEntry);
		}
	}

	$scope.userTyping = function(input) {
		var status = "viewing";
		if (input.length)
			status = "typing";

		$scope.$emit("record.typing", {status: status, value: input, table: $scope.data.table, sys_id: $scope.data.sys_id});
	}
}