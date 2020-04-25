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

# creating the flask app 
app = Flask(__name__) 
# creating an API object 
api = Api(app) 

ir_model,model_src= None,None

def load_model():
    global ir_model, model_src
    model_src = Models()
    ir_model = model_src.get_inceptionV3()
    ir_path = os.path.join(os.getcwd(),"saved_models","ingredient_recognition","inceptionV3.hdf5")
    ir_model.load_weights(ir_path)

def predict(image):
    global ir_model, model_src
    img = model_src.preprocess_image(image)
    pred = ir_model.predict(img)
    return recognised_ingredients(pred)

class Application(Resource): 

    # corresponds to the GET request. 
    # this function is called whenever there 
    # is a GET request for this resource
    def get(self): 
        return jsonify({'message': 'hello world'}) 
  
    # Corresponds to POST request 
    def post(self):
        data = request.get_json()
        converted_image = self.convert_to_image(data['data'])
        return jsonify({'message' : 'okay' , 'data': ['item1' ,'item2' ,'item3' ,'itme4' ,'item5']})

    def convert_to_image(self,data):
        byte_array = bytearray(base64.b64decode(data))
        image = Image.open(Image.io.BytesIO(byte_array))
        image = np.asarray(image)
        print("Successfully read the image !!")
        return image
    
    
  
# adding the defined resources along with their corresponding urls 
api.add_resource(Application, '/predict') 
  
  
# driver function 
if __name__ == '__main__': 
    load_model()
    app.run(host="0.0.0.0",port=5000,debug = True) 
