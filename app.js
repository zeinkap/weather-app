require('dotenv').config();

const   express = require('express'),
        app = express(),
        request = require('request'),
        fetch = require('node-fetch'),
        axios = require('axios');
        apiKey = process.env.API_KEY,
        PORT = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true})); 

app.get('/', (req, res) => {
    res.render('index', { response: null, err: null });
});

app.post('/', (req, res) => {
    const zipcode = req.body.zipcode;
    const url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&units=imperial&appid=${apiKey}`;
    const fetchWeather = async () => {
        try {
            const response = await axios.get(url);
            let temp = Math.round(response.data.main.temp);
            let feelsLike = Math.round(response.data.main.feels_like);
            let humidity = response.data.main.humidity;
            let windSpeed = Math.round(response.data.wind.speed);
            let weatherSite = url.slice(0, 29);

            if (response.data.main == undefined) {
                res.render('index', { data: null, err: 'Error, please try again.' });
            } else {   
                let msg = `Feels like ${feelsLike}°F | ${humidity}% humidity
                    | ${windSpeed} mph wind`;
                
                res.render('index', { msg, err: null, response, temp, weatherSite });
            }
        } catch (err) {
            console.log('Something went wrong', err);
            res.render('index', { response: null, err: 'Error, please try again.' });
        }
    }

    fetchWeather();
});

app.listen(PORT, () => {
    console.log("Listing on port 3000");
});

