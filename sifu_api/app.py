# using flask_restful 
from flask import Flask, jsonify, request 
from flask_restful import Resource, Api 
import matplotlib.pyplot as plt
import base64
from PIL import Image
import numpy as np

# creating the flask app 
app = Flask(__name__) 
# creating an API object 
api = Api(app) 

class Application(Resource): 
  
    # corresponds to the GET request. 
    # this function is called whenever there 
    # is a GET request for this resource
    def get(self): 
        return jsonify({'message': 'hello world'}) 
  
    # Corresponds to POST request 
    def post(self):
        data = request.get_json()
        self.convert_to_image(data['data'])
        return jsonify({'message' : 'okay' , 'data': ['item1' ,'item2' ,'item3' ,'itme4' ,'item5']})

    def convert_to_image(self,data):
        byte_array = bytearray(base64.b64decode(data))
        image = Image.open(Image.io.BytesIO(byte_array))
        # plt.imshow(image)
        image = np.asarray(image)
        print("Successfully read the image !!")
        pass
    
    
  
# adding the defined resources along with their corresponding urls 
api.add_resource(Application, '/') 
  
  
# driver function 
if __name__ == '__main__': 
    app.run(host="192.168.1.105",debug = True) 
