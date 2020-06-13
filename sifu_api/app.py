# using flask_restful 
# Execute this within sifu_api directory
from flask import Flask, jsonify, request 
from flask_restful import Resource, Api 
import base64
import os
from PIL import Image
import numpy as np
from utils.models import Models
from utils.prediction_utils import *
from utils.user_utils import *
from utils.comment_api import *
from utils.labelByUser_api import *
# import tensorflow.compat.v1 as tf
import tensorflow as tf
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from utils.config import *
import pandas as pd
import numpy as np
from pymongo import MongoClient 

#########################################  Global Initializations and Utilities ##############################
# creating the flask app 
app = Flask(__name__) 
# creating an API object 
api = Api(app) 

#Basic Models and nodes required
ir_model,reco_model = None,None
model_src= None
reco_session,ir_session = None,None
graph1,graph2 = None,None
recipes = None
recommendation_data = None
user,item,output_layer = None,None,None
mongoClient = None

def load_init():
    initializeMongoClient()
    global ir_model, model_src, reco_session, ir_session, graph1, graph2, recommendation_data, reco_model
    global user,item,output_layer
    model_src = Models()
    graph1 = tf.Graph()
    with graph1.as_default():
        ir_session = tf.Session()
        with ir_session.as_default():
            ir_model = model_src.get_inceptionV3()
            ir_path = os.path.join(os.getcwd(),"saved_models","ingredient_recognition","inceptionV3.hdf5")
            ir_model.load_weights(ir_path)
    graph2,user,item,output_layer = model_src.get_NeuMF_reco()
    with graph2.as_default():
        saver = tf.train.Saver()
        reco_session = tf.Session()
        with reco_session.as_default():
            reco_path =  os.path.join(os.getcwd(),"saved_models","recommendation","NeuMF\\")
            saver.restore(reco_session , reco_path)  

#Use only one instance of MongoClient throughout application
def initializeMongoClient():
    global mongoClient
    mongoClient = pymongo.MongoClient(atlas_connection_string)
    #create Index for search query
    db = mongoClient['food']
    collection = db['south_Indian_recipes']
    collection.create_index([('Name', pymongo.TEXT)], name='search_index', default_language='english')

def predict(image):
    global ir_model, model_src, ir_session
    with graph1.as_default():
        with ir_session.as_default():
            img = model_src.preprocess_image(image)
            pred = ir_model.predict(img)
    return recognised_ingredients(pred)

def recommend(ingredients,user_id):
    global recipes , recommendation_data, reco_model, user ,item, output_layer
    if ingredients and  len(ingredients) == 0: 
        ingredients = None
    if recommendation_data is None:
            data_path = os.path.join(os.getcwd(), "saved_models", "recommendation", "recomendation_data.pkl")
            recommendation_data =  pd.read_pickle(data_path)   
    if recipes is None:
       recipes = fetch_recipes(mongoClient)
    with graph2.as_default():
        with reco_session.as_default():
            items,filtered_count = get_items(recommendation_data , recipes ,ingredients)
            feed_dict = {
                user : np.full(len(items),user_id).reshape(-1,1),
                item : np.array(items).reshape(-1,1)
            }
            orginal = reco_session.run([output_layer],feed_dict)
            preds = format_predictions(orginal , items, filtered_count)
            res = response_dictionary(recipes,preds,user_id)
            return preds
#########################################################################################################

class AllRecipes(Resource):
    def get(self):
        db = mongoClient['food']
        collection = db['south_Indian_recipes']
        query = request.args.get("query")
        data = collection.find( { "$text" : { "$search" : query } },{'_id':0})
        response = {'queryResult': []}
        for doc in data:
            recipe = {}
            recipe['Name'] = doc['Name']
            recipe['Ingredients'] = doc['Ingredients']
            recipe['Method'] = doc['Method']
            recipe['Preparation'] = doc['Preparation']
            recipe['Category'] = doc['Category']
            recipe['image'] = {"uri": "data:image/jpeg;base64," + doc['imageBase64'].decode('utf-8')}
            response['queryResult'].append(recipe)
        return jsonify(response)


class Application(Resource): 

    def __init__(self):
        self.max_recommend = 10

    # corresponds to the GET request. 
    # this function is called whenever there 
    # is a GET request for this resource
    def get(self): 
        """
        url : <url>:5000/recommend?userID=<userID>, otherwise returns hello world!
        """
        userId = request.args.get("userID")
        if userId:
            return self.get_json_response(userId)
        return jsonify({'message': 'hello world'}) 
  
    # Corresponds to POST request 
    def post(self):
        """
        url : <url>:5000/recommend  
        data : {
            data : base64 encoded image from phone,
            uid : string formated or an integer number
        }
        """
        data = request.get_json()
        converted_image = self.convert_to_image(data['data'])
        pred = predict(converted_image)
        return self.get_json_response(data['uid'], pred)

    def convert_to_image(self,data):
        byte_array = bytearray(base64.b64decode(data))
        image = Image.open(Image.io.BytesIO(byte_array))
        # image.save("test.jpg")
        # print("Image saved!!")
        return image
    
    def get_json_response(self,uid,pred=None):
        res = recommend(pred, uid)[:self.max_recommend]
        db = mongoClient['food']
        collection = db['south_Indian_recipes']
        response = {
            "recipes": []
        }
        query = self.createQuery(res)
        mdbResult = collection.find(query)
        for doc in mdbResult:
            print(doc['Name'])
            recipe = {}
            recipe['Name'] = doc['Name']
            recipe['Ingredients'] = doc['Ingredients']
            recipe['Method'] = doc['Method']
            recipe['Preparation'] = doc['Preparation']
            recipe['Category'] = doc['Category']
            recipe['image'] = {"uri": "data:image/jpeg;base64," + doc['imageBase64'].decode('utf-8')}
            response['recipes'].append(recipe)
        if pred: 
            response['Ingredients'] = pred

        return jsonify(response)
    
    def createQuery(self,res):
        query = { "Name": {"$in": [] }}
        for x in res:
            query["Name"]["$in"].append(x[1])
        return query
    
  
# adding the defined resources along with their corresponding urls 
api.add_resource(Application, '/recommend')
api.add_resource(RegisterUser, '/registerUser') 
api.add_resource(Comment, '/comment')
api.add_resource(LabelByUser, '/labelByUser')
api.add_resource(AllRecipes, '/search')
  
  
# driver function 
if __name__ == '__main__': 
    load_init()
    app.run(host="0.0.0.0",port=5000,debug = True)