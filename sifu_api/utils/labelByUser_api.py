import numpy as np
from flask import Flask, jsonify, request 
from flask_restful import Resource, Api 
from pymongo import MongoClient
from utils.config import *

class LabelByUser(Resource): 

    def __init__(self):
        mongo_client = MongoClient(atlas_connection_string)
        self.db = mongo_client["food"]
  
    def post(self):
        data = request.get_json()
        data['ingredients'] = data['ingredients'].replace(" ", "")
        collection = self.db["UserLabeledImages"]
        collection.insert_one(data)
        response = {"message": "Thank you for your contribution"}
        return jsonify(response)
