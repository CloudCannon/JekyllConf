jQuery(function ($) {
	var Player = function (videoId) {
		this._videoId = videoId;
		this._elId = "player" + videoId;
		this.initialised = false;

		Player.players[videoId] = this;

		if (Player.youtubeLoaded) {
			this.init();
		}
	};

	Player.players = {};
	Player.youtubeLoaded = false;
	Player.currentOpen = null;

	Player.prototype.init = function () {
		if (this.initialised) {
			return;
		}

		this.initialised = true;
		this.$el = $('<div class="video-dialog"><a class="video-dialog-close">&times;</a><div id="' + this._elId + '"></div></div>').appendTo("body");
		this.player = new YT.Player(this._elId, {
			height: '720',
			width: '1280',
			videoId: this._videoId,
			playerVars: {
				autoplay: 1,
				modestbranding: 1,
				autohide: 1,
				rel: 0
			}
		});

		var self = this,
			boundClick = function () {
				self.closePopup()
			};

		this.$el.click(boundClick);
		this.$el.find(".video-dialog-close").click(boundClick);
	};

	Player.prototype.closePopup = function () {
		Player.currentOpen = null;
		this.$el.removeClass("open");

		this.player.stopVideo();
	};

	Player.prototype.openPopup = function () {
		if (Player.currentOpen) {
			Player.currentOpen.closePopup();
		}
		Player.currentOpen = this;
		this.$el.addClass("open");

		if (this.player.playVideo) {
			this.player.playVideo();
		}
	};

	Player.prototype.togglePopup = function () {
		if(this.$el.hasClass("open")) {
			this.closePopup();
		} else {
			this.openPopup();
		}
		return false;
	};

    function checkESC(e) {
        if (e.keyCode == 27) {
        	if (Player.currentOpen && Player.currentOpen.initialised) {
        		Player.currentOpen.closePopup();
        	}
        }
    };

	window.onYouTubeIframeAPIReady = function () {
		Player.youtubeLoaded = true;
		for (var videoId in Player.players) {
			Player.players[videoId].init();
		}
	};

	Player.getPlayer = function(videoId) {
		var player = Player.players[videoId];
		if (!player) {
			player = new Player(videoId);
		}
		return player;
	}

	$("[data-video-id]").click(function (e) {
		Player.getPlayer($(this).data("videoId")).openPopup();
		return false;
	});

    document.onkeyup = checkESC;

    var apiScript = document.createElement('script');
	apiScript.src = "https://www.youtube.com/iframe_api";
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(apiScript,s);
});
