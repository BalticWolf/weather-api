$(document).ready(function() {
    $('#city-form').submit(function(e) {
        e.preventDefault();

        var city = $('#city-name').val();
        $.ajax( config.apiURL + '/data/2.5/weather?q=' + city + '&appid=' + config.apiKey, {
            method: 'GET',
            success: function(response) {
                displayWeather(response);
            },
            error: function(err) {
                console.log('ERROR!', err);
            }
        });
        $.ajax( config.apiURL + '/data/2.5/forecast/daily?q=' + city + '&cnt=7&appid=' + config.apiKey, {
            method: 'GET',
            success: function(response) {
                displayForecast(response);
            },
            error: function(err) {
                console.log('ERROR!', err);
            }
        });
    });
});

function displayWeather(json) {
    $('#city-name-title').text(json.name);
    var mapUrl = config.googleMapUrl +
        '/staticmap?center=' + json.coord.lat + ',' + json.coord.lon +
        '&size=200x200&zoom=10&key=' + config.googleApiKey;

    $('#city-map').attr('src', mapUrl);

    $('#temperature').text(kelvinToCelcius(json.main.temp) + '°C');
    $('#temperature-icon').attr('src', config.iconSrc + json.weather[0].icon + '.png');
    $('#dt-time').text(timeConverter(json.dt));
    $('#sunrise').text(timeConverter(json.sys.sunrise));
    $('#sunset').text(timeConverter(json.sys.sunset));
    $('#humidity').text(json.main.humidity + '%');
    $('#pressure').text(json.main.pressure + ' hPa');
    $('#wind-speed').text(json.wind.speed + ' km/h');

    $('#current-weather .content').show();
}

function displayForecast(json) {
    $('#forecast .content').html('');

    var today = new Date();
    for(var i = 1; i < json.list.length; i++) {
        var date = daysOfWeek[(today.getDay() + i) % daysOfWeek.length];
        $('#forecast .content').append(
            '<p class="left">' +
            '<strong>' + date + ':</strong>' +
            '<img src ="' + config.iconSrc + json.list[i].weather[0].icon + '.png" />' +
            '</p>'
        );
    }
}

function kelvinToCelcius(temp) {
    return Math.round((temp - 273.15)*10)/10;
}

function timeConverter(unix_timestamp) {
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp*1000);
// Hours part from the timestamp
    var hours = date.getHours();
// Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();

// Will display time in 10:30 format
    return hours + ':' + minutes.substr(-2);
}
