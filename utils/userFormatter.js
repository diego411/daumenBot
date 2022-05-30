module.exports = function formatUser(inputtedUser) {
    inputtedUser = /(?<=\b|_)[a-z0-9]\w{0,24}\b/i.exec(inputtedUser)
    return inputtedUser
}
