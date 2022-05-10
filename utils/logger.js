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