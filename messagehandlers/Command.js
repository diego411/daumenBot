module.exports = class Command {

    constructor(name, code, args, channel, user, adminRequired, tagUser) {
        this.name = name
        this.code = code
        this.args = args
        this.channel = channel
        this.user = user
        this.adminRequired = adminRequired
        this.tagUser = tagUser
    }

    execute() {
        if (this.adminRequired && !isAdmin(this.args['user_id'])) return null
        return this.code({ user: this.user, args: this.args })
    }
}

const isAdmin = (id) => {
    return (id === '124776535' || id === '150819483' || id === '275711366' || id === '151035078')
}