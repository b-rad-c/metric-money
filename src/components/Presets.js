import { Transaction } from '../DataGenerator'

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
    useInflation: true,
    inflationRate: 0.020,
    borrowRate: 0.17,
    savingsRate: 0.005,
    startBalance: 1000,
    startDate: new Date('Jan 01, 2022'),
    streamIncoming: false,
    streamOutgoing: false,
    unexpectedTrans:[],
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
    useInflation: true,
    inflationRate: 0.020,
    borrowRate: 0.17,
    savingsRate: 0.005,
    startBalance: 1000,
    startDate: new Date('Jan 01, 2022'),
    streamIncoming: true,
    streamOutgoing: true,
    unexpectedTrans: [],
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
    useInflation: false,
    inflationRate: 0.035,
    borrowRate: 0.17,
    savingsRate: 0.005,
    startBalance: 1000,
    startDate: new Date('Jan 01, 2022'),
    streamIncoming: true,
    streamOutgoing: true,
    unexpectedTrans: [
        new Transaction('UNEXPECTED EXPENSE', 500, 'May 10, 2022'),
        new Transaction('UNEXPECTED EXPENSE', 500, 'Sep 1, 2022')
    ],
    waterCost: 100,
    waterDue: 25
}

const PresetList = [ImperialMoney, MetricMoney, MetricMoney2]

export default PresetList
