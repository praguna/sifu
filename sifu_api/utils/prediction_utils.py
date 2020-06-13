import numpy as np
import pymongo
from pymongo import MongoClient
Labels = ['tomato',
 'onion',
 'chilli',
 'garlic',
 'carrot',
 'potato',
 'lemon',
 'beans',
 'apple',
 'guava',
 'kiwi',
 'banana',
 'orange',
 'cucumber',
 'ladyfinger',
 'coconut',
 'brinjal',
 'bread',
 'redchillipowder',
 'rice',
 'salt',
 'toordal',
 'uraddal',
 'bayleaf',
 'capsicum',
 'pineapple',
 'cumin',
 'cauliflower',
 'mushroom',
 'corianderpowder',
 'turmeric',
 'garammasala',
 'curryleaves',
 'cabbage',
 'rava',
 'chana',
 'ginger',
 'cardamom',
 'cashewnut',
 'raisin',
 'sugar',
 'cloves',
 'tamarind',
 'bittergourd',
 'peanuts',
 'pumpkin',
 'coriander']

item_dict, ids_dict = None, None

def recognised_ingredients(pred):
    labels = sorted(Labels)
    result = []
    for i,x in enumerate(pred[0]):
        if x >= 0.90: result.append(labels[i])
    return result

def fetch_recipes(client):
    db = client["food"]
    recipe_collection = db["south_Indian_recipes"]
    return list(recipe_collection.find())

def get_items(df,recipes,ingredients = None):
    global item_dict , ids_dict
    if item_dict is None: 
        item_dict = df[['item','item_id']].set_index('item_id').to_dict()['item']
    if ids_dict is None:
        ids_dict = dict([(value,key) for key,value in item_dict.items()])
    if ingredients is None:  
        items = [recipe['Name'] for recipe in recipes]
        items = [ids_dict[x] for x in items if x in ids_dict.keys()]
    else:  
        items = get_filtered_items(recipes , ingredients)
    return items
    

def get_filtered_items(recipes , ingredients):
    # ingredients = ['chilli', 'lemon', 'potato','coconut']
    filtered_items = []
    for recipe in recipes:
        count = 0
        for ing in ingredients:
            if ing in recipe['Ingredients']:
                count+=1
        if count > 0:  filtered_items.append((recipe['Name'] , count))
    filtered_items.sort(reverse=True, key = lambda x : x[-1])
    items = [ids_dict[x[0]] for x in filtered_items if x[0] in ids_dict.keys()]
    return items

def format_predictions(predictions, items):
    predictions = list(predictions[0].flatten())
    predictions = [(x,item_dict[y]) for x,y in zip(predictions , items)]
    predictions.sort(reverse=True, key = lambda x : x[0])
    return predictions

def response_dictionary(recipes , preds, user_id):
    res = {}
    for p in preds:
        for recipe in recipes:
            if recipe['Name'] == p[-1]:
                res[p[-1]] = {"info" : recipe , "score" : p[0], "user_id" : user_id}
                break
    return res
