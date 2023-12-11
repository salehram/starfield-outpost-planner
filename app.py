import os
from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from pymongo import MongoClient
import base64
import json
from flask_cors import CORS
from flask_session import Session

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY')
app.config['SESSION_TYPE'] = 'filesystem'

Session(app)
CORS(app)

# Connect to MongoDB
client = MongoClient(os.environ.get('MONGODB_URI')) #27017
modules_collection_name = 'modules'
resources_collection_name = 'resources'


def get_db_name():
    return os.environ.get('DATABASE_NAME')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/planner')
def planner():
    db_name = get_db_name()
    db = client[db_name]
    modules_collection = db[modules_collection_name]
    module_names = [module['name'] for module in modules_collection.find()]

    # Retrieving and caching resources' masses
    resources_collection = db[resources_collection_name]
    resources = {resource['name']: resource['mass'] for resource in resources_collection.find()}
    session['resources_masses'] = resources

    return render_template('table.html', module_names=module_names)


@app.route('/get-module-resources/<module_name>')
def get_module_resources(module_name):
    db_name = get_db_name()
    db = client[db_name]
    modules_collection = db[modules_collection_name]

    module = modules_collection.find_one({"name": module_name})
    if not module:
        return jsonify({"error": "Module not found"}), 404

    resources = module.get('resources', {})
    return jsonify({"resources": resources})


@app.route('/get-module-names')
def get_module_names():
    db_name = get_db_name()
    db = client[db_name]
    modules_collection = db[modules_collection_name]

    module_names = [module['name'] for module in modules_collection.find()]
    return jsonify(module_names)


@app.route('/display-build')
def display_build():
    serialized_data = request.args.get('build')
    if serialized_data:
        try:
            build_data = base64.b64decode(serialized_data).decode('utf-8')
            build_data_dict = json.loads(build_data)
            return render_template('display_build.html', build_data=build_data_dict, builddata=serialized_data)
        except Exception as e:
            return f"Error processing build data: {e} - {build_data}", 400
    return "No build data provided "+ build_data, 400


@app.route('/get-all-resources')
def get_all_resources():
    db_name = 'sf_outposts'
    db = client[db_name]
    resources_collection = db[resources_collection_name]
    resources = list(resources_collection.find({}, {'_id': 0, 'name': 1, 'mass': 1}))
    return jsonify(resources)


@app.route('/get-resources-masses')
def get_resources_masses():
    return jsonify(session.get('resources_masses', {}))


if __name__ == "__main__":
    app.run(debug=False, host='0.0.0.0', port=8080)
