export const env = {
    // server:"http://192.168.1.105:5000/" // nitish
    // server : "http://192.168.42.2:5000/"  //praguna
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