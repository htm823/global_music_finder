const TOAST_ID = 'toast';
const COPY_SELECTOR = '[data-copy-text]';

/**
 * Toast
 *
 * @param {string} message
 * @param {boolean} isError
 * @return {void}
 */
function showToast(message, isError = false) {
	const toast = document.getElementById(TOAST_ID);
	if (!toast) return;

	const type = isError ? 'error' : 'success';
	const icon = isError
		? '<i class="fa-solid fa-circle-xmark"></i>'
		: '<i class="fa-solid fa-circle-check"></i>';

	toast.innerHTML = `${icon} ${message}`;
	toast.classList.add('is-visible', `is-${type}`);

	setTimeout(() => {
		toast.classList.remove('is-visible', `is-${type}`);
	}, 1500);
}

/**
 * Initialize clipboard
 */
export function initClipboard() {
	document.addEventListener('click', async (e) => {
		const copyBtn = e.target.closest(COPY_SELECTOR);
		if (!copyBtn) return;

		try {
			await navigator.clipboard.writeText(copyBtn.dataset.copyText);

			copyBtn.classList.add('is-copied');
			setTimeout(() => copyBtn.classList.remove('is-copied'), 1500);

			showToast('Copied!');
		} catch (error) {
			console.error('Copy failed: ', error);
			showToast('Copy failed', true);
		}
	});
}