const date = function() {
    const today = new Date();

    const options = {
        weekday: "short",
        day: "numeric",
        month: "long"
    }
    
    return today.toLocaleDateString("en-US", options)
}

const day = function() {
    const today = new Date();

    const options = {
        weekday: "long"
    }
    
    return today.toLocaleDateString("en-US", options)
}

module.exports = {date: date, day: day}
