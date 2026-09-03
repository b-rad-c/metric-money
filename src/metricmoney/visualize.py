import os
import random

from datetime import datetime, timedelta
import matplotlib.dates as mdates
import matplotlib.pyplot as plt

def hello_graph(output_path: str):

	# 1. Create data
	x = [1, 2, 3, 4, 5]
	y = [10, 24, 36, 45, 52]

	# 2. Generate the graph
	plt.plot(x, y, marker='o', color='b', label='Growth')
	plt.title('Sample Line Graph')
	plt.xlabel('X Axis')
	plt.ylabel('Y Axis')
	plt.legend()

	# 3. Write to image file
	os.makedirs(os.path.dirname(output_path), exist_ok=True)
	plt.savefig(output_path, dpi=300, bbox_inches='tight')
	plt.close()

def hello_calendar(output_path: str):
	"""a function that creates a graph with time on the x axis and random data on the y axis
	   the labels on the x axis should be name of the month
	"""
	
	months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	x = months
	y = [random.randint(0, 100) for _ in range(12)]

	plt.plot(x, y, marker='o', color='g', label='Random Data')
	plt.title('Sample Calendar Graph')
	plt.xlabel('Month')
	plt.ylabel('Value')
	plt.legend()

	os.makedirs(os.path.dirname(output_path), exist_ok=True)
	plt.savefig(output_path, dpi=300, bbox_inches='tight')
	plt.close()

def hello_savings(output_path: str):
	"""Create a graph of a savings account with biweekly $100 deposits."""
	start_date = datetime(2026, 1, 2)
	end_date = datetime(2026, 12, 31)
	payday = datetime(2026, 1, 2)
	dates = [start_date]
	balances = [0]
	balance = 0

	while payday <= end_date:
		payday += timedelta(days=14)
		
		balance += 100
		dates.append(payday)
		balances.append(balance)
		

	fig, ax = plt.subplots(figsize=(16, 5))
	ax.plot(dates, balances, marker='o', color='g', label='Savings Balance')
	ax.set_title('Savings Account Growth')
	ax.set_xlabel('Date')
	ax.set_ylabel('Value')
	ax.set_xticks(dates)
	ax.xaxis.set_major_formatter(mdates.DateFormatter('%m/%d'))
	ax.legend()
	fig.autofmt_xdate(rotation=45, ha='right')
	fig.tight_layout()

	os.makedirs(os.path.dirname(output_path), exist_ok=True)
	fig.savefig(output_path, dpi=300, bbox_inches='tight')
	plt.close(fig)

def hello_time_series(output_path: str):

	

	# 1. Generate sample time series data using only built-in standard libraries
	start_date = datetime(2026, 1, 1)
	dates = [start_date + timedelta(days=i) for i in range(10)]
	values = [10, 15, 13, 18, 22, 20, 25, 30, 28, 35]

	# 2. Initialize the plot
	fig, ax = plt.subplots(figsize=(10, 5))

	# 3. Plot the data (matplotlib natively handles datetime objects on the x-axis)
	ax.plot(dates, values, color="tab:blue", marker="o", linestyle="-", linewidth=2)

	# 4. Format the time axis cleanly
	# Format the labels to look like "Jan 01" (Abbreviated Month + Day)
	ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %d"))
	# Ensure tick intervals default to one tick per day
	ax.xaxis.set_major_locator(mdates.DayLocator(interval=1))

	# 5. Clean up aesthetics 
	ax.set_title("Time Series Optimization", fontsize=14, fontweight="bold", pad=15)
	ax.set_xlabel("Date (2026)", fontsize=11, labelpad=10)
	ax.set_ylabel("Performance Metric Value", fontsize=11, labelpad=10)
	ax.grid(True, linestyle="--", alpha=0.6)

	# Automatically tilt dates if they crowd or overlap
	fig.autofmt_xdate()

	# 6. Render the visualization
	plt.tight_layout()
	plt.show()
