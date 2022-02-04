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

    for (let i = 0; i < 115; i++) {
        console.debug(date)
        balance += (inPerSec * secPer.Day) - (outPerSec * secPer.Day)

        outputData.push(balance)
        /*let dateNum = date.getDate()
        let dayOfYear = format(date, 'D', { useAdditionalDayOfYearTokens: true })
        let displayDate = (dateNum % 5 === 0)
        let outLabel = (displayDate) ? format(date, 'LLL MM') : ''
        console.log(dateNum, displayDate, outLabel, dayOfYear)*/
        outputLabels.push(format(date, 'MMM	d'))
        
        date = add(date, {days: 1})
    }

    return {data: outputData, labels: outputLabels}
}