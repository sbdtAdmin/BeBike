
import pickle
from flask import Flask, request, jsonify, render_template
import os

app = Flask(__name__)

DB_FILE = 'orders.db'
COMPLETED_DB_FILE = 'completed_orders.db'

def load_orders(db_file):
    if os.path.exists(db_file):
        with open(db_file, 'rb') as f:
            return pickle.load(f)
    return []

def save_orders(orders, db_file):
    with open(db_file, 'wb') as f:
        pickle.dump(orders, f)

def send_notifications(phone, order_type):
    if phone:
        text = """לקוח יקר
        
השארת אצלינו לתיקון כלי מסוג: 
{type}

אתה מוזמן להגיע לחנות לאסוף את הכלי מהחנות.
שעות פעילות:
א-ה: 10:00 - 17:00
ו: 10:00 - 13:00

בברכה
צוות BeBike
"""
        os.system(f'''termux-sms-send -n {str(phone)} "{text.format(**{
            "type": order_type
        })}"''')
        print(f'Sending notification to {phone} for {order_type}')

@app.route('/')
def index():
    return render_template('BeBike.html')

@app.route('/add_order', methods=['POST'])
def add_order():
    data = request.get_json()
    orders = load_orders(DB_FILE)
    orders.append(data)
    save_orders(orders, DB_FILE)
    return jsonify({'status': 'success'})

@app.route('/get_orders', methods=['GET'])
def get_orders():
    orders = load_orders(DB_FILE)
    return jsonify(orders)

@app.route('/get_completed_orders', methods=['GET'])
def get_completed_orders():
    orders = load_orders(COMPLETED_DB_FILE)
    return jsonify(orders)

@app.route('/complete_order', methods=['POST'])
def complete_order():
    data = request.get_json()
    phone = data.get('phone')
    order_type = data.get('orderType')
    send_notifications(phone, order_type)
    
    orders = load_orders(DB_FILE)
    completed_orders = load_orders(COMPLETED_DB_FILE)
    for order in orders:
        if order['clientPhone'] == phone:
            order['status'] = 'הושלם'
            completed_orders.append(order)
            orders.remove(order)
            break
    save_orders(orders, DB_FILE)
    save_orders(completed_orders, COMPLETED_DB_FILE)
    return jsonify({'status': 'success'})

@app.route('/delete_order', methods=['POST'])
def delete_order():
    data = request.get_json()
    phone = data.get('phone')
    
    orders = load_orders(DB_FILE)
    orders = [order for order in orders if order['clientPhone'] != phone]
    save_orders(orders, DB_FILE)
    return jsonify({'status': 'success'})

@app.route('/delete_completed_order', methods=['POST'])
def delete_completed_order():
    data = request.get_json()
    phone = data.get('phone')
    
    orders = load_orders(COMPLETED_DB_FILE)
    orders = [order for order in orders if order['clientPhone'] != phone]
    save_orders(orders, COMPLETED_DB_FILE)
    return jsonify({'status': 'success'})

@app.route('/clear_orders', methods=['POST'])
def clear_orders():
    save_orders([], DB_FILE)
    return jsonify({'status': 'success'})

@app.route('/clear_completed_orders', methods=['POST'])
def clear_completed_orders():
    save_orders([], COMPLETED_DB_FILE)
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run("0.0.0.0", debug=True, port=8000)
