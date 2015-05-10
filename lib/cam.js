var spawn = require('child_process').spawn

function Camera(binPath, args, imageFile) {
    if (!(this instanceof Camera)) {
        return new Camera(binPath, args, imageFile);
    }

    this.started = false
    this._binPath = binPath
    this._args = (args + ' ' + imageFile).split(' ')
    this.imageFile = imageFile
    this._process = null

}

Camera.prototype._spawn = function() {
    var self = this
    this._process = spawn(this._binPath, this._args, {
        stdio: 'ignore'
    })
    this._process.on('exit', function() {
        if (self.started) {
            console.log('Unexpected Exit, Restarting Camera')
            self._spawn()
        }
    })
}

Camera.prototype.start = function() {
    if (this.started) {
        return
    }
    this.started = true
    this._spawn()
}

Camera.prototype.stop = function() {
    if (!this.started) {
        return
    }
    this.started = false
    this._process.kill()
    this._process = null
}

module.exports = Camera
