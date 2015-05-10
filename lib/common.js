var semver = require('semver')

module.exports = {
    version_compatible: function (lhs, rhs) {
        var lver = '~' + semver.major(lhs)
        console.log(rhs + ' = ' + lver)
        return semver.satisfies(rhs, lver) 
    }
}
