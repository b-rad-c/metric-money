import { Transaction } from '../DataGenerator'

const ImperialMoney = {
    transportationCost: 929.67,
    transportationDue: 5,
    medicalCost: 515.75,
    medicalDue: 10,
    childCareCost: 1571.25,
    childCareDue: 15,
    internetMobileCost: 179.92,
    internetMobileDue: 20,
    extraDay: false,
    fitToScreen: true,
    housingCost: 2005.33,
    housingDue: 1,
    name: 'Imperial money',
    salary: 84844,
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
    unexpectedTrans:[]
}

const MetricMoney = {
    transportationCost: 929.67,
    transportationDue: 5,
    medicalCost: 515.75,
    medicalDue: 10,
    childCareCost: 1571.25,
    childCareDue: 15,
    internetMobileCost: 179.92,
    internetMobileDue: 20,
    extraDay: false,
    fitToScreen: true,
    housingCost: 2005.33,
    housingDue: 1,
    name: 'Metric money',
    salary: 84844,
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
    unexpectedTrans: []
}

const MetricMoney2 = {
    transportationCost: 929.67,
    transportationDue: 5,
    medicalCost: 515.75,
    medicalDue: 10,
    childCareCost: 1571.25,
    childCareDue: 15,
    internetMobileCost: 179.92,
    internetMobileDue: 20,
    extraDay: false,
    fitToScreen: true,
    housingCost: 2005.33,
    housingDue: 1,
    name: 'Metric money - expenses',
    salary: 84844,
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
    ]
}

const PresetList = [ImperialMoney, MetricMoney, MetricMoney2]

export default PresetList
