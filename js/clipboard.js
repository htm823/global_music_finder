export function initClipboard() {
	const searchResultsContainers = document.querySelectorAll('.search-results');

	searchResultsContainers.forEach((container) => {
		container.addEventListener('click', async (e) => {
			const copyBtn = e.target.closest('[data-copy-text]');
			if (!copyBtn) return;

			try {
				await navigator.clipboard.writeText(copyBtn.dataset.copyText);
			} catch (error) {
				console.error('Copy failed:', error);
			}
		});
	});
}