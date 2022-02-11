import { add, format } from 'date-fns'

export const secPer = {
    Min: 60,
    Hour: 3600,
    Day: 86400,
    Year: 31536000
}

export function Transaction(name, amount, freq, options) {
    /*
        name: <str>
        amount: <int>
        freq: <string> <num><s|m|h|d> 

        options:
            offset: <int>       number of transactions to skip
            monthly: <int>      day of month transaction occurs on
            weekly: <str>       'Mon', 'Fri'
            biWeekly: <str>     'Mon', 'Tue'
    */
}

export function generator(config) {
    /*exampleConfig = {
        inPerSec: .004,
        outPerSec: .001,
        startDate: new Date('Jan 01, 2021'),
        startBalance: 0
    }*/

    let date = config.startDate
    let balance = config.startBalance;

    let outputData = []
    let outputLabels = []

    for (let i = 0; i < 115; i++) {
        console.debug(date)
        balance += (config.inPerSec * secPer.Day) - (config.outPerSec * secPer.Day)

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