import { format, formatDuration } from 'date-fns'
import { Stack, Button, ButtonGroup, Card, Form, Container, Row, Col } from 'react-bootstrap';
import { stackGap } from './Chart.js';

export function formatUSD (num) { return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(num) }
export function formatRate (rate) { 
    const num = rate * 100
    return num.toFixed(1) + '%' 
}

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
        <Stack direction="vertical" gap={2}>
    
            <strong>housing</strong>
            <Stack className="center-margin" direction="horizontal" gap={stackGap}>
                <Button size="sm" onClick={() => { props.housingCostHandler(-50) }}>-$50</Button>
                {formatUSD(props.housingCost)}
                <Button size="sm" onClick={() => { props.housingCostHandler(50) }}>+$50</Button>
            </Stack>

            <strong>electric</strong>
            <Stack className="center-margin" direction="horizontal" gap={stackGap}>
                <Button size="sm" onClick={() => { props.electricCostHandler(-15) }}>-$15</Button>
                {formatUSD(props.electricCost)}
                <Button size="sm" onClick={() => { props.electricCostHandler(15) }}>+$15</Button>
            </Stack>

            <strong>water</strong>
            <Stack className="center-margin" direction="horizontal" gap={stackGap}>
                <Button size="sm" onClick={() => { props.waterCostHandler(-15) }}>-$15</Button>
                {formatUSD(props.waterCost)}
                <Button size="sm" onClick={() => { props.waterCostHandler(15) }}>+$15</Button>
            </Stack>
        
        </Stack>
    </Card.Body>
</Card>
)
}

export function FinanceInput (props) {
return (
<Card style={{ width: '19rem' }}>
    <Card.Title className="center-text">Finance</Card.Title>
    <Card.Body>
        <Form>
            <Row>
                <Col><Form.Switch label="Use DeFi" onChange={props.useDeFiHandler} checked={props.useDefi}/></Col>
                <Col><Form.Switch label="streaming" onChange={props.useStreamingHandler} checked={props.useStreaming}/></Col>
            </Row>
        </Form>
        <Container className="center-margin">
            <Row>
                <Col>savings rate:</Col><Col>{ formatRate(props.savingsRate) }</Col>
            </Row>
            <Row>
                <Col>credit rate:</Col><Col>{ formatRate(props.creditRate) }</Col>
            </Row>
        </Container>
    </Card.Body>
</Card>
)
}

export function GraphOptions (props) {
return (
<Card style={{ width: '18rem' }}>
    <Card.Title className="center-text">Graph options</Card.Title>
    <Card.Body>
        <Form>
            <Row>
                <Col><Form.Switch className="center-margin" label="fit on screen" onChange={props.fitToScreenHandler} checked={props.fitToScreen}/></Col>
            </Row>
            <Row>
                <Col><Form.Switch className="center-margin" label="show paychecks" onChange={props.showPayCheckLinesHandler} checked={props.showPayCheckLines}/></Col>
            </Row>
        </Form>
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
                        <Col>{trans.date.substring(0, trans.date.length - 6)}</Col>
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

export function ResultWidget (props) {
return (
<Card  style={{ width: '23rem' }}>
    <Card.Title className="center-text">Results</Card.Title>
    <Card.Body>
        <Container className="center-margin">
            <Row>
                <Col><strong>final balance:</strong></Col><Col>{formatUSD(props.finalBalance)}</Col>
            </Row>
            <Row>
                <Col><strong>total paychecks:</strong></Col><Col>{ props.payChecks.length }</Col>
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