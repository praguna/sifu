export const env = {
    server:"http://192.168.1.105:5000/"
}
/*
// nostalgia
 <Button
        onPress = {()=>{
         if(isPressed){ 
          fetch(env.server)
          .then((response) => response.json())
          .then((json) => {
             settextValue(json.message)
          })
          .catch((error) => {
            console.error(error);
          });
          setIsPressed(false);
        }
        else{
          setIsPressed(true);
          settextValue("nothing");
        }
      }}
        title = "Ping Server"
      />
*/