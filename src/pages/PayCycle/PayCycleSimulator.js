import { add, format } from 'date-fns'
import { chunk, reduce } from 'lodash'

export class Bill {
    constructor(name, amount, dayOfMonth) {
        this.name = name
        this.amount = amount
        this.dayOfMonth = dayOfMonth
        this.perSec = monthlyToStreaming(amount)
        this.dailyTotalStreaming = this.perSec * secondsPerDay
    }
}

export class BillList {
    constructor(bills) {
        this.bills = bills
        this.lookup = {}
        for (let i = 0; i < 27; i++) {
            this.lookup[i] = []
        }
        this.bills.forEach((bill) => {
            this.lookup[bill.dayOfMonth].push(bill)
        })

        this.dailyTotalStreaming = reduce(bills, (acc, bill) => { return acc + bill.dailyTotalStreaming }, 0)

    }

    dailyTotalNonStreaming(dayOfMonth) {
        return reduce(this.lookup[dayOfMonth], (acc, bill) => { return acc + bill.amount }, 0)
    }
}

export class Transaction {
    constructor(name, amount, date) {
        this.name = name
        this.amount = amount
        // date is in string form of chart label so that clicking on chart can efficiently generate a Transaction
        // ex: "Jan 1, 2022"
        this.date = date    
    }
}

export class TransactionList {
    constructor(transactions) {
        this.transactions = transactions
        this.lookup = {}
        transactions.forEach((t) => {
            if (typeof this.lookup[t.date] === 'undefined') {
                this.lookup[t.date] = [t]
            } else {
                this.lookup[t.date].push(t)
            }
        })
    }

    dailyTotal(date) {
        const today = this.lookup[date]
        console.log('today', today)
        if(typeof today === 'undefined') {
            return 0
        }else{
            return reduce(today, (acc, trans) => { return acc + trans.amount }, 0)
        }
    }
}

const secondsPerDay = 60 * 60 * 24
const secondsPerYear = secondsPerDay * 365


function annualToStreaming(num) {
    return num / secondsPerYear
}

function monthlyToStreaming(num) {
    return (num * 12) / secondsPerYear
}


export function generator(startDate, startBalance, useStreaming, salary, bills, transactions, numDays) {
    // payrate is calculated daily for streaming and bi weekly otherwise
    const payRate = (useStreaming) ? annualToStreaming(salary) * secondsPerDay : salary / 26
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
        
        // salary
        if(useStreaming) {
            balance += payRate
        }else if(date.getDay() === 5) {
            if(isPayWeek) {
                balance += payRate
                payChecks.push(label)
            }
            isPayWeek = !isPayWeek
        }
        
        // subtract today's bills
        if(useStreaming) {
            balance -= bills.dailyTotalStreaming
        }else{
            balance -= bills.dailyTotalNonStreaming(dayOfMonth)
        }
        
        balance -= transactions.dailyTotal(label)
        
        // store ticks for the first of the month
        if(dayOfMonth === 1) {
            months.push(label)
        }

        balanceData.push({balance: balance, label: label})
        
        date = add(date, {days: 1})
    }

    return { balanceData, payChecks, months, bkgdIntervals: chunk(months, 2), finalBalance: balance }
}

