import { add, format } from 'date-fns'

export const secPer = {
    Min: 60,
    Hour: 3600,
    Day: 86400,
    Year: 31536000
}

export function sampleYear() {
    const inPerSec   = .004
    const outPerSec  = .001

    let outputData = []
    let outputLabels = []

    let date = new Date('Jan 01, 2021')

    let balance = 0;

    for (let i = 0; i < 12; i++) {
        console.log(date)
        balance += (inPerSec * secPer.Day * 30) - (outPerSec * secPer.Day * 30)

        outputData.push(balance)
        outputLabels.push(format(date, 'MM'))
        
        date = add(date, {months: 1})
    }

    return {data: outputData, labels: outputLabels}
}