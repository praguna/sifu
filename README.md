### For the app to work properly :
1. Download inception_V3_improved.hdf5 as inception_V3.hdf5 in saved_models/ingredient_recognition. I will figure out how to download dynamically from s3 later.
2. To test backend you can run test.py and also develop it with some unit tests if you want.

### Some basic info for backend :
1. Request and respose are jsons
2. We respond to a request with a large json.
3. Request comes as base64 image and user_id.
4. We predict and recommend for the same.
5. MongoDb integration is also present.

### Some basic info for frontend:
1. There is a camera screen and a display screen (I think you all know this , we need to add a few frontend features)

### Frontend
1. Home screen which displays most popular recipes, take picture.
2. Recipe screen which displays a picture of dish and lists ingredients and recipes.
3. Camera screen to take picture.
4. Display screen to display the identified ingredients and recommended recipes.
