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
    filtered_count = None
    if item_dict is None: 
        item_dict = df[['item','item_id']].set_index('item_id').to_dict()['item']
    if ids_dict is None:
        ids_dict = dict([(value,key) for key,value in item_dict.items()])
    if ingredients is None:  
        items = [recipe['Name'] for recipe in recipes]
        items = [ids_dict[x] for x in items if x in ids_dict.keys()]
    else:  
        items,filtered_count = get_filtered_items(recipes , ingredients)
    return items,filtered_count
    

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
    filtered_count = []
    items = [ids_dict[x[0]] for x in filtered_items if x[0] in ids_dict.keys()]
    filtered_count = [x for x in filtered_items if x[0] in ids_dict.keys()]
    return items,filtered_count

def format_predictions(predictions, items, filtered_count=None):
    predictions = list(predictions[0].flatten())
    predictions = [(x,item_dict[y]) for x,y in zip(predictions , items)]
    result = []
    if filtered_count:
        new_dict = {}
        for i,x in enumerate(filtered_count):
           try:  new_dict[x[-1]].append(predictions[i])
           except KeyError:  new_dict[x[-1]] = [predictions[i]]
        k = list(new_dict.keys()).sort(reverse=True)
        for k in new_dict:
            new_dict[k].sort(reverse = True, key = lambda x : x[0])
            result.extend(new_dict[k])
        # print(new_dict)
        # print("-------------------------")
        print("Recommended : ",result)
        return result
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
