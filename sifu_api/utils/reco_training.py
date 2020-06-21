# import numpy as np
# import pymongo
# from pymongo import MongoClient
# import pandas as pd
# from utils.config import *


# def get_negatives(uids, iids, items, df_test):
#     negativeList = []
#     test_u = df_test['user_id'].values.tolist()
#     test_i = df_test['item_id'].values.tolist()

#     test_ratings = list(zip(test_u, test_i))
#     zipped = set(zip(uids, iids))

#     for (u, i) in test_ratings:
#         negatives = []
#         negatives.append((u, i))
#         for t in range(100):
#             j = np.random.randint(len(items)) # Get random item id.
#             while (u, j) in zipped: # Check if there is an interaction
#                 j = np.random.randint(len(items)) # If yes, generate a new item id
#             negatives.append(j) # Once a negative interaction is found we add it.
#         negativeList.append(negatives)

#     df_neg = pd.DataFrame(negativeList)

#     return df_neg

# def mask_first(x):
#     result = np.ones_like(x)
#     result[0] = 0
#     return result

# def train_test_split(df):
#     df_test = df.copy(deep=True)
#     df_train = df.copy(deep=True)
#     df_test = df_test.groupby(['user_id']).first()
#     df_test['user_id'] = df_test.index
#     df_test = df_test[['user_id', 'item_id', 'rating']]
#     df_test.index.name = ""
#     mask = df.groupby(['user_id'])['user_id'].transform(mask_first).astype(bool)
#     df_train = df.loc[mask]
#     return df_train, df_test

# def fetch_reviews():
#     client = MongoClient(atlas_connection_string)
#     db = client["food"]
#     recipe_collection = db["ReviewData"]
#     client.close()
#     return list(recipe_collection.find())

# def train_test_split(df):
#     df_test = df.copy(deep=True)
#     df_train = df.copy(deep=True)
#     df_test = df_test.groupby(['user_id']).first()
#     df_test['user_id'] = df_test.index
#     df_test = df_test[['user_id', 'item_id', 'rating']]
#     df_test.index.name = ""
#     mask = df.groupby(['user_id'])['user_id'].transform(mask_first).astype(bool)
#     df_train = df.loc[mask]
#     return df_train, df_test

# def get_train_instances():
#      user_input, item_input, labels = [],[],[]
#      zipped = set(zip(uids, iids))
#      for (u, i) in zip(uids,iids):
#          user_input.append(u)
#          item_input.append(i)
#          labels.append(1)
#          for t in range(num_neg):
#              j = np.random.randint(len(items))
#              while (u, j) in zipped:
#                  j = np.random.randint(len(items))
#              user_input.append(u)
#              item_input.append(j)
#              labels.append(0)
#      return user_input, item_input, labels

# from sklearn.utils import shuffle
# import random
# def random_mini_batches(U, I, L, mini_batch_size=256):
#     mini_batches = []
#     shuffled_U, shuffled_I, shuffled_L = shuffle(U, I, L)
#     num_complete_batches = int(math.floor(len(U)/mini_batch_size))
#     for k in range(0, num_complete_batches):
#         mini_batch_U = shuffled_U[k * mini_batch_size : k * mini_batch_size + mini_batch_size]
#         mini_batch_I = shuffled_I[k * mini_batch_size : k * mini_batch_size + mini_batch_size]
#         mini_batch_L = shuffled_L[k * mini_batch_size : k * mini_batch_size + mini_batch_size]
#         mini_batch = (mini_batch_U, mini_batch_I, mini_batch_L)
#         mini_batches.append(mini_batch)
#     if len(U) % mini_batch_size != 0:
#         mini_batch_U = shuffled_U[num_complete_batches * mini_batch_size: len(U)]
#         mini_batch_I = shuffled_I[num_complete_batches * mini_batch_size: len(U)]
#         mini_batch_L = shuffled_L[num_complete_batches * mini_batch_size: len(U)]
#         mini_batch = (mini_batch_U, mini_batch_I, mini_batch_L)
#         mini_batches.append(mini_batch)
#     return mini_batches