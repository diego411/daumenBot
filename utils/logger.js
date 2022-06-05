exports.log = (msg) => {
    let date_ob = new Date();
    let timestamp = date_ob.getFullYear() + "-" +
        ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" +
        ("0" + date_ob.getDate()).slice(-2) + " " +
        date_ob.getHours() + ":" +
        date_ob.getMinutes() + ":" +
        date_ob.getSeconds()
    console.log("[" + timestamp + "]" + " " + JSON.stringify(msg))
}

exports.logAxiosError = (error) => {
    let errMsg
    try {
        errMsg = `${error.code} for ${error.config.method.toUpperCase()} request on url: ${error.config.url}`
        this.log(errMsg)
    } catch (e) {
        this.log(`Could not parse axios error.`)
    }
}