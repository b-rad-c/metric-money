import { add, format, eachDayOfInterval } from 'date-fns'
import { chunk, reduce, initial } from 'lodash'

export class Bill {
    constructor(name, amount, dayOfMonth) {
        this.name = name
        this.amount = amount
        this.dayOfMonth = dayOfMonth
    }

    perSec() {
        return monthlyToStreaming(this.amount)
    }

    dailyTotalStreaming() {
        return this.perSec() * secondsPerDay
    }

    inflate(rate) {
        this.amount = this.amount * rate
    }

}

export class BillList {
    constructor(bills) {
        this.bills = bills
        this.lookup = {}
        for (let i = 0; i <= 27; i++) {
            this.lookup[i] = []
        }
        this.bills.forEach((bill) => {
            this.lookup[bill.dayOfMonth].push(bill)
        })

    }

    yearlyCostOfLiving() {
        return reduce(this.bills, (acc, bill) => { return acc + bill.amount }, 0) * 12
    }

    inflate(rate) {
        this.bills.forEach((bill) => bill.inflate(rate))
    }

    dailyTotalStreaming() {
        return reduce(this.bills, (acc, bill) => { return acc + bill.dailyTotalStreaming() }, 0)
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
        // ex: 'Jan 1, 2022'
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

        this.streamIncoming = false
        this.streamOutgoing = false
        this.useInflation = false

        this.borrowRate = .17
        this.savingsRate = .005
        this.inflationRate = 0.025
        
        this.fitToScreen = false

        this.bills = []
        this.transactions = []
    }

    configSalary(startBalance, salary) {
        this.startBalance = startBalance
        this.salary = salary
    }

    configFinance(streamIncoming, streamOutgoing, useInflation, inflationRate, borrowRate, savingsRate) {
        this.streamIncoming = streamIncoming
        this.streamOutgoing = streamOutgoing
        this.useInflation = useInflation
        this.inflationRate = inflationRate
        this.borrowRate = borrowRate
        this.savingsRate = savingsRate
    }

    configChart(fitToScreen) {
        this.fitToScreen = fitToScreen
    }

    expenses(bills, transactions) {
        this.bills = bills 
        this.transactions = transactions
    }

    run(startDate, duration, extraDay) {
        // payrate is calculated daily for streaming and bi weekly otherwise
        const payRate = (this.streamIncoming) ? annualToStreaming(this.salary) * secondsPerDay : this.salary / 26
        const result = new GeneratorResult()

        result.borrowRate = this.borrowRate
        result.savingsRate = this.savingsRate
        result.inflationRate = this.useInflation ? this.inflationRate : 0.0
        const dailyInflation = 1 + (result.inflationRate / 365)
        result.costOfLivingStart = this.bills.yearlyCostOfLiving()

        let balance = this.startBalance
        let isPayWeek = true

        let daysInSimulation = eachDayOfInterval({start: startDate, end: add(startDate, duration)})
        // a fiscal year by default would not include the start of the next year, so `initial` is used to remove it by default
        // but to show the unpredictabililty of finances based on the gregorian calendar allow people to choose to show the next day
        if (!extraDay) daysInSimulation = initial(daysInSimulation)
        daysInSimulation.forEach((date) => {
            let label = format(date, 'MMM d, yyyy')
            let dayOfMonth = date.getDate()
            let month = date.getMonth()

            if (balance < 0) {
                let charge = Math.abs(balance) * result.borrowRate / 365
                result.interestPaid += charge
                balance -= charge
            }else{
                let earned = balance * result.savingsRate / 365
                result.interestEarned += earned
                balance += earned
            }
            
            // salary
            if(this.streamIncoming) {
                balance += payRate
                result.totalIncome += payRate
            }else if(date.getDay() === 5) {
                if(isPayWeek) {
                    balance += payRate
                    result.totalIncome += payRate
                    result.payChecks.push(label)
                }
                isPayWeek = !isPayWeek
            }
            
            // subtract today's bills
            let bills = 0
            if(this.streamOutgoing) {
                bills += this.bills.dailyTotalStreaming()
            }else{
                bills += this.bills.dailyTotalNonStreaming(dayOfMonth)
            }
            
            bills += this.transactions.dailyTotal(label)
            balance -= bills
            result.totalBillPay += bills
            
            // determine which ticks to place on x axis,
            // choose dynamically based on length of simulation to prevent crowding
            // do not use default determinations by recharts to make sure important dates are chosen
            if(dayOfMonth === 1) {
                if(duration.years === 1 || !this.fitToScreen) {
                    // show every month if duration is 1 year
                    result.months.push(label)
    
                }else if(duration.years < 5 && [0, 3, 6, 9].indexOf(month) !== -1) {
                    // show first month of every quarter if duration is 2-4 years
                    result.months.push(label)
                }else if(duration.years >= 5 && duration.years < 10 && (month === 0 || month === 6)) {
                    // show jan and july of every year if duration is 5-9 years
                    result.months.push(label)
                }else if(duration.years === 10 && month === 0) {
                    // only show jan and july of every year if duration is 10 years
                    result.months.push(label)
                }
            }
            
            result.balanceData.push({balance: balance, label: label})

            if(dailyInflation > 0.0) this.bills.inflate(dailyInflation)
        })

        result.finalize(balance, this.bills.yearlyCostOfLiving())
        return result
    }
}


class GeneratorResult {
    constructor() {
        this.balanceData = []
        this.payChecks = []
        this.months = []
        this.finalBalance = 0.0
        this.borrowRate = 0.0
        this.interestPaid = 0.0
        this.inflationRate = 0.0
        this.savingsRate = 0.0
        this.interestEarned = 0.0
        this.bkgdIntervals = []
        this.costOfLivingStart = 0.0
        this.costOfLivingEnd = 0.0
        this.costOfLivingDiff = 0.0
        this.costOfLivingChange = 0.0
        this.totalIncome = 0.0
        this.totalBillPay = 0.0
    }

    finalize(finalBalance, costOfLivingEnd) {
        this.finalBalance = finalBalance
        this.costOfLivingEnd = costOfLivingEnd
        this.costOfLivingDiff = this.costOfLivingEnd - this.costOfLivingStart
        this.costOfLivingChange = this.costOfLivingEnd / this.costOfLivingStart
        this.bkgdIntervals = chunk(this.months, 2)
    }
}