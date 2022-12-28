
import json
from flask import Response, request, jsonify
from flask import render_template
from flask import Flask
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate('key.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()
main_collection = db.collection('todos')

app = Flask(__name__)


# ROUTES


@app.route('/')
def home_page():

    todos = [doc.to_dict() for doc in main_collection.stream()]
    print(todos)

    return render_template('home_page.html', tasks=todos)


@app.route('/save_entry', methods=['GET', 'POST'])
def save_entry():

    main_collection.document().set(request.json)

    collection_ref = db.collection(u'todos')
    retrieving_lista = collection_ref.get()

    updated_list = []

    for new_list in retrieving_lista:
        updated_list.append(new_list.to_dict())

    return jsonify(updated_list)


@app.route('/delete_task', methods=['GET', 'POST'])
def delete_task():

    json_data = request.get_json()
    new_json_input = json_data

    doc_ref_from_stack = db.collection(
        'todos').where('id', '==', new_json_input).stream()

    for data in doc_ref_from_stack:

        data.reference.delete()

    collection_ref = db.collection(u'todos')
    retrieving_lista = collection_ref.get()

    updated_list = []

    for new_list in retrieving_lista:
        updated_list.append(new_list.to_dict())
        print(updated_list)

    return jsonify(updated_list)


@app.route('/replace', methods=['GET', 'POST'])
def replace():

    json_data = request.get_json()
    new_json_input = json_data
    print("bfore***************")
    print(new_json_input)

    docs = main_collection.where(u'id', u'==', new_json_input["id"]).stream()
    if not docs:
        return
    for doc in docs:
        doc_ref = doc
        print(doc_ref.to_dict())
        main_collection.document(doc_ref.id).set(new_json_input)

    docs = main_collection.stream()

    changed_list = []

    for doc in docs:
        convert_dct = doc.to_dict()
        changed_list.append(convert_dct)

    return jsonify(changed_list)


@app.route('/edit_task', methods=['GET', 'POST'])
def edit_task():

    json_data = request.get_json()

    doc_ref_from_stack = db.collection(
        'todos').where('id', '==', json_data).stream()

    updated_list = []

    for data in doc_ref_from_stack:
        updated_list.append(data.to_dict())

    return jsonify(updated_list)


if __name__ == '__main__':
    app.run(debug=True)
