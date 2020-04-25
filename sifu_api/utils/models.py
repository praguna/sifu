import keras
from keras.layers.core import Dense, Dropout
from keras.engine.training import Model
from keras.optimizers import Adam
from keras.applications.inception_v3 import InceptionV3
from keras.layers.pooling import GlobalAveragePooling2D
from PIL import Image
import numpy as np
class Models():
    def __init__(self):
        self.shape = (1000,1000,3)
        self.loss = 'binary_crossentropy'
        self.metrics = ['accuracy']
        self.num_classes = 47
        self.lr = 1e-4

    def get_inceptionV3(self):
        base_model = InceptionV3(weights= None, include_top=False, input_shape= self.shape,classes=self.num_classes)
        x = base_model.output
        x = GlobalAveragePooling2D()(x)
        x = Dropout(0.3)(x)
        x = Dense(self.num_classes, activation= 'sigmoid', name="aux_layer")(x)
        model = keras.models.Model(inputs = base_model.input, outputs = x)
        model.compile(optimizer = Adam(lr = self.lr), loss = self.loss, metrics = self.metrics)
        return model
        
    def preprocess_image(self,image:Image):
        img  = np.asarray(image.resize(self.shape[:2], Image.NEAREST))/255.
        return np.array([img])
