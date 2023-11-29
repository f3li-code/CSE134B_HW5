/*
When the user types characters that are not allowed 
flash the field and present a message that indicates 
they type an illegal character. 

Use CSS to fade the message out after a few moments 
and make sure it goes in the error message area.
*/

const MAX_LEN = 50;
const LIM_NUM = 10;
const ERROR_MAX_LEN = `Please keep the message within ${MAX_LEN} characters!`;
const ERROR_INVALID_CHAR =
	'Please do not include special characters in the message!';
const ERROR_INVALID_EMAIL = 'Please enter a valid email!';
const ERROR_BLANK = "Please don't leave me blank :<";

const errorOutputs = document.querySelectorAll('output.input-error');
const infoOutputs = document.querySelectorAll('output.input-info');

let comments = '';
const textAreaErrorOutput = errorOutputs[errorOutputs.length - 1];
const textAreaInfoOutput = infoOutputs[infoOutputs.length - 1];
const textArea = document.getElementById('comments');

const flashTextAreaErrorMsg = (errorMsg) => {
	textAreaErrorOutput.innerHTML = errorMsg;
	textAreaErrorOutput.style.visibility = 'visible';
	textAreaErrorOutput.classList.add('flash-error');
	const timeout = setTimeout(() => {
		textAreaErrorOutput.classList.remove('flash-error');
		textAreaErrorOutput.style.visibility = 'hidden';
	}, 3000);
};

const checkForError = (e) => {
	let input = e.target.value;
	if (
		(comments.length == MAX_LEN && input.length >= comments.length) ||
		input.length >= MAX_LEN + 1
	) {
		flashTextAreaErrorMsg(ERROR_MAX_LEN);
		// textArea.setCustomValidity(ERROR_MAX_LEN);
		e.target.value = comments;
		return;
	}
	if (textArea.validity.valueMissing) {
		flashTextAreaErrorMsg(ERROR_BLANK);
		textArea.setCustomValidity(ERROR_BLANK);
		textAreaInfoOutput.innerHTML =
			'Characters Left: ' + (MAX_LEN - input.length);
		return;
	} else if (!/^[^#$%&()*+\/;<=>@[\\\]^_`{|}~]+$/.test(input)) {
		flashTextAreaErrorMsg(ERROR_INVALID_CHAR);
		e.target.value = comments;
		// console.log(ERROR_INVALID_CHAR);
		return;
	} else {
		textArea.setCustomValidity('');
	}
	comments = input;
};

const updateInfoMsg = (e) => {
	let input = e.target.value;
	textAreaInfoOutput.innerHTML =
		'Characters Left: ' + (MAX_LEN - input.length);
	if (input.length == MAX_LEN) {
		textAreaInfoOutput.innerHTML = 'Character Limit!';
	} else if (MAX_LEN - input.length > LIM_NUM) {
		textAreaInfoOutput.classList.remove('warning');
	} else if (MAX_LEN - input.length <= LIM_NUM) {
		textAreaInfoOutput.classList.add('warning');
	}
};
const checkTextArea = (e) => {
	checkForError(e);
	updateInfoMsg(e);
};
textArea.addEventListener('input', checkTextArea);

const fullName = document.getElementById('name');

const checkName = (e) => {
	if (fullName.validity.valueMissing) {
		fullName.setCustomValidity(ERROR_BLANK);
	} else {
		fullName.setCustomValidity('');
	}
};
fullName.addEventListener('input', checkName);

const email = document.getElementById('email');

const checkEmail = (e) => {
	if (email.validity.valueMissing) {
		email.setCustomValidity(ERROR_BLANK);
	} else if (email.validity.typeMismatch) {
		email.setCustomValidity(ERROR_INVALID_EMAIL);
	} else {
		email.setCustomValidity('');
	}
};
email.addEventListener('input', checkEmail);

const form = document.querySelector('form');
const formErrors = [];
const formErrorsInput = document.getElementById('form-errors');

const submitButton = document.getElementById('submit');
const collectFormErrors = (e) => {
	// console.log('collect errors');
	if (textArea.validity.valueMissing) {
		formErrors.push({ Error: 'comments', Type: 'Empty' });
	}
	if (fullName.validity.valueMissing) {
		formErrors.push({ Error: 'name', Type: 'Empty' });
	}
	if (email.validity.valueMissing) {
		formErrors.push({ Error: 'email', Type: 'Empty' });
	} else if (email.validity.typeMismatch) {
		formErrors.push({ Error: 'email', Type: 'Invalid Email' });
	}
	formErrorsInput.value = JSON.stringify(formErrors);
};
submitButton.addEventListener('click', collectFormErrors);

/*
  7 hours ago
for part 3, with respect to capturing errors, should these errors only be captured if they click submit, or just in general while they type?
1 reply


  6 hours ago
The former. When they click submit, instead of sending form data, (or in addition to is fine as well) send the form_errors array in the body.
*/

const toggleButton = document.createElement('button');
toggleButton.innerHTML = '☀️';
const setTheme = (theme) => {
	const root = document.documentElement;
	if (theme === 'dark') {
		root.style.setProperty('--background-color', '#333');
		root.style.setProperty('--heading-color', '#f7f7f7');
		root.style.setProperty('--font-color', '#f7f7f7');
		root.style.setProperty('--subheading-color', '#ccc');
		toggleButton.innerHTML = '☀️';
	} else {
		root.style.setProperty('--background-color', '#f7f7f7');
		root.style.setProperty('--heading-color', '#333');
		root.style.setProperty('--font-color', '#333');
		root.style.setProperty('--subheading-color', '#666');
		toggleButton.innerHTML = '&#127769';
	}
	localStorage.setItem('theme', theme);
	savedTheme = theme;
	// console.log('saving theme');
};

let savedTheme = localStorage.getItem('theme');
if (savedTheme) {
	setTheme(savedTheme);
} else {
	savedTheme = 'dark';
}

const toggleTheme = () => {
	let theme = savedTheme === 'dark' ? 'light' : 'dark';
	setTheme(theme);
};

toggleButton.addEventListener('click', toggleTheme);
let pageHeading = document.querySelector('h1');
// console.log({ pageHeading });
pageHeading.parentNode.insertBefore(toggleButton, pageHeading.nextSibling);
