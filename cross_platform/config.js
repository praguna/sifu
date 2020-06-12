export const env = {
    server:"http://172.20.10.6:5000/" // vishnu
    // server : "http://192.168.42.2:5000/"  // praguna
    // server : "http://192.168.43.117:5000/"  // nitish
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