export const env = {
    server:"http://192.168.42.2:5000/"
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