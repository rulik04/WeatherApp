const loadingIndicator = document.getElementById('loadingIndicator');
const weatherContainer = document.getElementById('weatherContainer');

function showLoading() {
    loadingIndicator.style.display = 'block';
    weatherContainer.style.display = 'none';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
    weatherContainer.style.display = 'block';
}


const fetchWeatherData = async (city) => {
    try {
        showLoading();
        const response = await fetch("/weather", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                city: city,
            })
        });
  
        if (!response.ok) {
            console.error('Error:', response.status, response.statusText);
            return null;
        }
  
        const data = await response.json();
        console.log(data.airPollution);
        
        return data;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
    finally {
        hideLoading();
    }
  };
  
  const defaultCity = "Astana";
  
  fetchWeatherData(defaultCity)
    .then(data => {
        if (data) {
          update(data)
        }
    });
  
  
  const form = document.getElementById("formCityName");
  form.addEventListener("submit", async function(event) {
    event.preventDefault();
  
  
      const cityName = document.getElementById("cityName").value;
  
      const data = await fetchWeatherData(cityName);
        if (data) {
            update(data)
          
    }
  });
  
  
    function update(data) {
        console.log(data);
        document.getElementById('temp').innerHTML = `${data.currentWeather.main.temp}°C`;
        document.getElementById('name').innerHTML = `${data.currentWeather.name}`;
        document.getElementById('desc').innerHTML = `${data.currentWeather.weather[0].description}`;
        document.getElementById('date').innerHTML = `${new Date(data.currentWeather.dt * 1000).toLocaleDateString()}`;
        document.getElementById('mainIcon').src = `http://openweathermap.org/img/w/${data.currentWeather.weather[0].icon}.png`
        document.getElementById('name').innerHTML = `${data.currentWeather.name}, ${data.currentWeather.sys.country}, [${data.currentWeather.coord.lat}, ${data.currentWeather.coord.lon}]`;
        document.getElementById('time').innerHTML = `${new Date(data.timezone.timestamp * 1000).toLocaleTimeString()}, ${data.timezone.abbreviation}`;
        const forecastList = data.forecast.list.filter((forecast, index) => index % 9 === 0).slice(0, 5);
        const forecastListContainer = document.getElementById('forecastList');
        forecastListContainer.innerHTML = '';
        forecastList.forEach(forecast => {
            const temperature = forecast.main.temp;
            const date = new Date(forecast.dt * 1000);
            
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    
            const listItem = document.createElement('li');
            listItem.classList.add('card-item', 'd-flex', 'align-items-center', 'justify-content-between', 'mx-4', 'mediaLi');
            listItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <span>
                        <i class="bi bi-brightness-alt-high fs-2 me-2"></i>
                    </span>
                    <span>
                        <p class="pt-3">${temperature}&deg;</p>
                    </span>
                </div>
                <p class="pt-3">${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}</p>
                <p class="pt-3">${dayOfWeek}</p>
            `;
    
            forecastListContainer.appendChild(listItem);            
        });

        document.getElementById("so2").innerHTML = `${data.airPollution.list[0].components.so2}`;
        document.getElementById("no2").innerHTML = `${data.airPollution.list[0].components.no2}`;
        document.getElementById("o3").innerHTML = `${data.airPollution.list[0].components.o3}`;
        document.getElementById("pm2_5").innerHTML = `${data.airPollution.list[0].components.pm2_5}`;


        document.getElementById("sunrise").innerHTML = `${new Date(data.currentWeather.sys.sunrise * 1000).toLocaleTimeString()}`;
        document.getElementById("sunset").innerHTML = `${new Date(data.currentWeather.sys.sunset * 1000).toLocaleTimeString()}`;

        document.getElementById("humidity").innerHTML = `${data.currentWeather.main.humidity}%`;
        document.getElementById("cloud").innerHTML = `${data.currentWeather.clouds.all}%`;
        document.getElementById("wind").innerHTML = `${data.currentWeather.wind.speed}m/s`;
        document.getElementById("feels_like").innerHTML = `${data.currentWeather.main.feels_like}`;

        let forecastListToday = data.forecast.list.slice(0, 3);
        const forecastListContainerToday = document.getElementById('times');
        forecastListContainerToday.innerHTML = '';
        forecastListToday.forEach(forecast => {
            const temperature = forecast.main.temp;
            const date = new Date(forecast.dt * 1000);
            const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const feels_like = forecast.main.feels_like;
            const wind = forecast.wind.speed;
            const icon = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
            forecastListContainerToday.innerHTML += `
                <li class="card-item-day text-center p-2">
                    <p class="">${time}</p>
                    <div class="d-flex justify-content-center">
                        <div class="me-4">
                            <img src="${icon}" alt="" srcset="" class="icon_mini">
                            <p class="">${temperature}</p>
                        </div>
                        <div class="ms-4">
                            <i class="bi bi-wind fs-2"></i>
                            <p class="">${wind} m/s</p>
                        </div>
                        <div class="ms-4">
                            <i class="bi bi-thermometer-half fs-2"></i>
                            <p class="">${feels_like}</p>
                        </div>
                    </div>
                </li>
            `
        })

        // initMap(data.currentWeather.coord.lat, data.currentWeather.coord.lon);


    const mapContainer = document.getElementById('map');
    const mapOptions = {
        center: { lat: data.currentWeather.coord.lat, lng: data.currentWeather.coord.lon },
        zoom: 10, // You can adjust the zoom level
    };

    const map = new google.maps.Map(mapContainer, mapOptions);

    // Adding a marker for the city
    const marker = new google.maps.Marker({
        position: { lat: data.currentWeather.coord.lat, lng: data.currentWeather.coord.lon },
        map: map,
        title: data.currentWeather.name,
    });


    let some = data.timezone
    console.log(some);

  }

