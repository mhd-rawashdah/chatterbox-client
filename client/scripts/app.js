// YOUR CODE HERE:
let app = {}
$(document).ready(() => {
	app.server = 'http://parse.rbk.hackreactor.com/chatterbox/classes/messages';
	// object contain name of room as a key and all messages to this  rom as array of object ;
	app.rooms = {};
  app.messages = [];
	app.init = () => {
		// we can put the initial virables and any things we want to run first like functions , etc ; 

	};
	app.send = (message) => {    // this message represant object 
		$.ajax({
			url :app.server,
			type: 'POST',
			data: JSON.stringify(message),
			contentType: 'application/json',
			success : (data) => {
				console.log('success', data);
				$('#chats').html('');
				// to remove value from text after send data
				$('#message-input').val().text('');
				app.fetch();
			},
			error: (data) => {
				console.log("Failed to send Message ", data);
			} 
		})
	};
	app.fetch = () => {
		// $.get(app.server, (data) => {
		// 	console.log(data);
		// });
		$.ajax({
			url :app.server,
			type: 'GET',
			data: {order: '-createdAt'},
			contentType: 'application/json',
			success : (data) => {
				// iterative to render all the message
				data.results.forEach((elem) => {
					app.renderMessage(elem);
					app.addRooms(elem);
					 // we are only passing the rome name from each element which is the passed message
					});
				// add the room
				console.log('successfuly retrived', data);
			},
			error: (data) => {
				console.log("Failed during fetch messages ", data);
			} 
		})

	};
	app.clearMessages = () => {
		$('#chats').html(''); //  clear(delete) all the message inside the div of chats
	};
	app.renderMessage = (message) => {
		let $containerMsg = $(`<div class ="chat" id=${message.username}></div>`); // we use message.username as uniqe id for eacg message;
		let $label = $(`<label class="username" id="user">@${message.username}</label>`);  // using ES6
		 //  var $label = $('<label class="username" id="user">'+message.username+'</label>');
		 // $('#user').text(message.username);
         //$('#message').text(message.text); 
         let $text = $(`<p id="message">${message.text}</p>`); 
         $containerMsg.append($label);
         $containerMsg.append($text);
         $('#chats').append($containerMsg);
     };
	//{roomname1: [message1,meeessage], ghjh:[],
	// roomname2 : .....   }
	
	app.addRooms = (message) => {
		if (!app.rooms[message.roomname]) {
			app.rooms[message.roomname] = [message];
      	app.renderRoom(message.roomname) //

      }
      else {
      	app.rooms[message.roomname].push(message)
      }
  }
  app.renderRoom = (room) => { 
				let $selectRoom = $(`<option value = "${room}" >${room}</option>`) // don't forget the back tic " ` " Ghadeer
				$("#roomSelect").append($selectRoom);	
			}
// call fetch function to retrive the rata from erver
app.fetch();
// button to send message
$('#submit-btn').on('click', () => {
	let message ={};
	message.text = $('#message-input').val(); 
	let getUserName = window.location.search.substring(window.location.search.indexOf('username'));
	message.username = getUserName.substring(getUserName.indexOf('=')+1);
	message.roomname = "RBK 5";
	app.send(message);
})
// filter the messages based on the name of room
$("#roomSelect").change(function(){
    //UNDO
   let roomMsgs = app.rooms[$(this).val()];
   app.clearMessages();
   roomMsgs.forEach((elem) => {
   	app.renderMessage(elem)
   })
});

 // we have to call it so it can run auto when our app run 

});
