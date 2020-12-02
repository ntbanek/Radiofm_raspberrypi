const radio = require('./radio'); //serwer, który tylko nasłuchuje

radio.set('port', process.env.PORT || 8080);

const server = radio.listen(radio.get('port'), () => {
    console.log(`Listening on ${ server.address().port }`);
});