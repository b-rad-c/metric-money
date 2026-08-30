from pathlib import Path

from metricmoney.shared import pprint_json

from bs4 import BeautifulSoup


current_file = Path(__file__)
current_dir = current_file.parent

def parse_metro_38900() -> dict:

	"""
	extract data table from html
	"""

	# load file #

	path = current_dir / 'data/livingwage_mit_edu_metros_38900.html'

	with open(path, 'r', encoding='utf-8') as f:
		html_content = f.read()


	# create soup #

	soup = BeautifulSoup(html_content, 'html.parser')
	table = soup.find('table', {'class': 'results_table table-striped'})

	#
	# column headers
	#

	# adult headers #
	adult_headers = []
	for n, th in enumerate(table.select('thead tr th')):
		if n == 0:
			continue
		formatted = th.text.strip().replace('(', ' (').lower()
		adult_headers.append(formatted if th.text else '')

	# child headers #
	child_headers = []
	for n, td in enumerate(table.select('thead tr td b')):
		child_headers.append(td.text.strip().replace('\xa0', ' ') if td.text else '')

	# combine headers #
	table_headers = []
	adult_header_index = 0
	for n, child_header in enumerate(child_headers):
		table_headers.append(f"{adult_headers[adult_header_index]} - {child_header}".title())
		if (n + 1) % 4 == 0:
			adult_header_index += 1

	#
	# wage table rows
	#

	"""
	the first td in a tr has the label of the row, the following tds contain the data for that row.
	"""

	output_data = {}

	wage_row_labels = []
	wage_rows = []

	for tr in table.select('tbody tr'):
		cells = tr.select('td')
		if not cells:
			continue
		wage_row_labels.append(cells[0].text.strip())
		wage_rows.append([cell.text.strip() for cell in cells[1:]])

	for n, header in enumerate(table_headers):
		data = {wage_row_labels[i]: row[n] for i, row in enumerate(wage_rows)}
		output_data[header] = {'wage': data}

	#
	# expenses table rows
	#

	"""
	the format of the second table is the same as the first
		- we will use the same headers as the first table.
		- the row labels and data are different
	"""

	expenses_table = soup.find('table', {'class': 'results_table table-striped expense_table'})

	expenses_row_labels = []
	expenses_rows = []

	for tr in expenses_table.select('tbody tr'):
		cells = tr.select('td')
		if not cells:
			continue
		expenses_row_labels.append(cells[0].text.strip())
		expenses_rows.append([cell.text.strip() for cell in cells[1:]])

	for n, header in enumerate(table_headers):
		data = {expenses_row_labels[i]: row[n] for i, row in enumerate(expenses_rows)}
		output_data[header]['expenses'] = data

	return output_data