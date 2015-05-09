var config = { // TODO: Get from npm config
    server: 'http://localhost:9292',
    imageFile: '/tmp/capture.jpg',
    captureCmd: 'raspistill',
    // config.imageFile will be append to the args
    captureArgs: '--metering matrix -w 1920 -h 1080 -q 100 -t 999999999 -tl 1000 -n --output'
}

var socket = require('socket.io-client')(config.server),  // TODO: pull from config file
    fs = require('fs'),
    semver = require('semver'),
    c = require('./common'),
    version = semver.clean(require('../package.json').version),
    watcher

socket.on('connect', function() {
    console.log('Connected')
})

socket.on('hello', function(data) {
    if (c.version_compatible(version, data.version)) {
        socket.emit('register', { version: version })
    } else {
        throw 'Incompatible Version: ' + data.version
    }
})

socket.on('ready', function () {
    // Start raspistill
    watcher = fs.watch(config.imageFile, function (evt) {
        if (evt !== 'change') {
            return
        }

        fs.readFile(config.imageFile, function (err, data) {
            if (err) {
                console.warn(err)
                return
            }

            socket.emit('image', data)
        })
    })
})

socket.on('error', function(data) {
    console.warn(data)
})

socket.on('disconnect', function() {
    watcher.close()
    // Shutdown Raspistill
    console.log('Disconnected')
})