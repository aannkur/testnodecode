const { Timestamp } = require("bson")
// heading, about, country, pay_per_post, commission
const validate = (admin) => {
    console.log("admin=====",admin)
    error = {}
    if (!admin.heading) {
        error.heading = "Please select a Heading"
    }
    if (!admin.about) {
        error.about = "Please select a About"
    }
    if (!admin.country) {
        error.country = "Please select a Country"
    }
    if (!admin.pay_per_post) {
        error.pay_per_post = "Please select a Pay Per Post"
    }
    if (!admin.commission) {
        error.commission = "Please select a Commission"
    }

    return {
        error,
        isValid: Object.keys(error).length === 0
    }

}
module.exports = validate