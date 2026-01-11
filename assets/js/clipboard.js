// Show a toast when successfully copied or failed
function showToast(message, type = 'success') {
	const toast = document.getElementById('toast');
	if (!toast) return;

	const icon =
		(type === 'success')
		? '<i class="fa-solid fa-circle-check"></i>'
		: '<i class="fa-solid fa-circle-xmark"></i>';

	toast.innerHTML = `${icon} ${message}`;
	toast.classList.add('is-visible', `is-${type}`);

	setTimeout(() => {
		toast.classList.remove('is-visible', `is-${type}`);
	}, 1500);
}

// Initialise copy buttons
export function initClipboard() {
	const searchResultsContainers = document.querySelectorAll('.search-results');

	searchResultsContainers.forEach((container) => {
		container.addEventListener('click', async (e) => {
			const copyBtn = e.target.closest('[data-copy-text]');
			if (!copyBtn) return;

			try {
				await navigator.clipboard.writeText(copyBtn.dataset.copyText);

				copyBtn.classList.add('is-copied');
				setTimeout(() => {
					copyBtn.classList.remove('is-copied');
				}, 1500);

				showToast('Copied');
			} catch (error) {
				console.error('Copy failed:', error);

				showToast('Copy failed', 'error');
			}
		});
	});
}