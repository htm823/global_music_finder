// Switch CSS Theme
export function initThemeSwitcher() {
	const languageRadios = document.querySelectorAll('.language__radio');

	languageRadios.forEach(radio => {
		radio.addEventListener('change', (e) => {
			const selectedLanguage = e.target.id;
			document.body.setAttribute('data-theme', selectedLanguage);
		});
	});

	const checkedRadio = document.querySelector('.language__radio:checked');
	if (checkedRadio) {
		document.body.setAttribute('data-theme', checkedRadio.id);
	}
}