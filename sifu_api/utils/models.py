import keras
from keras.layers.core import Dense, Dropout
from keras.engine.training import Model
from keras.optimizers import Adam
from keras.applications.inception_v3 import InceptionV3
from keras.layers.pooling import GlobalAveragePooling2D
from PIL import Image
import numpy as np
import os
import tensorflow as tf
# import tensorflow.compat.v1 as tf
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
# tf.disable_v2_behavior()
class Models():
    def __init__(self):
        self.shape = (1000,1000,3)
        self.loss = 'binary_crossentropy'
        self.metrics = ['accuracy']
        self.num_classes = 47
        self.lr = 1e-4
        self.num_users = 1496
        self.num_items = 119

    def get_inceptionV3(self):
        base_model = InceptionV3(weights= None, include_top=False, input_shape= self.shape,classes=self.num_classes)
        x = base_model.output
        x = GlobalAveragePooling2D()(x)
        x = Dropout(0.3)(x)
        x = Dense(self.num_classes, activation= 'sigmoid', name="aux_layer")(x)
        model = keras.models.Model(inputs = base_model.input, outputs = x)
        model.compile(optimizer = Adam(lr = self.lr), loss = self.loss, metrics = self.metrics)
        return model
        
    def get_NeuMF_reco(self):
        g = tf.Graph()
        with g.as_default():
            latent_features = 8
            # Define input placeholders for user, item
            user = tf.placeholder(tf.int32, shape=(None, 1))
            item = tf.placeholder(tf.int32, shape=(None, 1))
            # User embedding for MLP
            mlp_u_var = tf.Variable(tf.random_normal([self.num_users, 32], stddev=0.05),
                    name='mlp_user_embedding')
            mlp_user_embedding = tf.nn.embedding_lookup(mlp_u_var, user)
            # Item embedding for MLP
            mlp_i_var = tf.Variable(tf.random_normal([self.num_items, 32], stddev=0.05),
                    name='mlp_item_embedding')
            mlp_item_embedding = tf.nn.embedding_lookup(mlp_i_var, item)
            # User embedding for GMF
            gmf_u_var = tf.Variable(tf.random_normal([self.num_users, latent_features],
                stddev=0.05), name='gmf_user_embedding')
            gmf_user_embedding = tf.nn.embedding_lookup(gmf_u_var, user)
            gmf_i_var = tf.Variable(tf.random_normal([self.num_items, latent_features],
                stddev=0.05), name='gmf_item_embedding')
            gmf_item_embedding = tf.nn.embedding_lookup(gmf_i_var, item)
            gmf_user_embed = tf.keras.layers.Flatten()(gmf_user_embedding)
            gmf_item_embed = tf.keras.layers.Flatten()(gmf_item_embedding)
            gmf_matrix = tf.multiply(gmf_user_embed, gmf_item_embed)
            mlp_user_embed = tf.keras.layers.Flatten()(mlp_user_embedding)
            mlp_item_embed = tf.keras.layers.Flatten()(mlp_item_embedding)
            mlp_concat = tf.keras.layers.concatenate([mlp_user_embed, mlp_item_embed])
            mlp_dropout = tf.keras.layers.Dropout(0.2)(mlp_concat)
            mlp_layer_1 = tf.keras.layers.Dense(64, activation='relu', name='layer1')(mlp_dropout)
            mlp_batch_norm1 = tf.keras.layers.BatchNormalization(name='batch_norm1')(mlp_layer_1)
            mlp_dropout1 = tf.keras.layers.Dropout(0.2, name='dropout1')(mlp_batch_norm1)
            mlp_layer_2 = tf.keras.layers.Dense(32, activation='relu', name='layer2')(mlp_dropout1)
            mlp_batch_norm2 = tf.keras.layers.BatchNormalization(name='batch_norm1')(mlp_layer_2)
            mlp_dropout2 = tf.keras.layers.Dropout(0.2, name='dropout1')(mlp_batch_norm2)
            mlp_layer_3 = tf.keras.layers.Dense(16, activation='relu', name='layer3')(mlp_dropout2)
            mlp_layer_4 = tf.keras.layers.Dense(8, activation='relu', name='layer4')(mlp_layer_3)
            merged_vector = tf.keras.layers.concatenate([gmf_matrix, mlp_layer_4])
            output_layer = tf.keras.layers.Dense(1,
                    kernel_initializer="lecun_uniform",
                    name='output_layer')(merged_vector)
        return g,user,item,output_layer            
        
    def preprocess_image(self,image:Image):
        img  = np.asarray(image.resize(self.shape[:2], Image.NEAREST))/255.
        return np.array([img])
