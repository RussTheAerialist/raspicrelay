var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    semver = require('semver'),
    version = semver.clean(require("../package.json").version),
    fs = require('fs')

console.log('Listening on 9292')
server.listen(9292)

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html')
})

io.on('connection', function (socket) {
    socket.emit('hello', { version: version })
    socket.on('register', function (version) {
        // Version checking
        socket.on('image', function (data) {
            // TODO: determine filename
            var filename = 'tmp/incoming.jpg'
            fs.writeFile(filename, data, function (err) {
                if (err) {
                    console.warn(err);
                    return
                }
                console.log('saved ' + filename)
            })
        })
        socket.emit('ready')
    })

})
