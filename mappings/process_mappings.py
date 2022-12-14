# Process Official Mappings


with open('1.16.4_official.txt', 'r') as reader:
    lines = reader.readlines()[1:]

print('Official file read.')

class OfficialMapping:
    def __init__(self, category):
        self.category = category
        
    def to_string(self):
        out = 'Type: ' + self.category
        
        out += '\nObfuscated: '
        out += self.short
        
        out += '\nOfficial: '
        out += self.real

        return out

official_mappings = {}
c_short = ''
c_real = ''

progress = 0

for line in lines:
    if progress % 10000 == 0:
        print(progress, 'lines processed.')
    progress += 1
    if line[0:4] != '    ':
        new_class = OfficialMapping('Class')
        new_class.short = line.split()[-1][:-1]
        new_class.real = line.split()[0]
        c_short = new_class.short
        c_real = new_class.real
        key = new_class.category + ":" + new_class.short
        while key in official_mappings:
            key+='x'
        official_mappings[key] = new_class
    else:
        if line.split()[-3][-1] == ')':
            new_item = OfficialMapping('Method')
        else:
            new_item = OfficialMapping('Field')
        new_item.short = c_short + '.' + line.split()[-1]
        new_item.real = c_real + '.' + line.split()[1].split('(')[0]
        key = new_item.category + ":" + new_item.short
        while key in official_mappings:
            key+='x'
        official_mappings[key] = new_item
        
print(len(official_mappings), "Official Mappings")


# Process Yarn Mappings


with open('yarn-tiny-1.16.4+build.local', 'r') as reader:
    lines = reader.readlines()[1:]

print('Yarn file read.')

class YarnMapping:
    def __init__(self, category):
        self.category = category
        
    def to_string(self):
        out = 'Type: ' + self.category
        
        out += '\nOfficial: '
        out += self.short
        
        out += '\nInter: '
        out += self.inter

        out += '\nOfficial: '
        out += self.yarn
        
        return out

yarn_mappings = {}
c_short = ''
c_inter = ''
c_yarn = ''

progress = 0

for line in lines:
    if progress % 10000 == 0:
        print(progress, 'lines processed.')
    progress += 1
    if line[0] == 'C':
        new_class = YarnMapping('Class')
        new_class.short = line.split()[1]
        new_class.inter = line.split()[2]
        new_class.yarn = line.split()[3]
        c_short = new_class.short
        c_inter = new_class.inter
        c_yarn = new_class.yarn
        key = new_class.category + ":" + new_class.short
        while key in yarn_mappings:
            key+='x'
        yarn_mappings[key] = new_class
    else:
        if line[0] == 'M':
            new_item = YarnMapping('Method')
        else:
            new_item = YarnMapping('Field')
        class_ = yarn_mappings['Class:' + line.split()[1]]
        new_item.short = line.split()[1] + '.' + line.split()[3]
        new_item.inter = class_.inter + '.' + line.split()[4]
        new_item.yarn = class_.yarn + '.' + line.split()[5]
        key = new_item.category + ":" + new_item.short
        while key in yarn_mappings:
            key += 'x'
        yarn_mappings[key] = new_item
        
print(len(yarn_mappings), "Yarn Mappings")


# Merge Official and Yarn Mappings


class Mapping:
    def __init__(self, category):
        self.category = category
        
    def to_string(self):
        out = 'Type: ' + self.category
        
        out += '\nObfuscated: '
        out += self.short
        
        out += '\nOfficial: '
        out += self.real
        
        out += '\nIntermediary: '
        out += self.inter

        out += '\nYarn: '
        out += self.yarn
        
        return out

mappings = []

for key, official in official_mappings.items():
    if key in yarn_mappings:
        yarn = yarn_mappings[key]
        
        mapping = Mapping(official.category)
        
        mapping.short = official.short
        mapping.real = official.real
        mapping.inter = yarn.inter
        mapping.yarn = yarn.yarn
        
        mappings.append(mapping)
    else:
        mapping = Mapping(official.category)
        
        mapping.short = official.short
        mapping.real = official.real
        mapping.inter = ''
        mapping.yarn = ''
        
        mappings.append(mapping)

print(len(mappings), "Mappings")


# Export the results to a SQLite database


import sqlite3

conn = sqlite3.connect('mappings.db')
cur = conn.cursor()

sql = 'INSERT INTO Mapping(category,short,real,inter,yarn) VALUES(?,?,?,?,?)'

for mapping in mappings:
    data = (mapping.category, mapping.short, mapping.real, mapping.inter, mapping.yarn)
    cur.execute(sql, data)

conn.commit()