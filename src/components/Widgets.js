import { add, format, formatDuration } from 'date-fns'
import { clamp } from 'lodash'
import { Stack, Button, ButtonGroup, Card, Form, Container, Row, Col, Table, FloatingLabel } from 'react-bootstrap';
import PresetList from './Presets.js';


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

export function SimulationInput (props) {
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
<Card className="bg-light bg-gradient shadow-lg" style={{ width: '35rem' }}>
    <Card.Title>Financial situation</Card.Title>
    <Card.Body>
    <Container>
            <Row style={spacer}><Col><strong>salary</strong></Col></Row>
            <Row>
                <Col className='text-end'>
                    <ButtonGroup size="sm">
                        <Button onClick={() => { salaryHandler(-1000) }}>-$1k</Button>
                        <Button onClick={() => { salaryHandler(-100) }}>-$100</Button>
                    </ButtonGroup>
                </Col>
                <Col>{formatUSD(props.state.salary)}</Col>
                <Col className='text-start'>
                    <ButtonGroup size="sm">
                        <Button onClick={() => { salaryHandler(100) }}>+$100</Button>
                        <Button onClick={() => { salaryHandler(1000) }}>+$1k</Button>
                    </ButtonGroup>
                </Col>
            </Row>

            <Row style={spacer}><Col><strong>Start balance</strong></Col></Row>
            <Row>
                <Col className='text-end'>
                    <ButtonGroup size="sm">
                        <Button onClick={() => { startBalanceHandler(-1000) }}>-$1k</Button>
                        <Button onClick={() => { startBalanceHandler(-100) }}>-$100</Button>
                    </ButtonGroup>
                </Col>
                <Col>{formatUSD(props.state.startBalance)}</Col>
                <Col className='text-start'>
                    <ButtonGroup size="sm">
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
                    <ButtonGroup size="sm">
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
                    <ButtonGroup size="sm">
                        <Button onClick={() => { adjustDate({days: 1}) }}>day</Button>
                        <Button onClick={() => { adjustDate({weeks: 1}) }}>wk</Button>
                        <Button onClick={() => { adjustDate({months: 1}) }}>mon</Button>
                        <Button onClick={() => { adjustDate({years: 1}) }}>yr</Button>
                    </ButtonGroup>
                </Col>
            </Row>

            <Row style={spacer}><Col><strong>duration</strong></Col></Row>
            <Row>
                <Col className='text-end'><Button disabled={disableSubYear} size="sm" onClick={() => { simDurationHandler(simYears - 1) }}>&#8592;</Button></Col>
                <Col>{formatDuration(props.state.simDuration)}</Col>
                <Col className='text-start'><Button disabled={disableAddYear} size="sm" onClick={() => { simDurationHandler(simYears + 1) }}>&#8594;</Button></Col>
            </Row>
        </Container>
    </Card.Body>
</Card>
)
}

export function BillsInput (props) {
const costHandler = (name, num) => { props.updateState(name, props.state[name] + num) }
const dueHandler = (name, day) => { props.updateState(name, clamp(props.state[name] + day, 1, 27)) }
const stackGap = 2
return (
<Card className="bg-light bg-gradient shadow-lg" style={{ width: '30rem' }}>
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
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { costHandler('housingCost', -50) }}>-</Button>
                            {formatUSD(props.state.housingCost)}
                            <Button size="sm" onClick={() => { costHandler('housingCost', 50) }}>+</Button>
                        </Stack>
                    </td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { dueHandler('housingDue', -1) }}>-</Button>
                            {formatOrdinal(props.state.housingDue)}
                            <Button size="sm" onClick={() => { dueHandler('housingDue', 1) }}>+</Button>
                        </Stack>
                    </td>
                </tr>
                <tr>
                    <td><strong>car</strong></td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { costHandler('carCost', -25) }}>-</Button>
                            {formatUSD(props.state.carCost)}
                            <Button size="sm" onClick={() => { costHandler('carCost', 25) }}>+</Button>
                        </Stack>
                    </td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { dueHandler('carDue', -1) }}>-</Button>
                            {formatOrdinal(props.state.carDue)}
                            <Button size="sm" onClick={() => { dueHandler('carDue', 1) }}>+</Button>
                        </Stack>
                    </td>
                </tr>
                <tr>
                    <td><strong>electric</strong></td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { costHandler('electricCost', -15) }}>-</Button>
                            {formatUSD(props.state.electricCost)}
                            <Button size="sm" onClick={() => { costHandler('electricCost', 15) }}>+</Button>
                        </Stack>
                    </td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { dueHandler('electricDue', -1) }}>-</Button>
                            {formatOrdinal(props.state.electricDue)}
                            <Button size="sm" onClick={() => { dueHandler('electricDue', 1) }}>+</Button>
                        </Stack>
                    </td>
                </tr>
                <tr>
                    <td><strong>water</strong></td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { costHandler('waterCost', -15) }}>-</Button>
                            {formatUSD(props.state.waterCost)}
                            <Button size="sm" onClick={() => { costHandler('waterCost', 15) }}>+</Button>
                        </Stack>
                    </td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { dueHandler('waterDue', -1) }}>-</Button>
                            {formatOrdinal(props.state.waterDue)}
                            <Button size="sm" onClick={() => { dueHandler('waterDue', 1) }}>+</Button>
                        </Stack>
                    </td>
                </tr>
            </tbody>
        </Table>
    </Card.Body>
</Card>
)
}

export function GraphOptions (props) {
const showPayCheckLinesHandler = (e) => { props.updateState('showPayCheckLines', e.target.checked) }
const fitToScreenHandler = (e) => { props.updateState('fitToScreen', e.target.checked) }
const streamIncomingHandler = (e) => { props.updateState('streamIncoming', e.target.checked) }
const useDeFiHandler = (e) => { props.updateState('useDeFi', e.target.checked); }
const streamOutgoingHandler = (e) => { props.updateState('streamOutgoing', e.target.checked) }
const stableCurrencyHandler = (e) => { props.updateState('stableCurrency', e.target.checked) }
return (
<Card className="bg-light bg-gradient shadow-lg" style={{ width: '17rem' }}>
    <Card.Title>Options</Card.Title>
    <Card.Body className="text-start">
        <Form>
            <FloatingLabel label="Select a graph preset" style={{marginBottom: '1rem'}}>
                <Form.Select onChange={props.selectedPresetHandler} value={props.selectedPreset}>
                    <option value={-1} disabled></option>
                    { 
                        PresetList.map((preset, index) => {
                            return <option key={index} value={index}>{preset.name}</option>
                        })
                    }
                </Form.Select>
            </FloatingLabel>

            <Form.Switch label="fit on screen" onChange={fitToScreenHandler} checked={props.state.fitToScreen}/>
            <Form.Switch label="show paychecks" onChange={showPayCheckLinesHandler} checked={props.state.showPayCheckLines}/>
            <Form.Switch label="Stream income" onChange={streamIncomingHandler} checked={props.state.streamIncoming}/>
            <Form.Switch label="Stream bill payment" onChange={streamOutgoingHandler} checked={props.state.streamOutgoing}/>
            <Form.Switch label="Stable currency" onChange={stableCurrencyHandler} checked={props.state.stableCurrency}/>
            <Form.Switch label="DeFi" onChange={useDeFiHandler} checked={props.state.useDefi}/>
        </Form>
        
    </Card.Body>
    <Container className="text-start" style={{marginBottom: '1rem'}}>
        <Row><Col><strong>savings rate:</strong>  </Col><Col>{formatRate(props.chartData.savingsRate)}  </Col></Row>
        <Row><Col><strong>credit rate:</strong>   </Col><Col>{formatRate(props.chartData.creditRate)}   </Col></Row>
        <Row><Col><strong>inflation rate:</strong></Col><Col>{formatRate(props.chartData.inflationRate)}</Col></Row>
    </Container>
</Card>
)
}

export function ResultWidget (props) {
const items = props.state.unexpectedTrans.items
const haveTransactions = items.length > 0
const COLChange = props.chartData.costOfLivingDiff === 0.0 ? '-' : formatRate(props.chartData.costOfLivingChange)
return (
<Card className="bg-light bg-gradient shadow-lg" style={{ width: '23rem' }}>
    <Card.Title>Results</Card.Title>
    <Card.Body>
        <Container className="text-start">
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
        </Container>
    </Card.Body>

    <Card.Title>Cost of Living</Card.Title>
    <Card.Body>
        <Container className="text-start">
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
                items.map((trans, index) => (
                    <Row key={index}>
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
