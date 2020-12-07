function toChesses2Slug(s){return s.toLowerCase().replace(/[^a-z0-9]/g, "");}
function toChesses2RoomId(s){return "Chesses2_"+toChesses2Slug(s);}
function errorAlert(error){
  alert("There has been a networking error; if you find yourself unable to play, please refresh the page.\n"+error);
  console.log(error);
}

let conns = [];

function multiplayer_join(name){
  roomid = toChesses2RoomId(name);
  var peer = new Peer({debug: 3});
  peer.on('error', errorAlert); //we actually just 
  peer.on('open', function(id) {
    console.log('Joined! My peer ID is: ' + id);
    conn = peer.connect(roomid);
    conn.on('open', function() {
      conns.push(conn); //store host for later use
      // Receive messages from host
      conn.on('data', function(data) {
        console.log('Received', data);
        //handle incoming communications from host here
        if(data.constructor === Array){chess.move(data[0], data[1], data[2], data[3]);}
      });
      conn.send('Hello!');
    });
  });
  //do things once you join here
}

function multiplayer_host(name){
  //connect
  roomid = toChesses2RoomId(name);
  var peer = new Peer(roomid,{debug: 3});
  peer.on('error', errorAlert);
  peer.on('open', function(id) {
    console.log('Hosting! My peer ID is: ' + id);
    peer.on('connection', function(conn){
      console.log("receiving a connection");
      conn.on('open', function() {
        // A new player has arrived.
        conns.push(conn);
        conn.on('data', function(data) {
          console.log(conn, " sent ", data);
          //handle incoming communications from player here
          if(data.constructor === Array){
            multiplayer_send(data[0], data[1], data[2], data[3]);
            chess.move(data[0], data[1], data[2], data[3]);}
        });
      });
    });
  });
  //do things once you become host here
}

function multiplayer_send(from, to, silent, multiplayer_this_move_is_from_another_player){
  for (c of conns){
    c.send([from, to, silent, multiplayer_this_move_is_from_another_player]);
  }
}