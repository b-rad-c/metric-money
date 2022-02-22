import { add, format, formatDuration } from 'date-fns'
import { clamp } from 'lodash'
import { Stack, Button, ButtonGroup, Card, Form, Container, Row, Col, Table, FloatingLabel } from 'react-bootstrap';
import { stackGap } from './Chart.js';
import PresetList from './Presets.js';


//
// formatters
//

export function formatRate (rate) { 
    const num = rate * 100
    return num.toFixed(1) + '%' 
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
// top row
//

export function SimulationInput (props) {
const simYears = props.state.simDuration.years
const startDate = props.state.startDate
const disableSubYear = simYears === 1
const disableAddYear = simYears === 10
const startDateHandler = (offset) => { props.updateState('startDate', add(startDate, offset)) }
const simDurationHandler = (years) => { props.updateState('simDuration', {years: years}) }
return (
<Card className="center-text">
    <Card.Title>Simulation</Card.Title>
    <Card.Body>
        <Stack direction="vertical" gap={2}>
           
            <Stack direction="horizontal" gap={0}>
                <Stack className="center-margin" direction="horizontal" gap={1}>
                    <Button size="sm" onClick={() => { startDateHandler({months: -1}) }}>-</Button>
                    {format(startDate, 'MMM')}
                    <Button size="sm" onClick={() => { startDateHandler({months: 1}) }}>+</Button>
                </Stack>
                <Stack className="center-margin" direction="horizontal" gap={1}>
                    <ButtonGroup size="sm">
                        <Button onClick={() => { startDateHandler({days: -7}) }}>-7</Button>
                        <Button onClick={() => { startDateHandler({days: -1}) }}>-1</Button>
                    </ButtonGroup>
                    {format(startDate, 'do')}
                    <ButtonGroup size="sm">
                        <Button onClick={() => { startDateHandler({days: 1}) }}>+1</Button>
                        <Button onClick={() => { startDateHandler({days: 7}) }}>+7</Button>
                    </ButtonGroup>
                </Stack>
                <Stack className="center-margin" direction="horizontal" gap={1}>
                    <Button size="sm" onClick={() => { startDateHandler({years: -1}) }}>-</Button>
                    {format(startDate, 'yyyy')}
                    <Button size="sm" onClick={() => { startDateHandler({years: 1}) }}>+</Button>
                </Stack>
            </Stack>

            <strong>duration</strong>
            <Stack className="center-margin" direction="horizontal" gap={3}>
                <Button disabled={disableSubYear} size="sm" onClick={() => { simDurationHandler(simYears - 1) }}>-</Button>
                {formatDuration(props.state.simDuration)}
                <Button disabled={disableAddYear} size="sm" onClick={() => { simDurationHandler(simYears + 1) }}>+</Button>
            </Stack>
        </Stack>
    </Card.Body>
</Card>
)
}

export function GraphOptions (props) {
const showPayCheckLinesHandler = (e) => { props.updateState('showPayCheckLines', e.target.checked) }
const fitToScreenHandler = (e) => { props.updateState('fitToScreen', e.target.checked) }
return (
<Card>
    <Card.Title className="center-text">Graph options</Card.Title>
    <Card.Body>
        <Form>
            <FloatingLabel label="Select a graph preset">
                <Form.Select onChange={props.selectedPresetHandler} value={props.selectedPreset}>
                    <option value={-1} disabled></option>
                    { 
                        PresetList.map((preset, index) => {
                            return <option key={index} value={index}>{preset.name}</option>
                        })
                    }
                </Form.Select>
            </FloatingLabel>

            <Form.Switch className="center-margin" label="fit on screen" onChange={fitToScreenHandler} checked={props.state.fitToScreen}/>
            <Form.Switch className="center-margin" label="show paychecks" onChange={showPayCheckLinesHandler} checked={props.state.showPayCheckLines}/>
        </Form>
    </Card.Body>
</Card>
)
}

export function ResultWidget (props) {
return (
<Card>
    <Card.Title className="center-text">Results</Card.Title>
    <Card.Body>
        <Container className="center-margin">
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
</Card>
)
}

//
// bottom row
//

export function FinanceWidget (props) {
const streamIncomingHandler = (e) => { props.updateState('streamIncoming', e.target.checked) }
const useDeFiHandler = (e) => { props.updateState('useDeFi', e.target.checked); }
const salaryHandler = (num) => { props.updateState('salary', props.state.salary + num) }
const startBalanceHandler = (num) => { props.updateState('startBalance', props.state.startBalance + num) }
return (
<Card className="center-text">
    <Card.Title>Finance</Card.Title>
    <Card.Body>
        <Container style={{textAlign: 'left'}}>
            <Form.Switch label="Stream income" onChange={streamIncomingHandler} checked={props.state.streamIncoming}/>
        </Container>
        
        <Container>
            <Row>
                <Col style={{textAlign: 'left'}}><Form.Switch label="DeFi" onChange={useDeFiHandler} checked={props.state.useDefi}/></Col>
                <Col><strong>savings rate:</strong> { formatRate(props.chartData.savingsRate) }</Col>
                <Col><strong>credit rate:</strong>{ formatRate(props.chartData.creditRate) }</Col>
            </Row>
            <Row style={{marginTop: '1rem'}}>
                <Col className="center-text"><strong>Salary</strong></Col>
            </Row>
            <Row>
                <Col>
                    <ButtonGroup size="sm">
                        <Button onClick={() => { salaryHandler(-1000) }}>-$1k</Button>
                        <Button onClick={() => { salaryHandler(-100) }}>-$100</Button>
                    </ButtonGroup>
                </Col>
                <Col>{formatUSD(props.state.salary)}</Col>
                <Col>
                    <ButtonGroup size="sm">
                        <Button onClick={() => { salaryHandler(100) }}>+$100</Button>
                        <Button onClick={() => { salaryHandler(1000) }}>+$1k</Button>
                    </ButtonGroup>
                </Col>
            </Row>

            <Row>
                <Col className="center-text"><strong>Start balance</strong></Col>
            </Row>
            <Row>
                <Col>
                    <ButtonGroup size="sm">
                        <Button onClick={() => { startBalanceHandler(-1000) }}>-$1k</Button>
                        <Button onClick={() => { startBalanceHandler(-100) }}>-$100</Button>
                    </ButtonGroup>
                </Col>
                <Col>{formatUSD(props.state.startBalance)}</Col>
                <Col>
                    <ButtonGroup size="sm">
                        <Button onClick={() => { startBalanceHandler(100) }}>+$100</Button>
                        <Button onClick={() => { startBalanceHandler(1000) }}>+$1k</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </Container>
    </Card.Body>
</Card>
)
}

export function BillsInput (props) {
const costHandler = (name, num) => { props.updateState(name, props.state[name] + num) }
const dueHandler = (name, day) => { props.updateState(name, clamp(props.state[name] + day, 1, 27)) }
const streamOutgoingHandler = (e) => { props.updateState('streamOutgoing', e.target.checked) }
return (
<Card className="center-text">
    <Card.Title>Bills</Card.Title>
    <Card.Body>
        <Form.Switch style={{textAlign: 'left'}} label="Stream bill payment" onChange={streamOutgoingHandler} checked={props.state.streamOutgoing}/>
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

export function ExpensesWidget (props) {
const items = props.state.unexpectedTrans.items
const haveTransactions = items.length > 0
return (
<Card className="center-text">
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

