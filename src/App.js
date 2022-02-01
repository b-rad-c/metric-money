import './App.css';
import { ResponsiveLineCanvas } from '@nivo/line'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const sampleData = [
  {
    "id": "japan",
    "color": "hsl(69, 70%, 50%)",
    "data": [
      {
        "x": '2018-01-01',
        "y": 219
      },
      {
        "x": '2018-01-02',
        "y": 28
      },
      {
        "x": '2018-01-03',
        "y": 211
      },
      {
        "x": '2018-01-04',
        "y": 140
      },
      {
        "x": '2018-01-05',
        "y": 236
      },
      {
        "x": '2018-01-06',
        "y": 136
      },
      {
        "x": '2018-01-07',
        "y": 157
      },
      {
        "x": '2018-01-08',
        "y": 235
      },
      {
        "x": '2018-01-09',
        "y": 127
      },
      {
        "x": '2018-01-10',
        "y": 140
      },
      {
        "x": '2018-01-11',
        "y": 102
      },
      {
        "x": '2018-01-12',
        "y": 37
      }
    ]
  }
]


const MyResponsiveLine = ({ data /* see data tab */ }) => (
    <ResponsiveLineCanvas
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                precision: 'day',
            }}

        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
                format: '%b %d',
                tickValues: 'every 2 days',
                legend: 'time scale',
                legendOffset: -12,
            }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)

function App() {
  return (
    <div className="App">
      <h1>Sample data</h1>
      <div style={{height: "600px", width: "1250px"}}>
        <MyResponsiveLine data={sampleData}/>
      </div>
    </div>
  );
}

export default App;
