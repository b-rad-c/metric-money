import { add, format } from 'date-fns'


export function generator(startDate, startBalance, payAmount, numDays) {
    let date = startDate
    let balance = startBalance
    let balanceData = []
    let months = []
    let payChecks = []
    let isPayWeek = true
    let label = ''

    for (let i = 0; i < numDays; i++) {
        label = format(date, 'MMM d')

        balanceData.push({balance: balance, label: label})
        
        // if it's friday and pay week
        if(date.getDay() === 5) {
            if(isPayWeek) {
                balance += payAmount
                payChecks.push(label)
            }
            isPayWeek = !isPayWeek
        }
        
        // store ticks for the first of the month
        if(date.getDate() === 1) {
            months.push(label)
        }
        
        date = add(date, {days: 1})
    }

    return { balanceData, months, payChecks }
}

