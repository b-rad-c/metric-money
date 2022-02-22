import { format, formatDuration } from 'date-fns'
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
const simYears = props.simDuration.years
const disableSubYear = simYears === 1
const disableAddYear = simYears === 10
return (
<Card className="center-text" style={{ width: '28rem' }}>
    <Card.Title>Simulation</Card.Title>
    <Card.Body>
        <Stack direction="vertical" gap={2}>
            <strong>start date</strong>
            <Stack direction="horizontal" gap={0}>
                <Stack className="center-margin" direction="horizontal" gap={1}>
                    <Button size="sm" onClick={() => { props.startDateHandler({months: -1}) }}>-</Button>
                    {format(props.startDate, 'MMM')}
                    <Button size="sm" onClick={() => { props.startDateHandler({months: 1}) }}>+</Button>
                </Stack>
                <Stack className="center-margin" direction="horizontal" gap={1}>
                    <ButtonGroup size="sm">
                        <Button onClick={() => { props.startDateHandler({days: -7}) }}>-7</Button>
                        <Button onClick={() => { props.startDateHandler({days: -1}) }}>-1</Button>
                    </ButtonGroup>
                    {format(props.startDate, 'do')}
                    <ButtonGroup size="sm">
                        <Button onClick={() => { props.startDateHandler({days: 1}) }}>+1</Button>
                        <Button onClick={() => { props.startDateHandler({days: 7}) }}>+7</Button>
                    </ButtonGroup>
                </Stack>
                <Stack className="center-margin" direction="horizontal" gap={1}>
                    <Button size="sm" onClick={() => { props.startDateHandler({years: -1}) }}>-</Button>
                    {format(props.startDate, 'yyyy')}
                    <Button size="sm" onClick={() => { props.startDateHandler({years: 1}) }}>+</Button>
                </Stack>
            </Stack>

            <strong>duration</strong>
            <Stack className="center-margin" direction="horizontal" gap={3}>
                <Button disabled={disableSubYear} size="sm" onClick={() => { props.simDurationHandler(simYears - 1) }}>-</Button>
                {formatDuration(props.simDuration)}
                <Button disabled={disableAddYear} size="sm" onClick={() => { props.simDurationHandler(simYears + 1) }}>+</Button>
            </Stack>
        </Stack>
    </Card.Body>
</Card>
)
}

export function FinanceInput (props) {
return (
<Card style={{ width: '20rem' }}>
    <Card.Title className="center-text">Finance</Card.Title>
    <Card.Body>
        <Container className="center-margin">
            <Row>
                <Col><Form.Switch label="DeFi" onChange={props.useDeFiHandler} checked={props.useDefi}/></Col>
                <Col><Form.Switch label="Streaming" onChange={props.useStreamingHandler} checked={props.useStreaming}/></Col>
            </Row>
            <Row>
                <Col><strong>savings rate:</strong></Col><Col>{ formatRate(props.savingsRate) }</Col>
            </Row>
            <Row>
                <Col><strong>credit rate:</strong></Col><Col>{ formatRate(props.creditRate) }</Col>
            </Row>
        </Container>
    </Card.Body>
</Card>
)
}

export function GraphOptions (props) {
return (
<Card style={{ width: '14rem' }}>
    <Card.Title className="center-text">Graph options</Card.Title>
    <Card.Body>
        <Form>
            <FloatingLabel label="Select a graph preset">
                <Form.Select onChange={props.selectedPresetHandler} value={props.selectedPreset}>
                    
                    { // <option disabled value="custom">-</option>
                        PresetList.map((preset, index) => {
                            return <option key={index} value={index}>{preset.name}</option>
                        })
                    }
                </Form.Select>
            </FloatingLabel>
            
            <Form.Switch className="center-margin" label="fit on screen" onChange={props.fitToScreenHandler} checked={props.fitToScreen}/>
            <Form.Switch className="center-margin" label="show paychecks" onChange={props.showPayCheckLinesHandler} checked={props.showPayCheckLines}/>
        </Form>
    </Card.Body>
</Card>
)
}

export function ResultWidget (props) {
return (
<Card style={{ width: '20rem' }}>
    <Card.Title className="center-text">Results</Card.Title>
    <Card.Body>
        <Container className="center-margin">
            <Row>
                <Col><strong>final balance:</strong></Col><Col>{formatUSD(props.finalBalance)}</Col>
            </Row>
            <Row>
                <Col><strong>paychecks:</strong></Col><Col>{ props.payChecks.length }</Col>
            </Row>
            <Row>
                <Col><strong>interest earned:</strong></Col><Col>{ formatUSD(props.interestEarned) }</Col>
            </Row>
            <Row>
                <Col><strong>interest paid:</strong></Col><Col>{ formatUSD(props.interestPaid) }</Col>
            </Row>
        </Container>
    </Card.Body>
</Card>
)
}

//
// bottom row
//

export function SalaryInput (props) {
return (
<Card className="center-text" style={{ width: '25rem' }}>
    <Card.Title>Salary</Card.Title>
    <Card.Body>
        <Stack direction="vertical" gap={stackGap}>
            <strong>annual salary</strong>
            <Stack className="center-margin" direction="horizontal" gap={stackGap}>
                <ButtonGroup size="sm">
                    <Button onClick={() => { props.salaryHandler(-1000) }}>-$1k</Button>
                    <Button onClick={() => { props.salaryHandler(-100) }}>-$100</Button>
                </ButtonGroup>
                {formatUSD(props.salary)}
                <ButtonGroup size="sm">
                    <Button onClick={() => { props.salaryHandler(100) }}>+$100</Button>
                    <Button onClick={() => { props.salaryHandler(1000) }}>+$1k</Button>
                </ButtonGroup>
            </Stack>

            <strong>start balance</strong>
            <Stack className="center-margin"direction="horizontal" gap={stackGap}>
                <ButtonGroup size="sm">
                    <Button onClick={() => { props.startBalanceHandler(-1000) }}>-$1k</Button>
                    <Button onClick={() => { props.startBalanceHandler(-100) }}>-$100</Button>
                </ButtonGroup>
                {formatUSD(props.startBalance)}
                <ButtonGroup size="sm">
                    <Button onClick={() => { props.startBalanceHandler(100) }}>+$100</Button>
                    <Button onClick={() => { props.startBalanceHandler(1000) }}>+$1k</Button>
                </ButtonGroup>
            </Stack>
        </Stack>
    </Card.Body>
</Card>
)
}

export function BillsInput (props) {
return (
<Card className="center-text" style={{ width: '18rem' }}>
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
                            <Button size="sm" onClick={() => { props.housingCostHandler(-50) }}>-</Button>
                            {formatUSD(props.housingCost)}
                            <Button size="sm" onClick={() => { props.housingCostHandler(50) }}>+</Button>
                        </Stack>
                    </td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { props.housingDueHandler(-1) }}>-</Button>
                            {formatOrdinal(props.housingDue)}
                            <Button size="sm" onClick={() => { props.housingDueHandler(1) }}>+</Button>
                        </Stack>
                    </td>
                </tr>
                <tr>
                    <td><strong>car</strong></td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { props.carCostHandler(-25) }}>-</Button>
                            {formatUSD(props.carCost)}
                            <Button size="sm" onClick={() => { props.carCostHandler(25) }}>+</Button>
                        </Stack>
                    </td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { props.carDueHandler(-1) }}>-</Button>
                            {formatOrdinal(props.carDue)}
                            <Button size="sm" onClick={() => { props.carDueHandler(1) }}>+</Button>
                        </Stack>
                    </td>
                </tr>
                <tr>
                    <td><strong>electric</strong></td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { props.electricCostHandler(-15) }}>-</Button>
                            {formatUSD(props.electricCost)}
                            <Button size="sm" onClick={() => { props.electricCostHandler(15) }}>+</Button>
                        </Stack>
                    </td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { props.electricDueHandler(-1) }}>-</Button>
                            {formatOrdinal(props.electricDue)}
                            <Button size="sm" onClick={() => { props.electricDueHandler(1) }}>+</Button>
                        </Stack>
                    </td>
                </tr>
                <tr>
                    <td><strong>water</strong></td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { props.waterCostHandler(-15) }}>-</Button>
                            {formatUSD(props.waterCost)}
                            <Button size="sm" onClick={() => { props.waterCostHandler(15) }}>+</Button>
                        </Stack>
                    </td>
                    <td>
                        <Stack className="justify-content-center" direction="horizontal" gap={stackGap}>
                            <Button size="sm" onClick={() => { props.waterDueHandler(-1) }}>-</Button>
                            {formatOrdinal(props.waterDue)}
                            <Button size="sm" onClick={() => { props.waterDueHandler(1) }}>+</Button>
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
const items = props.transactions.items
const haveTransactions = items.length > 0
return (
<Card className="center-text" style={{ width: '18rem' }}>
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

