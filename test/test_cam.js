// jshint mocha: true
// jshint unused: false
// jshint expr: true

var should = require("should"),
    Camera = require("../lib/cam"),
    fs = require("fs"),
    MockCamera = Camera("touch", "", "/tmp/capture.jpg")


describe("Camera", function() {
    describe("#start()", function() {
        it("should set .started to true", function() {
            MockCamera.start()
            MockCamera.started.should.be.true
            MockCamera.stop()
        })
        it("should execute the process", function(done) {
            MockCamera.start()
            fs.exists(MockCamera.imageFile, function(exists) {
                MockCamera.stop()
                exists.should.be.true
                done()
            })
        })
    })
    describe("#stop()", function() {
        it("should set .started to false", function() {
            MockCamera.start()
            MockCamera.started.should.be.true
            MockCamera.stop()
            MockCamera.started.should.be.false
        })
    })
})
