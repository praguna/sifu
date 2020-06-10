import numpy as np
from flask import Flask, jsonify, request 
from flask_restful import Resource, Api 
from pymongo import MongoClient
from utils.config import *

class RegisterUser(Resource): 

    def get(self): 
        return jsonify({'message': 'hello world'}) 
  
    def post(self):
        mongoClient = MongoClient(atlas_connection_string)
        data = request.get_json()
        db = mongoClient["food"]
        collection = db["UserCollection"]
        collection.insert_one(data)
        response = {"message": "Success: User Registered to Mongo DB"}
        return jsonify(response)