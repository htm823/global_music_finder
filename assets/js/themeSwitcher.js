// Switch CSS Theme
export function initThemeSwitcher() {
	const radios = document.querySelectorAll('.sidebar__radio');

	radios.forEach(radio => {
		radio.addEventListener('change', (e) => {
			const selectedLanguage = e.target.id;
			document.body.setAttribute('data-theme', selectedLanguage);
		});
	});

	const checkedRadio = document.querySelector('.sidebar__radio:checked');
	if (checkedRadio) {
		document.body.setAttribute('data-theme', checkedRadio.id);
	}
}