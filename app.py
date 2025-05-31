from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import os
import json

app = Flask(__name__)
app.secret_key = 'digital-menu-demo'

# Load menu data once at startup
with open('charlies_menu.json', 'r', encoding='utf-8') as f:
    menu_data = json.load(f)


@app.route('/')
def index():
    # Use the loaded menu_data from global scope
    return render_template('charlies.html', menu=menu_data)


@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    item = request.json
    cart = session.get('cart', [])
    cart.append(item)
    session['cart'] = cart
    return jsonify({"status": "success", "cart": cart})


@app.route('/cart')
def view_cart():
    cart = session.get('cart', [])
    return render_template('cart.html', cart=cart)


@app.route('/submit_order', methods=['POST'])
def submit_order():
    session.pop('cart', None)
    return render_template('thank_you.html')


@app.route('/giulia')
def giulia():
    # Use the same loaded menu_data here too
    return render_template("giulia.html", menu=menu_data)


if __name__ == '__main__':
    # Optional: print all registered routes for debug
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint}: {rule}")

    app.run(host='0.0.0.0', port=8080)
