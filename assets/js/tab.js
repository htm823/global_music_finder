/**
 * Switch tabs
 */
export function initTabSwitcher() {
	const radios = document.querySelectorAll('.sidebar__radio');
	const contents = document.querySelectorAll('.search__content');

	radios.forEach((radio) => {
		radio.addEventListener('change', (e) => {
			contents.forEach((content) => content.classList.remove('is-active'));

			const selectedId = e.target.id;

			const activeContent = document.querySelector(`.search__content[data-tab="${selectedId}"]`);
			if (activeContent) {
				activeContent.classList.add('is-active');
			}
		});
	});
}
