# Metric Money

A charting app designed to the show the benefits of streaming money and decentralized finance. It is built with `react`, `bootstrap`, `recharts`, `date-fns` and `lodash`.

    npm start

![Metric money chart](/examples/metric-money.png)

## Explaining the presets

**Imperial money**
+ Note the paycheck lines, 2 or 3 per month, it makes budgeting unpredictable.
+ Increment the start month, notice how the # of paychecks changes in odd patterns
    - `reset` & increment start year

**Metric Money**

*We have turned on streaming money and bill pay, a feature of some cryptocurrencies. Money streaming are contiuous (technically per second) income or payments. Traditionally, salary comes in chunks delivered every other friday and bills are paid based on the day of the month. These intervals are out of phase with each other, making payments difficult to predict.*
+ Flip bill/salary streaming on/off, notice the graph is smoother, resulting in easier budgeting
+ Notice how the adjustments made in the previous preset don't have as big of an effect (if any)  with streaming money 

*It is easier to is to predict and a balance a budget because you're not using strage intervals that are out of phase with each other due to the earth's orbit. Our time intervals are arbitrary, this is where the title of the repository comes from. The imperial measurement system abritrarily has 12 inches in one foot and 5,280 feet in one mile. These intervals make it difficult to convert between units. Similarly, it is difficult to reason about finances when using weeks for income and months for recurring bill payments because they don't sync with one another.*

**Go back to Imperial Money**
+ `reset` & play with the due dates of the bills, notice how less predictable to chart is
+ `reset` & drop the start balance to 500, notice how much more the graph is in the red
    - under options turn on stream incoming/bill pay, notice there is no debt. No change in income or cost of living but debt was avoided
+ you might notice you make more money without streaming, but it's an illusion. 
    - Rent is due on the first but the simulation ends on Dec 31, `reset` & check the extra day button to extend the simulation 1 day and notice how the final balance drops

**Metric Money - expenses**
+ turn off streaming incomine/bills, notice how debt is incurred
  - turn on the extra day option

**Stable Currency**

*This chart shows the stable currency option. Without it cost of living increases by 2.5% per year. Some stable coin cryptocurrencies elimate this by pegging their value to price indexes to protect consumers from inflation*
+ Turn the stable currency option on and off and notice the difference in final balance and cost of living.
    - The difference isn't too dramatic when looking at one year
    - Turn off stable currency and extend the simulation to 6 years. Now, finally inflation has caught up to you.

**DeFi**

*Putting it altogether now. Turning decentralized finance on gives you savings and borrowing rates similar to those found in decentralized finance.*
