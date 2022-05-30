//FDM
const timeSegments = [
    {
        conversionConstant: 86400000,
        identifier: "d"
    },
    {
        conversionConstant: 3600000,
        identifier: "h"
    },
    {
        conversionConstant: 60000,
        identifier: "min"
    },
    {
        conversionConstant: 1000,
        identifier: "sec"
    }
]

exports.relativeTime = (timeStampInMs) => {
    let remainder = Date.now() - timeStampInMs

    let vals = []
    for (segment of timeSegments) {
        const quotient = Math.round(remainder / segment.conversionConstant, 0)
        if (quotient != 0) vals.push(quotient + segment.identifier)
        remainder = remainder % segment.conversionConstant
    }

    vals = vals.splice(0, 2)

    return vals.join(' ')
}