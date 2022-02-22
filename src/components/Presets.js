import { TransactionList } from "../DataGenerator"

const DefalultPreset = {
    name: "Default",
    streamIncoming: false,
    streamOutgoing: false,
    useDeFi: false,
    startDate: new Date('Jan 01, 2022'),
    simDuration: {years: 1},
    salary: 19000,
    startBalance: 200,
    showPayCheckLines: true,
    fitToScreen: false,
    unexpectedTrans: new TransactionList([]),
    housingCost: 1000,
    housingDue: 1,
    carCost: 250,
    carDue: 5,
    electricCost: 150,
    electricDue: 15,
    waterCost: 100,
    waterDue: 25
}

const TestPreset = {
    name: "Test",
    streamIncoming: false,
    streamOutgoing: false,
    useDeFi: false,
    startDate: new Date('Jan 01, 2022'),
    simDuration: {years: 1},
    salary: 50000,
    startBalance: 200,
    showPayCheckLines: true,
    fitToScreen: false,
    unexpectedTrans: new TransactionList([]),
    housingCost: 1000,
    housingDue: 1,
    carCost: 250,
    carDue: 5,
    electricCost: 150,
    electricDue: 15,
    waterCost: 100,
    waterDue: 25
}

const PresetList = [DefalultPreset, TestPreset]

export default PresetList
