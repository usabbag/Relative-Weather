const openWeatherMapApiKey = "af7f00c3775786313533a8912bbdb3c3";
let latitude = null;
let longitude = null;

function showPosition(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	getWeatherData();
}

function getYesterdayTemperature(latitude, longitude, yesterday) {
  const yesterdayTimestamp = Math.floor(yesterday.getTime() / 1000);
  const yesterdayEndpointUrl = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${yesterdayTimestamp}&appid=${openWeatherMapApiKey}&units=metric`;

  return fetch(yesterdayEndpointUrl)
    .then(response => response.json())
    .then(data => {
      return data.current.temp;
    })
    .catch(error => {
      console.log(error);
    });
}

function getWeatherData() {
  let endpointUrl = "https://api.openweathermap.org/data/2.5/weather?";

  const city = document.querySelector("#city-input").value;
  if (!city) {
    console.log("No city name provided");
    return;
  }

  endpointUrl += `q=${city}&appid=${openWeatherMapApiKey}&units=metric`;

  fetch(endpointUrl)
    .then(response => response.json())
    .then(data => {
      const currentTemperature = Math.round(data.main.temp);

      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      getYesterdayTemperature(data.coord.lat, data.coord.lon, yesterday)
        .then(yesterdayTemperature => {
          const yesterdayTemperatureRounded = Math.round(yesterdayTemperature);
          let temperatureDifference = currentTemperature - yesterdayTemperatureRounded;
          let temperatureDifferenceString = '';

          if (temperatureDifference > 0) {
            temperatureDifferenceString = `+${temperatureDifference.toFixed(0)}&#8451; warmer than yesterday at the same time`;
          } else if (temperatureDifference < 0) {
            temperatureDifferenceString = `${temperatureDifference.toFixed(0)}&#8451; colder than yesterday at the same time`;
          } else {
            temperatureDifferenceString = 'the same as yesterday at the same time';
          }

          const temperatureText = `<span>Currently ${currentTemperature}&#8451; or ${temperatureDifferenceString}.</span><p>Dress accordingly!</p>`;


          document.querySelector("#temperature").innerHTML = temperatureText;

        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
}

document.querySelector('#locate-button').addEventListener('click', getWeatherData);
document.querySelector('form').addEventListener('submit', event => {
	event.preventDefault();
	getWeatherData();
});