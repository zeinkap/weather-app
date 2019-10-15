require('dotenv').config();
const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'), //without this middleware, can't make use of req.body
        request = require('request'),
        apiKey = process.env.API_KEY,
        port = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));   

app.get('/', (req, res) => {
    res.render('index', {weather: null, error: null});
});

app.post('/', (req, res) => {
    let city = 'hartford',
        zipcode = req.body.zipcode,
        url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&units=imperial&appid=${apiKey}`
    request(url, (err, response, body) => {
        if(err) {
            res.render('index', {weather: null, error: 'Error, please try again.'});
            console.log(err);
        } else {
            let weather = JSON.parse(body); // parsing json into js object so we can use dot notation to access properties
            if(weather.main == undefined) {
                res.render('index', {weather: null, error: 'Error, please try again.'});
            } else {    
                let weatherMessage = `It's ${weather.main.temp}°F, humidity of ${weather.main.humidity}% and ${weather.wind.speed}mph wind in ${weather.name}.`;
                res.render('index', {weather: weatherMessage, error: null});
            }
        }
    });
});

app.listen(port, () => {
    console.log("Listing on port 3000");
});

