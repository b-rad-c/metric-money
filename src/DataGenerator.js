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
        this.items = transactions
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

export class Generator {
    constructor() {
        this.startBalance = 0
        this.salary = 0

        this.useStreaming = false
        this.useDeFi = false

        this.tradFiCreditRate = .17
        this.tradFiSavingsRate = .007
        this.deFiCreditRate = .1
        this.deFiSavingsRate = .10
        

        this.bills = []
        this.transactions = []
    }

    configSalary(startBalance, salary) {
        this.startBalance = startBalance
        this.salary = salary
    }

    configFinance(useStreaming, useDeFi) {
        this.useStreaming = useStreaming
        this.useDeFi = useDeFi
    }

    expenses(bills, transactions) {
        this.bills = bills 
        this.transactions = transactions
    }

    run(startDate, numDays) {
        // payrate is calculated daily for streaming and bi weekly otherwise
        const payRate = (this.useStreaming) ? annualToStreaming(this.salary) * secondsPerDay : this.salary / 26
        const result = new GeneratorResult()

        result.creditRate = this.useDeFi ? this.deFiCreditRate : this.tradFiCreditRate
        result.savingsRate = this.useDeFi ? this.deFiSavingsRate : this.tradFiSavingsRate

        let date = startDate
        let balance = this.startBalance
        let isPayWeek = true

        for (let i = 0; i < numDays; i++) {
            let label = format(date, 'MMM d') + ', '+ format(date, 'yyyy')
            let dayOfMonth = date.getDate()

            if (balance < 0) {
                let charge = Math.abs(balance) * result.creditRate / 365
                result.interestPaid += charge
                balance -= charge
            }else{
                let earned = balance * result.savingsRate / 365
                result.interestEarned += earned
                balance += earned
            }
            
            // salary
            if(this.useStreaming) {
                balance += payRate
            }else if(date.getDay() === 5) {
                if(isPayWeek) {
                    balance += payRate
                    result.payChecks.push(label)
                }
                isPayWeek = !isPayWeek
            }
            
            // subtract today's bills
            if(this.useStreaming) {
                balance -= this.bills.dailyTotalStreaming
            }else{
                balance -= this.bills.dailyTotalNonStreaming(dayOfMonth)
            }
            
            balance -= this.transactions.dailyTotal(label)
            
            // store ticks for the first of the month
            if(dayOfMonth === 1) {
                result.months.push(label)
            }

            result.balanceData.push({balance: balance, label: label})
            
            date = add(date, {days: 1})
        }

        result.finalBalance = balance
        result.finalize()
        return result
    }
}


class GeneratorResult {
    constructor() {
        this.balanceData = []
        this.payChecks = []
        this.months = []
        this.finalBalance = 0.0
        this.creditRate = 0.0
        this.interestPaid = 0.0
        this.savingsRate = 0.0
        this.interestEarned = 0.0
        this.bkgdIntervals = []
    }

    finalize() {
        this.bkgdIntervals = chunk(this.months, 2)
    }
}