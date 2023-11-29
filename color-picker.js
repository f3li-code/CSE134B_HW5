// select the form, and insert another form below it
let colorPickerTemplate = document.getElementById('color-picker-template');
// colorPickerTemplate.style.display = 'block';
const clone = colorPickerTemplate.content.cloneNode(true);
document.querySelector('main').appendChild(clone.children[0]);

const textColorInput = document.getElementById('text-color');
const backgroundColorInput = document.getElementById('background-color');
const themeNameInput = document.getElementById('theme-name');
const fontStyleSelect = document.getElementById('font-family');
const fontStyleLabel = document.getElementById('font-family-label');

fontStyleSelect.addEventListener('change', (e) => {
	fontStyleSelect.style.fontFamily = fontStyleSelect.value;
	fontStyleLabel.style.fontFamily = fontStyleSelect.value;
});

const themePicker = document.getElementById('theme-picker');
const themes = [
	{
		name: 'dark',
		'--background-color': '#333',
		'--heading-color': '#f7f7f7',
		'--font-color': '#f7f7f7',
		'--subheading-color': '#ccc',
		'--font-family': "'Palatino', 'Helvetica Neue', Arial, sans-serif",
	},
	{
		name: 'light',
		'--background-color': '#f7f7f7',
		'--heading-color': '#333',
		'--font-color': '#333',
		'--subheading-color': '#666',
		'--font-family': "'Palatino', 'Helvetica Neue', Arial, sans-serif",
	},
];
// const addThemeButton = document.getElementById('add-button');
let option1 = document.createElement('option');
option1.value = 'dark';
option1.innerHTML = 'dark';
themePicker.appendChild(option1);
let option2 = document.createElement('option');
option2.value = 'light';
option2.innerHTML = 'light';
themePicker.appendChild(option2);

const root = document.documentElement;
const changePageTheme = (themeName) => {
	const styleObj = themes.filter((obj) => obj.name === themeName)[0];
	root.style.setProperty(
		'--background-color',
		styleObj['--background-color']
	);
	root.style.setProperty('--heading-color', styleObj['--heading-color']);
	root.style.setProperty('--font-color', styleObj['--font-color']);
	root.style.setProperty(
		'--subheading-color',
		styleObj['--subheading-color']
	);
	root.style.setProperty('--font-family', styleObj['--font-family']);
};

themePicker.addEventListener('change', (e) => {
	changePageTheme(e.target.value);
});

const themeForm = document.getElementById('theme-form');
themeForm.addEventListener('submit', (e) => {
	e.preventDefault();
	themes.push({
		name: themeNameInput.value,
		'--background-color': backgroundColorInput.value,
		'--heading-color': textColorInput.value,
		'--font-color': textColorInput.value,
		'--subheading-color': textColorInput.value,
		'--font-family': fontStyleSelect.value,
	});
	let option = document.createElement('option');
	option.value = themeNameInput.value;
	option.innerHTML = themeNameInput.value;
	themePicker.appendChild(option);
	themePicker.value = option.value;
	changePageTheme(option.value);
});
