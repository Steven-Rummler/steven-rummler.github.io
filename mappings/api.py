from flask import Flask, request
import sqlite3
import json

app = Flask(__name__)
app.config["DEBUG"] = True

@app.route('/', methods=['GET'])
def home():
    return "<h1>Minecraft Mappings Search Tool API</h1>"

@app.route('/', methods=['POST'])
def search():
    with sqlite3.connect('mappings.db') as conn:
        cur = conn.cursor()
        sql = 'select short, real, inter, yarn from Mapping'

        sql += ' where category = ?'
        data = [request.json['category']]

        data_items = ['short', 'real', 'inter', 'yarn']

        for item in data_items:
            if request.json[item] != '':
                sql += ' and instr(' + item + ', ?) > 0'
                data.append(request.json[item])

        sql += ' order by ?'
        print(request.json['order'])
        data.append(request.json['order'])
        sql += ' limit ?'
        data.append(request.json['number'])
        print(sql, data)
        cur.execute(sql, tuple(data))
        rows = cur.fetchall()
    return json.dumps(rows)


app.run()