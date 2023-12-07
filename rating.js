class RatingWidget extends HTMLElement {
	static observedAttributes = ['data-stars'];

	constructor() {
		super();

		this.starNodes = [];
		this.starField = document.createElement('div');
		this.errorMsg = document.createElement('p');
		this.errorMsg.textContent = 'placeholder';
		this.errorMsg.classList.add('invis');
		this.feedBackMsg = document.createElement('p');
		this.feedBackMsg.textContent = 'placeholder';
		this.feedBackMsg.classList.add('invis');
		this.MIN_RATING = 1;
		this.MAX_RATING = document.getElementById('rating').max;
		this.formFields = {
			question: 'How satisfied are you?',
			rating: 0,
			sentBy: 'JS',
		};
		console.log('constructor ran');
	}
	connectedCallback() {
		// console.log({ starNodes: this.starNodes });
		const shadow = this.attachShadow({ mode: 'closed' });

		// create wrapper
		const wrapper = document.createElement('div');
		wrapper.classList.add('wrapper');

		wrapper.appendChild(this.feedBackMsg);
		this.createStars(this.MAX_RATING);
		wrapper.appendChild(this.starField);
		wrapper.appendChild(this.errorMsg);
		const style = this.getStyles();

		shadow.appendChild(wrapper);
		shadow.appendChild(style);
		// console.log('element added to DOM');
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log(
			`Attribute ${name} has changed from ${oldValue} to ${newValue}.`
		);
		if (name === 'data-stars') {
			this.createStars(newValue);
		}
	}

	disconnectedCallback = () => {
		clearTimeout(this.timeOut);
	};

	createStars = (num) => {
		for (let i = 1; i <= num; i++) {
			// create star Node, add attributes
			const starNode = document.createElement('span');
			starNode.id = i;
			starNode.classList.add('star');
			starNode.innerHTML = '&#9733;';

			// add to starNodes list and to wrapper as child
			this.starNodes.push(starNode);
			this.starField.appendChild(starNode);
			// add listener on mouseover
			starNode.addEventListener('mouseover', (e) => {
				this.formFields.rating = starNode.id;
				for (let i = 0; i < starNode.id; i++) {
					this.starNodes[i].classList.add('hovered');
				}
				for (let i = starNode.id; i < this.starNodes.length; i++) {
					this.starNodes[i].classList.remove('hovered');
				}
			});

			// add listener on click (form submit)
			starNode.addEventListener('click', (e) => {
				this.submitForm();
			});
		}
	};

	submitForm = async () => {
		if (
			this.formFields.rating < this.MIN_RATING ||
			this.formFields.rating > this.MAX_RATING
		) {
			this.errorMsg.textContent = 'Oops... Please Select Your Rating :)';
			this.errorMsg.classList.add('error');
			const timeOut = setTimeout(() => {
				this.errorMsg.classList.remove('error');
			}, 3000);
			return;
		}

		if (this.formFields.rating >= this.MAX_RATING * 0.8) {
			this.feedBackMsg.textContent = `Thanks for the ${this.formFields.rating}-star rating!`;
		} else {
			this.feedBackMsg.textContent = `Thanks for a rating of ${
				this.formFields.rating
			} star${
				this.formFields.rating > 1 ? 's' : ''
			}. We will try to do better!`;
		}
		this.feedBackMsg.classList.add('feedback');
		this.timeOut = setTimeout(() => {
			this.feedBackMsg.classList.remove('feedback');
		}, 3000);

		try {
			// console.log({ formFields: this.formFields });
			let formBody = [];
			for (let property in this.formFields) {
				let encodedKey = encodeURIComponent(property);
				let encodedValue = encodeURIComponent(
					this.formFields[property]
				);
				formBody.push(encodedKey + '=' + encodedValue);
			}
			formBody = formBody.join('&');

			const res = await fetch('https://httpbin.org/post', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Sent-By': 'JS',
				},
				body: formBody,
			});
			// console.log({ res });
			const resJson = await res.json();
			console.log({ resJson });
			// console.log(`send request with rating ${this.request.rating}:>`);
		} catch (e) {
			console.log(e);
			this.errorMsg.textContent =
				'Oops... There was an error with the server.';
			this.errorMsg.classList.add('error');
			const timeOut = setTimeout(() => {
				this.errorMsg.classList.remove('error');
			}, 3000);
		}
	};

	getStyles = () => {
		const style = document.createElement('style');
		style.textContent = `
            .wrapper {
                cursor: pointer;
            }
            .star {
                font-size: 2rem;
                margin: 0 0.1rem;
                color: var(--font-color);
            }
            .hovered {
                color: var(--star-color);
            }
            .invis {
                visibility: hidden;
            }
            .error {
                visibility: unset;
                color: var(--error-color);
                animation: fadeOut 3s ease-in-out;
            }
            .feedback {
                visibility: unset;
                color: var(--font-color);
                animation: fadeOut 3s ease-in-out;
            }

            @keyFrames fadeOut {
                0% {
                    opacity: 1;
                }
                70% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
            }
        `;
		return style;
	};
}

customElements.define('rating-widget', RatingWidget);
