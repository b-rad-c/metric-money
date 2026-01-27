import { add, format, formatDuration } from 'date-fns'
import { clamp } from 'lodash'
import { Stack, Button, ButtonGroup, Card, Form, Container, Row, Col, Table, FloatingLabel } from 'react-bootstrap';
import PresetList from './Presets.js';
import React from 'react';


//
// formatters
//

export function formatRate (rate) { 
    const num = rate * 100
    return num.toFixed(2) + '%' 
}

const USDFormatter = new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' })
export function formatUSD (num) { return USDFormatter.format(num) }

const ordinalFormatter = new Intl.PluralRules('en-US', { type: 'ordinal' })
const suffixes = new Map([
    ['one',   'st'],
    ['two',   'nd'],
    ['few',   'rd'],
    ['other', 'th'],
  ]);
export function formatOrdinal (num) {
    const rule = ordinalFormatter.select(num);
    const suffix = suffixes.get(rule);
    return `${num}${suffix}`;
}

//
// widgets
//

export function FinancialSituation (props) {
const simYears = props.state.simDuration.years
const startDate = props.state.startDate
const disableSubYear = simYears === 1
const disableAddYear = simYears === 10
const adjustDate = (offset) => { props.updateState('startDate', add(startDate, offset)) }
const simDurationHandler = (years) => { props.updateState('simDuration', {years: years}) }
const salaryHandler = (num) => { props.updateState('salary', props.state.salary + num) }
const startBalanceHandler = (num) => { props.updateState('startBalance', props.state.startBalance + num) }
const spacer = {marginTop: '1rem'}

return (
<Card className='bg-light bg-gradient shadow-lg' style={{ width: '33rem' }}>
    <Card.Title>Financial situation</Card.Title>
    <Card.Body>
    <Container>
            <Row style={spacer}><Col><strong>salary</strong></Col></Row>
            <Row>
                <Col className='text-end'>
                    <ButtonGroup size='sm'>
                        <Button onClick={() => { salaryHandler(-1000) }}>-$1k</Button>
                        <Button onClick={() => { salaryHandler(-100) }}>-$100</Button>
                    </ButtonGroup>
                </Col>
                <Col>{formatUSD(props.state.salary)}</Col>
                <Col className='text-start'>
                    <ButtonGroup size='sm'>
                        <Button onClick={() => { salaryHandler(100) }}>+$100</Button>
                        <Button onClick={() => { salaryHandler(1000) }}>+$1k</Button>
                    </ButtonGroup>
                </Col>
            </Row>

            <Row style={spacer}><Col><strong>Start balance</strong></Col></Row>
            <Row>
                <Col className='text-end'>
                    <ButtonGroup size='sm'>
                        <Button onClick={() => { startBalanceHandler(-1000) }}>-$1k</Button>
                        <Button onClick={() => { startBalanceHandler(-100) }}>-$100</Button>
                    </ButtonGroup>
                </Col>
                <Col>{formatUSD(props.state.startBalance)}</Col>
                <Col className='text-start'>
                    <ButtonGroup size='sm'>
                        <Button onClick={() => { startBalanceHandler(100) }}>+$100</Button>
                        <Button onClick={() => { startBalanceHandler(1000) }}>+$1k</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </Container>
    </Card.Body>
    <Card.Title>Time</Card.Title>
    <Card.Body>
        <Container>
            <Row><Col><strong>adjust start date</strong></Col></Row>
            <Row>
                <Col className='text-end'>
                    <ButtonGroup size='sm'>
                        <Button onClick={() => { adjustDate({years: -1}) }}>yr</Button>
                        <Button onClick={() => { adjustDate({months: -1}) }}>mon</Button>
                        <Button onClick={() => { adjustDate({weeks: -1}) }}>wk</Button>
                        <Button onClick={() => { adjustDate({days: -1}) }}>day</Button>
                    </ButtonGroup>
                </Col>
                <Col>
                    {format(startDate, 'MMM dd, yyyy')}
                </Col>
                <Col className='text-start'>
                    <ButtonGroup size='sm'>
                        <Button onClick={() => { adjustDate({days: 1}) }}>day</Button>
                        <Button onClick={() => { adjustDate({weeks: 1}) }}>wk</Button>
                        <Button onClick={() => { adjustDate({months: 1}) }}>mon</Button>
                        <Button onClick={() => { adjustDate({years: 1}) }}>yr</Button>
                    </ButtonGroup>
                </Col>
            </Row>

            <Row style={spacer}><Col><strong>duration</strong></Col></Row>
            <Row>
                <Col className='text-end'><Button disabled={disableSubYear} size='sm' onClick={() => { simDurationHandler(simYears - 1) }}>&#8592;</Button></Col>
                <Col>{formatDuration(props.state.simDuration)}</Col>
                <Col className='text-start'><Button disabled={disableAddYear} size='sm' onClick={() => { simDurationHandler(simYears + 1) }}>&#8594;</Button></Col>
            </Row>
        </Container>
    </Card.Body>
</Card>
)
}

export function Bills (props) {
const costHandler = (name, num) => { props.updateState(name, props.state[name] + num) }
const dueHandler = (name, day) => { props.updateState(name, clamp(props.state[name] + day, 1, 27)) }
const stackGap = 2
const costStyle = {width: '75px'}
const dateStyle = {width: '35px'}
const disableDue = props.state.streamOutgoing
if (disableDue) dateStyle['color'] = 'lightgrey'
return (
<Card className='bg-light bg-gradient shadow-lg' style={{ width: '30rem' }}>
    <Card.Title>Bills</Card.Title>
    <Card.Body>
        <Table>
            <thead>
                <tr>
                    <th>name</th>
                    <th>amount</th>
                    <th>monthly due date</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>housing</strong></td>
                    <td >
                        <Stack className='justify-content-center' direction='horizontal' gap={stackGap}>
                            <Button size='sm' onClick={() => { costHandler('housingCost', -50) }}>-</Button>
                            <span style={costStyle}>{formatUSD(props.state.housingCost)}</span>
                            <Button size='sm' onClick={() => { costHandler('housingCost', 50) }}>+</Button>
                        </Stack>
                    </td>
                    <td>
                        <Stack className='justify-content-center' direction='horizontal' gap={stackGap}>
                            <Button size='sm' disabled={disableDue} onClick={() => { dueHandler('housingDue', -1) }}>-</Button>
                            <span style={dateStyle}>{formatOrdinal(props.state.housingDue)}</span>
                            <Button size='sm' disabled={disableDue} onClick={() => { dueHandler('housingDue', 1) }}>+</Button>
                        </Stack>
                    </td>
                </tr>
                <tr>
                    <td><strong>transportation</strong></td>
                    <td>
                        <Stack className='justify-content-center' direction='horizontal' gap={stackGap}>
                            <Button size='sm' onClick={() => { costHandler('transportationCost', -25) }}>-</Button>
                            <span style={costStyle}>{formatUSD(props.state.transportationCost)}</span>
                            <Button size='sm' onClick={() => { costHandler('transportationCost', 25) }}>+</Button>
                        </Stack>
                    </td>
                    <td>
                        <Stack className='justify-content-center' direction='horizontal' gap={stackGap}>
                            <Button size='sm' disabled={disableDue} onClick={() => { dueHandler('transportationDue', -1) }}>-</Button>
                            <span style={dateStyle}>{formatOrdinal(props.state.transportationDue)}</span>
                            <Button size='sm' disabled={disableDue} onClick={() => { dueHandler('transportationDue', 1) }}>+</Button>
                        </Stack>
                    </td>
                </tr>
                <tr>
                    <td><strong>medical</strong></td>
                    <td>
                        <Stack className='justify-content-center' direction='horizontal' gap={stackGap}>
                            <Button size='sm' onClick={() => { costHandler('medicalCost', -25) }}>-</Button>
                            <span style={costStyle}>{formatUSD(props.state.medicalCost)}</span>
                            <Button size='sm' onClick={() => { costHandler('medicalCost', 25) }}>+</Button>
                        </Stack>
                    </td>
                    <td>
                        <Stack className='justify-content-center' direction='horizontal' gap={stackGap}>
                            <Button size='sm' disabled={disableDue} onClick={() => { dueHandler('medicalDue', -1) }}>-</Button>
                            <span style={dateStyle}>{formatOrdinal(props.state.medicalDue)}</span>
                            <Button size='sm' disabled={disableDue} onClick={() => { dueHandler('medicalDue', 1) }}>+</Button>
                        </Stack>
                    </td>
                </tr>
                <tr>
                    <td><strong>child care</strong></td>
                    <td>
                        <Stack className='justify-content-center' direction='horizontal' gap={stackGap}>
                            <Button size='sm' onClick={() => { costHandler('childCareCost', -50) }}>-</Button>
                            <span style={costStyle}>{formatUSD(props.state.childCareCost)}</span>
                            <Button size='sm' onClick={() => { costHandler('childCareCost', 50) }}>+</Button>
                        </Stack>
                    </td>
                    <td>
                        <Stack className='justify-content-center' direction='horizontal' gap={stackGap}>
                            <Button size='sm' disabled={disableDue} onClick={() => { dueHandler('childCareDue', -1) }}>-</Button>
                            <span style={dateStyle}>{formatOrdinal(props.state.childCareDue)}</span>
                            <Button size='sm' disabled={disableDue} onClick={() => { dueHandler('childCareDue', 1) }}>+</Button>
                        </Stack>
                    </td>
                </tr>
                <tr>
                    <td><strong>internet and mobile</strong></td>
                    <td>
                        <Stack className='justify-content-center' direction='horizontal' gap={stackGap}>
                            <Button size='sm' onClick={() => { costHandler('internetMobileCost', -15) }}>-</Button>
                            <span style={costStyle}>{formatUSD(props.state.internetMobileCost)}</span>
                            <Button size='sm' onClick={() => { costHandler('internetMobileCost', 15) }}>+</Button>
                        </Stack>
                    </td>
                    <td>
                        <Stack className='justify-content-center' direction='horizontal' gap={stackGap}>
                            <Button size='sm' disabled={disableDue} onClick={() => { dueHandler('internetMobileDue', -1) }}>-</Button>
                            <span style={dateStyle}>{formatOrdinal(props.state.internetMobileDue)}</span>
                            <Button size='sm' disabled={disableDue} onClick={() => { dueHandler('internetMobileDue', 1) }}>+</Button>
                        </Stack>
                    </td>
                </tr>
            </tbody>
        </Table>
    </Card.Body>
</Card>
)
}

export function Options (props) {
const rateHandler = (name, num) => { 
    const newValue = props.state[name] + num
    props.updateState(name, clamp(newValue, 0, 0.15)) 
}
const showPayCheckLinesHandler = (e) => { props.updateState('showPayCheckLines', e.target.checked) }
const fitToScreenHandler = (e) => { props.updateState('fitToScreen', e.target.checked) }
const streamIncomingHandler = (e) => { props.updateState('streamIncoming', e.target.checked) }
const streamOutgoingHandler = (e) => { props.updateState('streamOutgoing', e.target.checked) }
const extraDayHandler = (e) => props.updateState('extraDay', e.target.checked)
const useInflationHandler = (e) => { props.updateState('useInflation', e.target.checked) }
const gap = 2
return (
<Card className='bg-light bg-gradient shadow-lg' style={{ width: '17rem' }}>
    <Card.Title>Options</Card.Title>
    <Card.Body className='text-start'>
        <Form>
            <FloatingLabel label='Select a graph preset' style={{marginBottom: '1rem'}}>
                <Form.Select onChange={props.selectedPresetHandler} value={props.selectedPreset}>
                    <option value={-1} disabled></option>
                    { 
                        PresetList.map((preset, index) => {
                            return <option key={index} value={index}>{preset.name}</option>
                        })
                    }
                </Form.Select>
            </FloatingLabel>

            <Form.Switch label='fit on screen' onChange={fitToScreenHandler} checked={props.state.fitToScreen}/>
            <Form.Switch label='show paychecks' onChange={showPayCheckLinesHandler} checked={props.state.showPayCheckLines}/>
            <Form.Switch label='Stream income' onChange={streamIncomingHandler} checked={props.state.streamIncoming}/>
            <Form.Switch label='Stream bill payment' onChange={streamOutgoingHandler} checked={props.state.streamOutgoing}/>
            <Form.Switch label='Extra day' onChange={extraDayHandler} checked={props.state.extraDay}/>
            <Form.Switch label='Inflation' onChange={useInflationHandler} checked={props.state.useInflation}/>
            <Stack className='justify-content-center' direction='horizontal' gap={gap}>
                <Button size='sm' onClick={() => { rateHandler('inflationRate', -0.010) }} disabled={props.state.inflationRate === 0}>--</Button>
                <Button size='sm' onClick={() => { rateHandler('inflationRate', -0.001) }} disabled={props.state.inflationRate === 0}>-</Button>
                    <span>{formatRate(props.state.inflationRate)}</span>
                <Button size='sm' onClick={() => { rateHandler('inflationRate', 0.001) }} disabled={props.state.inflationRate >= 0.15}>+</Button>
                <Button size='sm' onClick={() => { rateHandler('inflationRate', 0.010) }} disabled={props.state.inflationRate >= 0.15}>++</Button>
            </Stack>
            <Form.Label>Borrow rate</Form.Label>
            <Stack className='justify-content-center' direction='horizontal' gap={gap}>
                <Button size='sm' onClick={() => { rateHandler('borrowRate', -0.010) }} disabled={props.state.borrowRate === 0}>--</Button>
                <Button size='sm' onClick={() => { rateHandler('borrowRate', -0.001) }} disabled={props.state.borrowRate === 0}>-</Button>
                    <span>{formatRate(props.state.borrowRate)}</span>
                <Button size='sm' onClick={() => { rateHandler('borrowRate', 0.001) }} disabled={props.state.borrowRate >= 0.30}>+</Button>
                <Button size='sm' onClick={() => { rateHandler('borrowRate', 0.010) }} disabled={props.state.borrowRate >= 0.30}>++</Button>
            </Stack>
            <Form.Label>Savings rate</Form.Label>
            <Stack className='justify-content-center' direction='horizontal' gap={gap}>
                <Button size='sm' onClick={() => { rateHandler('savingsRate', -0.010) }} disabled={props.state.savingsRate === 0}>--</Button>
                <Button size='sm' onClick={() => { rateHandler('savingsRate', -0.001) }} disabled={props.state.savingsRate === 0}>-</Button>
                    <span>{formatRate(props.state.savingsRate)}</span>
                <Button size='sm' onClick={() => { rateHandler('savingsRate', 0.001) }} disabled={props.state.savingsRate >= 0.15}>+</Button>
                <Button size='sm' onClick={() => { rateHandler('savingsRate', 0.010) }} disabled={props.state.savingsRate >= 0.15}>++</Button>
            </Stack>
            
        </Form>
        
    </Card.Body>
</Card>
)
}

export function Result (props) {
const transactions = props.state.unexpectedTrans
const haveTransactions = transactions.length > 0
const COLChange = props.chartData.costOfLivingDiff === 0.0 ? '-' : formatRate(props.chartData.costOfLivingChange)
const removeUnexpectedTrans = (index) => {
    props.updateState('unexpectedTrans', transactions.filter((_, i) => i !== index))
}
return (
<Card className='bg-light bg-gradient shadow-lg' style={{ width: '23rem' }}>
    <Card.Title>Results</Card.Title>
    <Card.Body>
        <Container className='text-start'>
            <Row>
                <Col><strong>final balance:</strong></Col><Col>{formatUSD(props.chartData.finalBalance)}</Col>
            </Row>
            <Row>
                <Col><strong>paychecks:</strong></Col><Col>{ props.chartData.payChecks.length }</Col>
            </Row>
            <Row>
                <Col><strong>interest earned:</strong></Col><Col>{ formatUSD(props.chartData.interestEarned) }</Col>
            </Row>
            <Row>
                <Col><strong>interest paid:</strong></Col><Col>{ formatUSD(props.chartData.interestPaid) }</Col>
            </Row>
            <Row>
                <Col><strong>actual income:</strong></Col><Col>{ formatUSD(props.chartData.totalIncome) }</Col>
            </Row>
            <Row>
                <Col><strong>total bill pay:</strong></Col><Col>{ formatUSD(props.chartData.totalBillPay) }</Col>
            </Row>
        </Container>
    </Card.Body>

    <Card.Title>Cost of Living</Card.Title>
    <Card.Body>
        <Container className='text-start'>
            <Row>
                <Col><strong>first year:</strong></Col><Col>{ formatUSD(props.chartData.costOfLivingStart) }</Col>
            </Row>
            <Row>
                <Col><strong>final year:</strong></Col><Col>{ formatUSD(props.chartData.costOfLivingEnd) }</Col>
            </Row>
            <Row>
                <Col><strong>difference:</strong></Col><Col>+{ formatUSD(props.chartData.costOfLivingDiff) }</Col>
            </Row>
            <Row>
                <Col><strong>change:</strong></Col><Col>{ COLChange }</Col>
            </Row>
        </Container>
    </Card.Body>

    <Card.Title>Unexpected expenses</Card.Title>
    <Card.Body>
        {
            !haveTransactions && <p>Click graph to add an expense.</p>
        }
        {
            haveTransactions &&
            <Container>
            {
                transactions.map((trans, index) => (
                    <Row key={index} style={{cursor: 'pointer'}} onClick={() => removeUnexpectedTrans(index)}>
                        <Col>{trans.date}</Col>
                        <Col>{formatUSD(trans.amount)}</Col>
                    </Row>
                ))
            }
            </Container>
        }
    </Card.Body>
</Card>
)
}
