import { Transaction, TransactionList } from '../DataGenerator'

const ImperialMoney = {
    carCost: 250,
    carDue: 5,
    electricCost: 150,
    electricDue: 15,
    extraDay: false,
    fitToScreen: true,
    housingCost: 1000,
    housingDue: 1,
    name: 'Imperial money',
    salary: 19000,
    showPayCheckLines: true,
    simDuration: {
        years: 1
    },
    stableCurrency: false,
    startBalance: 1000,
    startDate: new Date('Jan 01, 2022'),
    streamIncoming: false,
    streamOutgoing: false,
    unexpectedTrans: new TransactionList([]),
    useDeFi: false,
    waterCost: 100,
    waterDue: 25
}

const MetricMoney = {
    carCost: 250,
    carDue: 5,
    electricCost: 150,
    electricDue: 15,
    extraDay: false,
    fitToScreen: true,
    housingCost: 1000,
    housingDue: 1,
    name: 'Metric money',
    salary: 19000,
    showPayCheckLines: true,
    simDuration: {
        years: 1
    },
    stableCurrency: false,
    startBalance: 1000,
    startDate: new Date('Jan 01, 2022'),
    streamIncoming: true,
    streamOutgoing: true,
    unexpectedTrans: new TransactionList([]),
    useDeFi: false,
    waterCost: 100,
    waterDue: 25
}

const MetricMoney2 = {
    carCost: 250,
    carDue: 5,
    electricCost: 150,
    electricDue: 15,
    extraDay: false,
    fitToScreen: true,
    housingCost: 1000,
    housingDue: 1,
    name: 'Metric money - expenses',
    salary: 19000,
    showPayCheckLines: true,
    simDuration: {
        years: 1
    },
    stableCurrency: false,
    startBalance: 1000,
    startDate: new Date('Jan 01, 2022'),
    streamIncoming: true,
    streamOutgoing: true,
    unexpectedTrans: new TransactionList([
        new Transaction('UNEXPECTED EXPENSE', 500, 'May 10, 2022'),
        new Transaction('UNEXPECTED EXPENSE', 500, 'Sep 1, 2022')
    ]),
    useDeFi: false,
    waterCost: 100,
    waterDue: 25
}

const stableCurrency = {
    carCost: 250,
    carDue: 5,
    electricCost: 150,
    electricDue: 15,
    extraDay: false,
    fitToScreen: true,
    housingCost: 1000,
    housingDue: 1,
    name: 'Stable currency',
    salary: 19000,
    showPayCheckLines: true,
    simDuration: {
        years: 1
    },
    stableCurrency: true,
    startBalance: 1000,
    startDate: new Date('Jan 01, 2022'),
    streamIncoming: true,
    streamOutgoing: true,
    unexpectedTrans: new TransactionList([]),
    useDeFi: false,
    waterCost: 100,
    waterDue: 25
}

const decentralizedFinanace = {
    carCost: 250,
    carDue: 5,
    electricCost: 150,
    electricDue: 15,
    extraDay: false,
    fitToScreen: true,
    housingCost: 1000,
    housingDue: 1,
    name: 'Decentralized Finanace',
    salary: 19000,
    showPayCheckLines: true,
    simDuration: {
        years: 10
    },
    stableCurrency: true,
    startBalance: 1000,
    startDate: new Date('Jan 01, 2022'),
    streamIncoming: true,
    streamOutgoing: true,
    unexpectedTrans: new TransactionList([]),
    useDeFi: true,
    waterCost: 100,
    waterDue: 25
}

const PresetList = [ImperialMoney, MetricMoney, MetricMoney2, stableCurrency, decentralizedFinanace]

export default PresetList
