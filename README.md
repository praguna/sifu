### For the app to work properly :
1. Download inception_V3_improved.hdf5 as inception_V3.hdf5 in saved_models/ingredient_recognition. I will figure out how to download dynamically from s3 later.
2. To test backend you can run test.py and also develop it with some unit tests if you want.

### Some basic info for backend :
1. Request and response are in json
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

### Information on Api Updates
1. Use get request url:5000/recommendImage?uid=userId to get automatic recommendation for a user.
2. Use get http://localhost:5000/comment?recipe_name=${recipe_name}, for getting comments for the recipe
3. The rest are post requests, refer to the code api to see details