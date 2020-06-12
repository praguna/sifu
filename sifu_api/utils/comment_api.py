import numpy as np
import time
from flask import Flask, jsonify, request 
from flask_restful import Resource, Api 
from pymongo import MongoClient
from bson import json_util
from utils.config import *


class Comment(Resource):
    def __init__(self):
        mongo_client = MongoClient(atlas_connection_string)
        db = mongo_client["food"]
        self.collection = db["ReviewData"]

    def get(self):
        """
        usage:      http://localhost:5000/comment?recipe_name=${recipe_name}
        """
        recipe_name = request.args.get('recipe_name')
        
        query = {"rName": recipe_name}
        
        responses = self.collection.find(query, {'_id':0})
        result = []
        for response in responses:
            result.append(response)

        return jsonify(result)

    def post(self):
        """
        usage:      Post request Body:-
                    ReviewID:5
                    rName:"Rava Vada"
                    rating:4
                    comment:"Good"
                    username: "Name"
        """
        
        data = request.get_json() 
        data['timestamp'] = int(time.time()*1000)
        self.collection.insert_one(data)
        response = {"message": "Success: Comment posted to Mongo DB"}
        return jsonify(response)
