import { format } from 'date-fns'
import { Stack, Button, ButtonGroup, Card, Form, Container, Row, Col } from 'react-bootstrap';
import { stackGap } from './Chart.js';

export function formatUSD (num) { return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(num) }
export function formatRate (rate) { 
    const num = rate * 100
    return num.toFixed(1) + '%' 
}

export function StartDateInput (props) {
return (
<Card style={{ width: '18rem' }}>
    <Card.Title className="center-text">Start date</Card.Title>
    <Stack direction="vertical" gap={stackGap}>
        <div className="center-margin">
            <Stack direction="horizontal" gap={stackGap}>
                <Button size="sm" onClick={() => { props.startDateHandler({months: -1}) }}>-</Button>
                {format(props.startDate, 'MMMM')}
                <Button size="sm" onClick={() => { props.startDateHandler({months: 1}) }}>+</Button>
            </Stack>
        </div>
        <div className="center-margin">
            <Stack direction="horizontal" gap={stackGap}>
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
        </div>
        <div className="center-margin">
            <Stack direction="horizontal" gap={stackGap}>
                <Button onClick={() => { props.startDateHandler({years: -1}) }}>-</Button>
                {format(props.startDate, 'yyyy')}
                <Button onClick={() => { props.startDateHandler({years: 1}) }}>+</Button>
            </Stack>
        </div>
    </Stack>
</Card>
)
}

export function SalaryInput (props) {
return (
<Card style={{ width: '25rem' }}>
    <Card.Body>
        <Card.Title className="center-text">Salary</Card.Title>
        <Stack direction="vertical" gap={stackGap}>
            <strong>annual salary</strong>
            <div className="center-margin">
                <Stack direction="horizontal" gap={stackGap}>
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
            </div>

            <strong>start balance</strong>
            <div className="center-margin">
                <Stack direction="horizontal" gap={stackGap}>
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
            </div>

            <div className="center-margin">
                <Form.Check type="switch" id="payCheckSwitch" label="show paycheck markers" onChange={props.showPayCheckLinesHandler} checked={props.showPayCheckLines}/>
            </div>
        </Stack>
    </Card.Body>
</Card>
)
}

export function BillsInput (props) {
return (
<Card style={{ width: '25rem' }}>
    <Card.Body>
        <Card.Title className="center-text">Bills</Card.Title>
        <Stack direction="vertical" gap={stackGap}>
    
            <strong>housing</strong>
            <Stack direction="horizontal" gap={stackGap}>
                <ButtonGroup size="sm">
                    <Button onClick={() => { props.housingCostHandler(-50) }}>-$50</Button>
                </ButtonGroup>
                {formatUSD(props.housingCost)}
                <ButtonGroup size="sm">
                    <Button onClick={() => { props.housingCostHandler(50) }}>+$50</Button>
                </ButtonGroup>
            </Stack>

            <strong>electric</strong>
            <Stack direction="horizontal" gap={stackGap}>
                <ButtonGroup size="sm">
                    <Button onClick={() => { props.electricCostHandler(-15) }}>-$15</Button>
                </ButtonGroup>
                {formatUSD(props.electricCost)}
                <ButtonGroup size="sm">
                    <Button onClick={() => { props.electricCostHandler(15) }}>+$15</Button>
                </ButtonGroup>
            </Stack>

            <strong>water</strong>
            <Stack direction="horizontal" gap={stackGap}>
                <ButtonGroup size="sm">
                    <Button onClick={() => { props.waterCostHandler(-15) }}>-$15</Button>
                </ButtonGroup>
                {formatUSD(props.waterCost)}
                <ButtonGroup size="sm">
                    <Button onClick={() => { props.waterCostHandler(15) }}>+$15</Button>
                </ButtonGroup>
            </Stack>
        
        </Stack>
    </Card.Body>
</Card>
)
}

export function FinanceInput (props) {
return (
<Card style={{ width: '25rem' }}>
    <Card.Body>
        <Card.Title className="center-text">Finance</Card.Title>
        <Form.Switch label="Use DeFi" onChange={props.useDeFiHandler} checked={props.useDefi}/>
        <Form.Check type="switch" id="streamingSwitch" label="Use streaming" onChange={props.useStreamingHandler} checked={props.useStreaming}/>
    </Card.Body>
</Card>
)
}

export function TransactionWidget (props) {
return (
<Card style={{ width: '25rem' }}>
    <Card.Body>
        <Card.Title className="center-text">Transactions</Card.Title>
        <Container>
            {
                props.transactions.items.map((trans, index) => (
                    <Row key={index}>
                        <Col>{trans.date.substring(0, trans.date.length - 6)}</Col>
                        <Col>{formatUSD(trans.amount)}</Col>
                        <Col>{trans.name}</Col>
                    </Row>
                ))
            }
        </Container>
    </Card.Body>
</Card>
)
}

export function ResultWidget (props) {
return (
<Card style={{ width: '25rem' }}>
    <Card.Body>
        <Card.Title className="center-text">Results</Card.Title>
        <Container>
            <Row>
                <Col>final balance:</Col><Col>{formatUSD(props.finalBalance)}</Col>
            </Row>
            <Row>
                <Col>total paychecks:</Col><Col>{ props.payChecks.length }</Col>
            </Row>
            <Row>
                <Col>savings rate:</Col><Col>{ formatRate(props.savingsRate) }</Col>
            </Row>
            <Row>
                <Col>interest earned:</Col><Col>{ formatUSD(props.interestEarned) }</Col>
            </Row>
            <Row>
                <Col>credit rate:</Col><Col>{ formatRate(props.creditRate) }</Col>
            </Row>
            <Row>
                <Col>interest paid:</Col><Col>{ formatUSD(props.interestPaid) }</Col>
            </Row>
        </Container>
    </Card.Body>
</Card>
)
}