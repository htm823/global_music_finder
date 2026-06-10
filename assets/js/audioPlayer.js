'use strict';

// HTML class names
const SELECTORS = {
	KIT: '.track__kit',
	AUDIO: 'track__audio',
	PLAY_BTN: 'track__play',
	WAVES: 'track__waves',
	IS_PLAYING: 'is-playing',
};

/**
 * Stop all other audios
 */
function stopAllOtherAudios(currentAudio) {
	const audios = document.querySelectorAll(SELECTORS.AUTIO);
	audios.forEach((audio) => {
		if (audio !== currentAudio && !audio.paused) {
			audio.pause();
			audio.currentTime = 0;
		}
	});
}

/**
 * Update UI state
 */
function updateUiState(audio, isPlaying) {
	const trackKit = audio.closest(SELECTORS.KIT);
	const playBtn = trackKit.querySelector(SELECTORS.PLAY_BTN);
	const waves = trackKit.querySelector(SELECTORS.WAVES);

	playBtn.classList.toggle(SELECTORS.IS_PLAYING, isPlaying);
	waves.classList.toggle(SELECTORS.IS_PLAYING, isPlaying);
}

/**
 * Initialize audio player
 */
const audio = new Audio();
export function initAudioPlayer() {
	document.addEventListener('click', (e) => {
		const playBtn = e.target.closest('.track__play');
		if (!playBtn) return;

		const url = playBtn.dataset.previewUrl;

		if (audio.src === url && !audio.paused) {
			audio.pause();
		} else {
			audio.src = url;
			audio.play();
		}
	});
}

/**
 * Audio state events
 */
document.addEventListener(
	'play',
	(e) => {
		if (!e.target.matches(SELECTORS.AUDIO)) return;
		updateUiState(e.target, true);
	},
	true,
);

document.addEventListener('pause', (e) => {
	if (!e.target.matches(SELECTORS.AUDIO)) return;
	updateUiState(e.target, false);
});

document.addEventListener('ended', (e) => {
	if (!e.target.matches(SELECTORS.AUDIO)) return;
	e.target.currentTime = 0;
	updateUiState(e.target, false);
});
