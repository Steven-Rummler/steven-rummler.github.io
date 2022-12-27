import csv
import subprocess
import copy

out = subprocess.check_output(
    'git log --no-merges --numstat --date=iso-strict')

lines = out.decode('ascii').split('\n')

items = []

defaultItem = {
    'author': None,
    'date': None,
    'message': '',
    'changes': []
}
currentItem = copy.deepcopy(defaultItem)

lineIndex = 0


def parseInt(value):
    try:
        return int(value)
    except ValueError:
        return 0


while lineIndex < len(lines):
    if 'commit' in lines[lineIndex]:
        if currentItem['author'] != None:
            items.append(currentItem)
        currentItem = copy.deepcopy(defaultItem)
        lineIndex += 1
        currentItem['author'] = lines[lineIndex].split(':')[1].split('<')[
            0].strip()
        lineIndex += 1
        currentItem['date'] = ':'.join(lines[lineIndex].split(':')[1:]).strip()
        lineIndex += 2
        while len(lines[lineIndex]) > 1:
            currentItem['message'] += lines[lineIndex].strip()
            currentItem['message'] += ' '
            lineIndex += 1
        lineIndex += 1
        while len(lines[lineIndex]) > 1:
            change = lines[lineIndex].split('\t')
            currentItem['changes'].append({
                'additions': parseInt(change[0]),
                'deletions': parseInt(change[1]),
                'file': change[2]
            })
            lineIndex += 1
    else:
        lineIndex += 1

for item in items:
    item['additions'] = 0
    item['deletions'] = 0
    item['files'] = 0
    for change in item['changes']:
        item['additions'] += change['additions']
        item['deletions'] += change['deletions']
        item['files'] += 1
    item['message'] = item['message'].strip()
    del item['changes']

outfile = open('gitdata.csv', 'w', newline='')
writer = csv.DictWriter(outfile, fieldnames=[
                        'author', 'date', 'message', 'additions', 'deletions', 'files'])
writer.writeheader()
writer.writerows(items)
outfile.close()
