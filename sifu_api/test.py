import unittest
import app
from PIL import Image
import numpy as np
import os

class TestStringMethods(unittest.TestCase):

    def test_image_predict(self):
        img = Image.open(os.path.join(os.getcwd(),"test_image.jpg"))
        pred = app.predict(img)
        self.assertEqual(type(pred),list)
        self.assertGreater(len(pred) , 0)
    

if __name__ == '__main__':
    app.load_model()
    unittest.main()