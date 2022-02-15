import { add, format } from 'date-fns'
import { chunk, reduce } from 'lodash'

export function Bill(name, amount, dayOfMonth) {
    this.name = name
    this.amount = amount
    this.dayOfMonth = dayOfMonth
}

export function BillList(bills) {
    this.bills = bills
    this.lookup = {}
    for (let i = 0; i < 27; i++) {
        this.lookup[i] = []
    }
    this.bills.forEach((bill) => {
        this.lookup[bill.dayOfMonth].push(bill)
    })

    this.totalForDay = function(dayOfMonth) {
        return reduce(this.lookup[dayOfMonth], (acc, bill) => { return acc + bill.amount }, 0)
    }

}


export function generator(startDate, startBalance, payAmount, bills, numDays) {
    let date = startDate
    let balance = startBalance
    let balanceData = []
    let months = []
    let payChecks = []
    let isPayWeek = true
    let label = ''
    let dayOfMonth = 0

    for (let i = 0; i < numDays; i++) {
        label = format(date, 'MMM d') + ', '+ format(date, 'yyyy')
        dayOfMonth = date.getDate()
        
        // if it's friday and pay week
        if(date.getDay() === 5) {
            if(isPayWeek) {
                balance += payAmount
                payChecks.push(label)
            }
            isPayWeek = !isPayWeek
        }
        
        // subtrackt todays bills
        balance += -1 * bills.totalForDay(dayOfMonth)
        
        // store ticks for the first of the month
        if(dayOfMonth === 1) {
            months.push(label)
        }

        balanceData.push({balance: balance, label: label})
        
        date = add(date, {days: 1})
    }

    return { balanceData, payChecks, months, bkgdIntervals: chunk(months, 2) }
}

