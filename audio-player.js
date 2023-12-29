/**
 * @license
 * True Audio Player 1.1.1
 * Audio player plugin for creating robust audio player solutions
 * https://upliftwebdesign.com/true-audio-player
 *
 * Copyright 2023 Uplift Web Design LLC
 *
 * Released under the GNU General Public License v3.0 License
 *
 * Released on: January 15, 2023
 */
!(function (t, e, n, i) {
    var r = {};
    function a(t, e, i, r, a, s) {
        var u = this;
        (this.id = o()), (this.$elem = i), (this.targetSetId = r), this.$elem.attr("data-true-audio-player-song-id", this.id), this.$parentElem, (this.audio = new Audio()), (this.audio.preload = s || "none");
        var l = n.createElement("source");
        l.setAttribute("src", e),
            a && ((a = a.replace("\\", "/")), l.setAttribute("type", a)),
            this.audio.append(l),
            (this.title = ""),
            (this.artist = ""),
            (this.album = ""),
            (this.genre = ""),
            (this.durationString = "0:00"),
            (this._thumbnail = ""),
            (this._thumbnailBlob = ""),
            (this._thumbnailBlobUrl = ""),
            (this.getThumbnail = function () {
                return this._thumbnail;
            }),
            (this.getThumbnailBlob = function () {
                return this._thumbnailBlob;
            }),
            (this.getThumbnailBlobUrl = function () {
                return this._thumbnailBlobUrl;
            }),
            (this.setThumbnail = function (t) {
                this._thumbnail = t;
            }),
            this.audio.addEventListener("timeupdate", function (e) {
                if (t.isDragging) return !1;
                var n = e.srcElement.currentTime,
                    i = e.srcElement.duration;
                t.updateSongDisplayTime(n, i);
            }),
            this.audio.addEventListener("volumechange", function (e) {
                var n = 100 * e.srcElement.volume;
                t.$volumeBar.width(n + "%");
            }),
            this.audio.addEventListener("canplay", function () {}),
            this.audio.addEventListener("play", function () {
                t.targetSets[u.targetSetId] && t.targetSets[u.targetSetId].removeClass("is-buffering"), t.setPlayerState("playing", u), "mediaSession" in navigator && (navigator.mediaSession.playbackState = "playing");
            }),
            this.audio.addEventListener("pause", function () {
                t.setPlayerState("paused", u), "mediaSession" in navigator && (navigator.mediaSession.playbackState = "paused");
            }),
            this.audio.addEventListener("waiting", function () {
                t.targetSets[u.targetSetId] && t.targetSets[u.targetSetId].addClass("is-buffering");
            }),
            this.audio.addEventListener("ended", function () {
                1 == t.songs.length || t.isDragging ? t.stopCurrentSongEnded() : t.playNextSong();
            }),
            this.audio.addEventListener("loadedmetadata", function () {
                var e = parseInt(u.audio.duration / 60, 10),
                    n = parseInt(u.audio.duration % 60);
                (n = n >= 10 ? n : "0" + n),
                    (u.durationString = e + ":" + n),
                    u.$parentElem && u.$parentElem.find('[tmplayer-interaction="populate-duration"]').text(u.durationString),
                    t.getCurrentSong() == u && t.$duration.text(u.durationString);
            });
    }
    function o() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    function s(e, n) {
        (this.$elem = t(e)), (this.settings = t.extend({}, r, n)), (this._defaults = r), this.init();
    }
    (s.prototype = {
        init: function () {
            var e = this;
            (e.id = o()),
                (e.name = e.$elem.attr("tmplayer-init")),
                (e.isDragging = !1),
                (e.songs = []),
                (e.targetSets = {}),
                (e._volume = 1),
                (e._playerState = "stopped"),
                (e._currentSongIndex = -1),
                (e.tempCurrentTime = 0),
                (this.$songName = this.$elem.find('[tmplayer-element="title"]').attr("tmplayer-interaction", "monitor-state")),
                (this.$thumbnail = this.$elem.find('[tmplayer-element="thumbnail"]').attr("tmplayer-interaction", "monitor-state")),
                (this.$albumName = this.$elem.find('[tmplayer-element="album"]').attr("tmplayer-interaction", "monitor-state")),
                (this.$artistName = this.$elem.find('[tmplayer-element="artist"]').attr("tmplayer-interaction", "monitor-state")),
                (this.$genre = this.$elem.find('[tmplayer-element="genre"]').attr("tmplayer-interaction", "monitor-state")),
                (this.playButton = this.$elem.find('[tmplayer-button="play"]')),
                (this.pauseButton = this.$elem.find('[tmplayer-button="pause"]')),
                (this.nextButton = this.$elem.find('[tmplayer-button="next"]')),
                (this.previousButton = this.$elem.find('[tmplayer-button="previous"]')),
                (this.stopButton = this.$elem.find('[tmplayer-button="stop"]')),
                (this.volumeUpButton = this.$elem.find('[tmplayer-button="volume-up"]')),
                (this.volumeDownButton = this.$elem.find('[tmplayer-button="volume-down"]')),
                (this.volumeMuteButton = this.$elem.find('[tmplayer-button="volume-mute"]')),
                (this.volumeHalfButton = this.$elem.find('[tmplayer-button="volume-half"]')),
                (this.volumeFullButton = this.$elem.find('[tmplayer-button="volume-full"]')),
                (this.volumeToggleButtons = t(
                    t.map([e.volumeMuteButton, e.volumeHalfButton, e.volumeFullButton], function (t) {
                        return t.get();
                    })
                )),
                (this.$progressBarWrapper = this.$elem.find('[tmplayer-element="progress-bar-wrapper"]')),
                (this.$progressBar = this.$elem.find('[tmplayer-element="progress-bar"]')),
                (this.$duration = this.$elem.find('[tmplayer-element="duration"]')),
                (this.$elapsed = this.$elem.find('[tmplayer-element="elapsed"]').text("0:00")),
                (this.$volumeBarWrapper = this.$elem.find('[tmplayer-element="volume-bar-wrapper"]')),
                (this.$volumeBar = this.$elem.find('[tmplayer-element="volume-bar"]')),
                (this.$clickTargets = t("[tmplayer-click]")),
                (this.$ajaxContainers = t('[tmplayer-dynamic-content="' + e.name + '"]')),
                (this.targetSets.player = this.$elem.find('[tmplayer-interaction="monitor-state"]')),
                this.pauseButton.hide(),
                this.$progressBar.width("0%"),
                this.$volumeBar.width("100%"),
                t('[tmplayer-parent="' + e.name + '"]').each(function (t, n) {
                    e.initExternalSong(n);
                }),
                e.$elem
                    .find('[tmplayer-element="audio"]')
                    .hide()
                    .each(function (t, n) {
                        e.grabAndSetSongData(n);
                    }),
                0 != e.songs.length
                    ? (this.playButton.on("click", function () {
                          e.playCurrentSong();
                      }),
                      this.stopButton.on("click", function () {
                          e.stopCurrentSong();
                      }),
                      this.pauseButton.on("click", function () {
                          e.pauseCurrentSong();
                      }),
                      this.volumeUpButton.on("click", function () {
                          var t = e.getVolume() + 0.1;
                          e.setVolume(t);
                      }),
                      this.volumeDownButton.on("click", function () {
                          var t = e.getVolume() - 0.1;
                          e.setVolume(t);
                      }),
                      this.volumeToggleButtons.on("click", function () {
                          e.getVolume() > 0 ? e.setVolume(0) : e.setVolume(1);
                      }),
                      this.nextButton.on("click", function () {
                          e.playNextSong();
                      }),
                      this.previousButton.on("click", function () {
                          e.playPreviousSong();
                      }),
                      this.$clickTargets.on("click", function () {
                          var n = t(this).attr("tmplayer-click");
                          switch (n) {
                              case "play":
                                  e.playCurrentSong();
                                  break;
                              case "pause":
                                  e.pauseCurrentSong();
                                  break;
                              case "stop":
                                  e.stopCurrentSong();
                                  break;
                              default:
                                  console.error(n + " does not exist on true music player.");
                          }
                      }),
                      this.setVolume(1),
                      this.initProgressBarEvents(),
                      this.initVolumeBarEvents(),
                      this.initAjaxLoadObserver(),
                      this.initMediaAPIActions(),
                      this.setCurrentSong(0))
                    : console.error("There are no songs in the player.");
        },
        getVolume: function () {
            return this._volume;
        },
        setVolume: function (t) {
            t < 0 ? (t = 0) : t > 1 && (t = 1),
                this.volumeMuteButton.hide(),
                this.volumeHalfButton.hide(),
                this.volumeFullButton.hide(),
                0 == (0 == t ? this.volumeMuteButton.show() : t < 0.66 ? this.volumeHalfButton.show() : this.volumeFullButton.show()).length && this.volumeFullButton.show(),
                (this._volume = t),
                (this.getCurrentSong().audio.volume = t);
        },
        playCurrentSong: function () {
            truePlayerManager.activePlayer && truePlayerManager.activePlayer != this && truePlayerManager.activePlayer.pauseCurrentSong(),
                this.pauseButton.show(),
                this.playButton.hide(),
                (this.getCurrentSong().audio.volume = this.getVolume()),
                (truePlayerManager.activePlayer = this),
                this.getCurrentSong().audio.play();
        },
        stopCurrentSong: function () {
            this.pauseCurrentSong(), (this.getCurrentSong().audio.currentTime = 0);
        },
        stopCurrentSongEnded: function () {
            alert("This has ended!!!")
            this.pauseCurrentSong(), (this.getCurrentSong().audio.currentTime = 0);
        },
        pauseCurrentSong: function () {
            this.pauseButton.hide(), this.playButton.show(), (truePlayerManager.activePlayer = null), this.getCurrentSong().audio.pause();
        },
        togglePauseCurrentSong: function () {
            "playing" == this.getPlayerState() ? this.pauseCurrentSong() : this.playCurrentSong();
        },
        toggleStopCurrentSong: function () {
            "playing" == this.getPlayerState() ? this.stopCurrentSong() : this.playCurrentSong();
        },
        getCurrentSong: function () {
            return -1 === this.getCurrentSongIndex() && this.setCurrentSong(0), this.songs[this.getCurrentSongIndex()];
        },
        setCurrentSong: function (t) {
            var e = this.songs[t];
            if (!e) return console.error("Song with index " + t + " not found."), !1;
            0 == e.audio.readyState && ((e.preload = "metadata"), e.audio.load());
            var n = this.songs[this._currentSongIndex];
            n && n.$parentElem && n.targetSetId != e.targetSetId && (n.$parentElem.removeClass("is-current"), this.targetSets[n.targetSetId].removeClass("is-current")),
                (this._currentSongIndex = t),
                e.$parentElem && (e.$parentElem.addClass("is-current"), this.targetSets[e.targetSetId].addClass("is-current"));
            var i = e.getThumbnail();
            i ? this.$thumbnail.attr("src", i) : this.$thumbnail.removeAttr("src"),
                this.$songName.text(e.title),
                this.$albumName.text(e.album),
                this.$artistName.text(e.artist),
                this.$duration.text(e.durationString),
                this.$genre.text(e.genre);
        },
        initProgressBarEvents: function () {
            var n = this;
            n.$progressBarWrapper.on("touchstart", function (i) {
                if ((i.preventDefault(), 0 == n.getCurrentSong().audio.readyState)) return !1;
                n.isDragging = !0;
                var r = n.scrubSong(i),
                    a = n.getCurrentSong().audio.duration;
                n.updateSongDisplayTime(r, a),
                    t(e).on("touchmove.trueAudioPlayer", function (t) {
                        var e = n.scrubSong(t);
                        n.updateSongDisplayTime(e, a);
                    }),
                    t(e).one("touchend", function () {
                        t(e).off("touchmove.trueAudioPlayer"), (n.getCurrentSong().audio.currentTime = n.tempCurrentTime), (n.isDragging = !1);
                    });
            }),
                n.$progressBarWrapper.on("mousedown", function (i) {
                    if ((i.preventDefault(), 0 == n.getCurrentSong().audio.readyState)) return !1;
                    n.isDragging = !0;
                    var r = n.scrubSong(i),
                        a = n.getCurrentSong().audio.duration;
                    n.updateSongDisplayTime(r, a),
                        t(e).on("mousemove.trueAudioPlayer", function (t) {
                            var e = n.scrubSong(t);
                            n.updateSongDisplayTime(e, a);
                        }),
                        t(e).one("mouseup", function () {
                            t(e).off("mousemove.trueAudioPlayer"), (n.getCurrentSong().audio.currentTime = n.tempCurrentTime), (n.isDragging = !1);
                        });
                });
        },
        initVolumeBarEvents: function () {
            var n = this;
            n.$volumeBarWrapper.on("mousedown", function (i) {
                i.preventDefault(),
                    n.scrubVolume(i),
                    t(e).on("mousemove.trueAudioPlayer", function (t) {
                        n.scrubVolume(t);
                    }),
                    t(e).one("mouseup", function () {
                        t(e).off("mousemove.trueAudioPlayer");
                    });
            }),
                n.$volumeBarWrapper.on("touchstart", function (i) {
                    i.preventDefault(),
                        n.scrubVolume(i),
                        t(e).on("touchmove.trueAudioPlayer", function (t) {
                            n.scrubVolume(t);
                        }),
                        t(e).one("touchend", function () {
                            t(e).off("touchmove.trueAudioPlayer");
                        });
                });
        },
        scrubSong: function (t) {
            var e = "touchstart" == t.type || "touchmove" == t.type ? t.touches[0].clientX : t.clientX,
                n = this.$progressBarWrapper.width(),
                i = (e - this.$progressBarWrapper.offset().left) / n;
            i < 0 ? (i = 0) : i > 1 && (i = 1);
            var r = this.getCurrentSong().audio.duration * (i = i < 0 ? 0 : i);
            return (this.tempCurrentTime = r), r;
        },
        scrubVolume: function (t) {
            var e = "touchstart" == t.type || "touchmove" == t.type ? t.touches[0].clientX : t.clientX,
                n = this.$volumeBarWrapper.width(),
                i = (e - this.$volumeBarWrapper.offset().left) / n;
            this.setVolume(i);
        },
        playNextSong: function () {
            if (1 == this.songs.length) return !1;
            this.stopCurrentSong();
            var t = this.getCurrentSongIndex();
            this.songs[t + 1] ? t++ : (t = 0), this.setCurrentSong(t), this.playCurrentSong();
        },
        playPreviousSong: function () {
            if (this.getCurrentSong().audio.currentTime > 3) return (this.getCurrentSong().audio.currentTime = 0), !1;
            var t = this.getCurrentSongIndex();
            if (1 == this.songs.length || 0 == t) return !1;
            this.stopCurrentSong(), this.songs[t - 1] && t--, this.setCurrentSong(t), this.playCurrentSong();
        },
        setPlayerState: function (t, e) {
            if (t == this._playerState) return !1;
            this.$elem.removeClass("is-playing is-paused");
            var n = this.targetSets.player.removeClass("is-playing is-paused"),
                i = e.$parentElem;
            if (i) {
                i.removeClass("is-playing is-paused");
                var r = this.targetSets[e.targetSetId].removeClass("is-playing is-paused");
            }
            switch (t) {
                case "playing":
                    this.$elem.addClass("is-playing"),
                        n.addClass("is-playing"),
                        i && (i.addClass("is-playing"), r.addClass("is-playing")),
                        "mediaSession" in navigator && (navigator.mediaSession.metadata = new MediaMetadata({ title: e.title, artist: e.artist, album: e.album })),
                        (this._playerState = "playing");
                    break;
                case "paused":
                    this.$elem.addClass("is-paused"), n.addClass("is-paused"), i && (i.addClass("is-paused"), r.addClass("is-paused")), (this._playerState = "paused");
                    break;
                default:
                    this._playerState = "stopped";
            }
        },
        getPlayerState: function () {
            return this._playerState;
        },
        getCurrentSongIndex: function () {
            return this._currentSongIndex;
        },
        updateSongDisplayTime: function (t, e) {
            var n = (t / e) * 100,
                i = parseInt(t / 60, 10),
                r = parseInt(t % 60);
            (r = r >= 10 ? r : "0" + r), this.$elapsed.text(i + ":" + r), this.$progressBar.width(n + "%");
        },
        initAjaxLoadObserver: function () {
            var t = this;
            t.$ajaxContainers.each(function (e, n) {
                new MutationObserver(function (e) {
                    e.forEach(function (e) {
                        e.addedNodes.forEach(function (e) {
                            e.getAttribute("tmplayer-parent") == t.name && t.initExternalSong(e);
                        });
                    });
                }).observe(n, { subtree: !1, childList: !0 });
            });
        },
        initExternalSong: function (e) {
            var n = this,
                i = t(e),
                r = o();
            (n.targetSets[r] = i.find('[tmplayer-interaction="monitor-state"]')),
                i.find('[tmplayer-action="none"]').on("click", function (t) {
                    t.stopPropagation();
                });
            var a = [i.find('[tmplayer-action="toggle"]')];
            "toggle" == i.attr("tmplayer-action") && a.push(i);
            var s = t.map(a, function (t) {
                return t.get();
            });
            t(s).on("click", function (t) {
                var e = n.songs
                        .map(function (t, e) {
                            return (songMap = { globalIndex: e, song: t });
                        })
                        .filter(function (t) {
                            return t.song.targetSetId == r;
                        }),
                    i = n.getCurrentSong().id;
                e.filter(function (t) {
                    return t.song.id == i;
                }).length > 0
                    ? n.togglePauseCurrentSong()
                    : (n.stopCurrentSong(), n.setCurrentSong(e[0].globalIndex), n.playCurrentSong());
            }),
                t(e)
                    .find('[tmplayer-element="audio"]')
                    .hide()
                    .each(function (t, i) {
                        n.grabAndSetSongData(i, e, r);
                    });
        },
        grabAndSetSongData: function (e, n, i) {
            var r = t(e),
                o = n ? t(n) : void 0,
                s = r.children('[tmplayer-meta="audio-url"]').text(),
                u = r.children('[tmplayer-meta="audio-type"]').text(),
                l = r.children('[tmplayer-meta="preload"]').text(),
                h = new a(this, s, r, i, u, l);
            (h.$parentElem = o),
                (h.title = r.children('[tmplayer-meta="title"]').text()),
                (h.artist = r.children('[tmplayer-meta="artist"]').text()),
                (h.genre = r.children('[tmplayer-meta="genre"]').text()),
                (h.album = r.children('[tmplayer-meta="album"]').text()),
                r.children('[tmplayer-meta="thumbnail"]').text()
                    ? h.setThumbnail(r.children('[tmplayer-meta="thumbnail"]').text())
                    : r.children('[tmplayer-meta="thumbnail"]').attr("src") && h.setThumbnail(r.children('[tmplayer-meta="thumbnail"]').attr("src")),
                this.songs.push(h);
        },
        initMediaAPIActions: function () {
            var t = this,
                e = [
                    [
                        "play",
                        function () {
                            t.playCurrentSong();
                        },
                    ],
                    [
                        "pause",
                        function () {
                            t.pauseCurrentSong();
                        },
                    ],
                    [
                        "previoustrack",
                        function () {
                            t.playPreviousSong();
                        },
                    ],
                    [
                        "nexttrack",
                        function () {
                            t.playNextSong();
                        },
                    ],
                    [
                        "stop",
                        function () {
                            t.stopCurrentSong();
                        },
                    ],
                    [
                        "seekbackward",
                        function (e) {
                            var n = e.seekOffset || 10;
                            t.getCurrentSong().audio.currentTime = Math.max(t.getCurrentSong().audio.currentTime - n, 0);
                        },
                    ],
                    [
                        "seekforward",
                        function (e) {
                            var n = e.seekOffset || 10;
                            t.getCurrentSong().audio.currentTime = Math.max(t.getCurrentSong().audio.currentTime + n, t.getCurrentSong().audio.duration);
                        },
                    ],
                    [
                        "seekto",
                        function (e) {
                            t.getCurrentSong().audio.currentTime = e.seekTime;
                        },
                    ],
                ];
            for (var [n, i] of e)
                try {
                    navigator.mediaSession.setActionHandler(n, i);
                } catch (t) {
                    console.log("The media session action " + n + " is not supported yet.");
                }
        },
    }),
        t.fn.extend({
            trueAudioPlayer: function (e) {
                var n = {
                    getName: function () {
                        return this.name;
                    },
                    pause: function () {
                        this.pauseCurrentSong();
                    },
                    stop: function () {
                        this.stopCurrentSong();
                    },
                    play: function (t) {
                        this.stopCurrentSong(), t && this.setCurrentSong(t), this.playCurrentSong();
                    },
                    togglePause: function () {
                        this.togglePauseCurrentSong();
                    },
                    toggleStop: function () {
                        this.toggleStopCurrentSong();
                    },
                };
                return n[e]
                    ? n[e].apply(t(this).data("plugin_trueAudioPlayer"), Array.prototype.slice.call(arguments, 1))
                    : "object" != typeof e && e
                    ? void console.error("Method " + e + " does not exist on True Audio Player")
                    : this.each(function () {
                          t.data(this, "plugin_trueAudioPlayer") || t.data(this, "plugin_trueAudioPlayer", new s(this, e));
                      });
            },
        }),
        (e.truePlayerManager = new (function () {
            function e(t) {
                return t.replace(/\s+/g, "-").toLowerCase();
            }
            (this.activePlayer = null),
                (this.allPlayers = {}),
                (this.initializePlayers = function () {
                    var n = this;
                    t("[tmplayer-init]")
                        .trueAudioPlayer()
                        .each(function (i, r) {
                            var a = t(r).trueAudioPlayer("getName"),
                                o = e(a);
                            o && (n.allPlayers[o] ? console.warn("An audio player with name " + a + " already exists. Fix the issue or you may experience problems.") : (n.allPlayers[o] = t(r)));
                        });
                }),
                (this.pauseActivePlayer = function () {
                    this.activePlayer && this.activePlayer.pauseCurrentSong();
                }),
                (this.stopActivePlayer = function () {
                    this.activePlayer && this.activePlayer.stopCurrentSong();
                }),
                (this.pause = function (t) {
                    var n = e(t),
                        i = this.allPlayers[n];
                    i ? i.trueAudioPlayer("pause") : console.warn("Player named " + n + " does not exist");
                }),
                (this.stop = function (t) {
                    var n = e(t),
                        i = this.allPlayers[n];
                    i ? i.trueAudioPlayer("stop") : console.warn("Player named " + n + " does not exist");
                }),
                (this.togglePause = function (t) {
                    var n = e(t),
                        i = this.allPlayers[n];
                    i ? i.trueAudioPlayer("togglePause") : console.warn("Player named " + n + " does not exist");
                }),
                (this.toggleStop = function (t) {
                    var n = e(t),
                        i = this.allPlayers[n];
                    i ? i.trueAudioPlayer("toggleStop") : console.warn("Player named " + n + " does not exist");
                }),
                (this.play = function (t, n) {
                    var i = e(t),
                        r = this.allPlayers[i];
                    r ? r.trueAudioPlayer("play", n) : console.warn("Player named " + i + " does not exist");
                });
        })()),
        truePlayerManager.initializePlayers();
})($, window, document);

