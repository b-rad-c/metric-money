import os

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
