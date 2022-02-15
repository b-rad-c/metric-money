import { format } from 'date-fns'
import { Stack, Button, ButtonGroup, Card, Form } from 'react-bootstrap';
import { stackGap } from '../../index';

const formatUSD = (num) => { return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(num) }

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
        <strong>water</strong>
        <strong>internet</strong>
        
        </Stack>
    </Card.Body>
</Card>
)
}