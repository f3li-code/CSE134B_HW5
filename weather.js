class CurrentWeather extends HTMLElement {
	constructor() {
		super();

		// results of API call stored here
		this.weeklyWeatherDataArr = [];
		// which hour of weather data to display
		this.currInd = 0;

		this.timeDisp = document.createElement('span');

		this.img = document.createElement('img');
		this.img.alt = 'weather icon';
		this.img.style.visibility = 'hidden';

		this.tempDisp = document.createElement('p');
		this.tempDisp.innerHTML = 'retrieving data...';

		this.weatherDisplay = document.createElement('div');
		this.weatherDisplay.classList.add('weatherDisplay');
		this.weatherDisplay.appendChild(this.img);
		this.weatherDisplay.appendChild(this.tempDisp);

		this.windDisp = document.createElement('p');
		this.windDisp.innerHTML = 'retrieving data...';
		this.windDisp.classList.add('center');

		this.errorMsg = document.createElement('p');
		this.errorMsg.innerHTML = '&nbsp;';
		this.errorMsg.classList.add('error');
	}

	connectedCallback() {
		const shadow = this.attachShadow({ mode: 'closed' });
		const wrapper = document.createElement('div');
		wrapper.classList.add('wrapper');

		const title = document.createElement('h3');
		title.textContent = 'San Diego ';
		title.appendChild(this.timeDisp);
		title.classList.add('center');

		wrapper.appendChild(title);
		wrapper.appendChild(this.weatherDisplay);
		wrapper.appendChild(this.windDisp);
		wrapper.appendChild(this.errorMsg);

		const styles = this.getStyles();

		shadow.appendChild(wrapper);
		shadow.appendChild(styles);

		this.sendRequest();
		this.timeInterval = setInterval(() => {
			this.updateCurrentTime();
		}, 1000);

		this.updateCurrentTime();
	}

	disconnectedCallback = () => {
		clearInterval(this.timeInterval);
		clearTimeout(this.flashTimeout);
	};

	sendRequest = async () => {
		try {
			const res = await fetch(
				'https://api.weather.gov/gridpoints/SGX/53,20/forecast/hourly',
				{
					method: 'GET',
					'Cache-Control': 'no-cache',
					Pragma: 'no-cache',
				}
			);
			const resJson = await res.json();
			console.log({ resJson });

			this.weeklyWeatherDataArr = resJson.properties.periods;
			this.currInd = 0;
			this.updateCurrentWeather();
		} catch (e) {
			console.log(e);
			this.windDisp.innerHTML = '&nbsp';
			this.tempDisp.innerHTML = '&nbsp';
			this.errorMsg.innerHTML =
				'Oops... An error occurred during an API call';
			this.errorMsg.classList.add('fade');
			this.fadeTimeOut = setTimeout(() => {
				this.errorMsg.innerHTML = '&nbsp;';
				this.errorMsg.classList.remove('fade');
			}, 3000);
		}
	};

	updateCurrentTime = () => {
		let currentTime = new Date();
		const hours = currentTime.getHours().toString().padStart(2, '0');
		const minutes = currentTime.getMinutes().toString().padStart(2, '0');
		const seconds = currentTime.getSeconds().toString().padStart(2, '0');
		const formattedTime = `${hours}:${minutes}:${seconds}`;
		this.timeDisp.textContent = formattedTime;

		if (minutes == '00' && seconds == '00') {
			// if (seconds == '00') {
			this.updateCurrentWeather();
		}
		currentTime = null;
	};

	updateCurrentWeather = () => {
		console.log('updating weather :)');
		// if no more data to be displayed, make a new request
		if (this.currInd == this.weeklyWeatherDataArr.length) {
			this.sendRequest();
			return;
		}
		const currWeatherData = this.weeklyWeatherDataArr[this.currInd++];
		const {
			shortForecast,
			temperature,
			temperatureUnit,
			windSpeed,
			windDirection,
			icon,
		} = currWeatherData;
		console.log({
			shortForecast,
			temperature,
			temperatureUnit,
			windSpeed,
			windDirection,
			icon,
		});

		let iconSrc = icon.replace(',0', '');
		if (this.img.src !== iconSrc) {
			// when the icon is the same as the previously displayed one, dont fetch another
			this.img.src = iconSrc;
			// this.img.src = 'https://api.weather.gov/icons/land/day/bkn,0?size=small';
		}
		// reveal the img when it is ready to be displayed
		this.img.style.visibility = 'unset';

		this.tempDisp.classList.add('fade');
		this.windDisp.classList.add('fade');
		this.flashTimeout = setTimeout(() => {
			this.tempDisp.innerHTML = `${shortForecast}, ${temperature}&deg;${temperatureUnit}`;
			this.windDisp.innerHTML = `wind: ${windSpeed} ${windDirection}`;
			this.tempDisp.classList.remove('fade');
			this.windDisp.classList.remove('fade');
		}, 3000);
	};

	getStyles = () => {
		const styles = document.createElement('style');
		styles.textContent = `
            .wrapper {
                border: 1px solid black;
                border-radius: 10px;
            }
            .center {
                text-align: center;
            }
            .weatherDisplay {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            img {
                border-radius: 50%;
                width: 5rem;
                height: 5rem;
            }
            .weatherDisplay p {
                display: inline;
                margin-left: 1rem;
                font-weight: bold;
            }
            .error {
                color: var(--error-color);
            }
            .fade {
                
                animation: fadeOut 3s ease-in-out;
            }

            @keyFrames fadeOut {
                0% {
                    opacity: 1;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
            }
        `;
		return styles;
	};
}

customElements.define('current-weather', CurrentWeather);
