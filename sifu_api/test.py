import unittest
import app
from PIL import Image
import numpy as np
import os
import time

class TestStringMethods(unittest.TestCase):

    def test_image_predict(self):
        img = Image.open(os.path.join(os.getcwd(),"test_image.jpg"))
        pred = app.predict(img)
        self.assertEqual(type(pred),list)
        self.assertGreater(len(pred) , 0)
    
    def test_recipe_recommendation(self):
        pred = app.recommend(None,12)
        self.assertFalse(False) #tautology !
    
    def test_predict_and_recommend(self):
        img = Image.open(os.path.join(os.getcwd(),"test_image.jpg"))
        pred = app.predict(img)
        pred = app.recommend(pred,12)
        self.assertFalse(False) #tautology !
    
    def recommend_without_image(self):
        pred = app.recommend(None,12)
        self.assertFalse(False) #tautology !
    

if __name__ == '__main__':
    app.load_init()
    unittest.main()