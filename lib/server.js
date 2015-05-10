var config = {
    portNumber: 9292,
    filePrefix: 'capture',
    fileExtension: '.jpg',
    storagePath: './images'
}

var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    semver = require('semver'),
    version = semver.clean(require('../package.json').version),
    c = require('./common'),
    fs = require('fs')

console.log('Listening on 9292')
server.listen(config.portNumber)

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html')
})

io.on('connection', function (socket) {
    socket.emit('hello', { version: version })
    socket.on('register', function (data) {
        if (!c.version_compatible(version, data.version)) {
            socket.emit('error', 'incompatible version')
            return
        }

        socket.on('image', function (data) {
            var timestamp = Date.now() / 1000 | 0  // Timestamp in seconds
            var filename = config.storagePath + '/' + config.filePrefix + '-' + timestamp.toString() + config.fileExtension
            fs.writeFile(filename, data, function (err) {
                if (err) {
                    console.warn(err);
                    return
                }
                console.log('saved ' + filename)
                socket.broadcast.emit('new-image', filename)
            })
        })
        socket.emit('ready')
    })

})
