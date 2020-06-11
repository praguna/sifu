import numpy as np
from flask import Flask, jsonify, request 
from flask_restful import Resource, Api 
from pymongo import MongoClient
from utils.config import *

class RegisterUser(Resource): 

    def __init__(self):
        mongo_client = MongoClient(atlas_connection_string)
        self.db = mongo_client["food"]

    def get(self): 
        email = request.args.get('email')
        userData = self.getUserData(email)
        response = {
            'userID': str(userData['userID']),
            'username': userData['username']
            }
        return jsonify(response)
  
    def post(self):
        data = request.get_json()
        collection = self.db["UserCollection"]
        data['userID'] = self.generateNewUserID()
        collection.insert_one(data)
        response = {
            "message": "Success: User Registered to Mongo DB",
            "userID": str(data['userID'])
            }
        return jsonify(response)
    
    def generateNewUserID(self):
        collection = self.db["userCounterCollection"]
        doc = collection.find_one_and_update({"_id": "userCounter"}, {"$inc":{"seq":1}}, new=True)
        return doc['seq']

    def getUserData(self, email):
        collection = self.db["UserCollection"]
        doc = collection.find_one({"email": email})
        return doc