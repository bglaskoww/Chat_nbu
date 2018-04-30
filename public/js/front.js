'use strict';

var socket = io.connect('//:8080');
var myName = null;
var chatWith = null;
var chatUsers = null;

socket.on('hello', function (data) {
	console.log('Server said hello!', data);
// TODO: Use the tokens here - send the token and receive username from the serverd
	var savedUsername = window.sessionStorage.getItem('username');
	if (savedUsername) {
		socket.emit('login', {nick: savedUsername});
	}
});
socket.on('disconnect', function (data) {
	console.log('Goodbye server');
	document.getElementById('chatRoom').style.display = 'none';
});
socket.on('loginSuccess', function (data) {
	console.log('Login success!', data);
	myName = data.nick;
	window.sessionStorage.setItem('user_info', data); // infoto koi kwo otkogo za kogo i tn data
	document.getElementById('chatRoom').style.display = 'flex';
});

socket.on('usersList', function (data) {
	if (data.users && data.users.length) {
		chatUsers = data.users;
		updateUsersList();
	}
});

socket.on('receiveMessage', function (data) {
	console.log(data);
	if (data.from && data.from == chatWith) {
		document.getElementById('messageDialog').innerHTML += '<div class="text-right">'
				+ data.msg + '<br /><small class="text-muted">'
				+ new Date()
			+ '</small></div>';
		document.getElementById('messageDialog').scrollTo(0, document.getElementById('messageDialog').scrollHeight);
	} else {
		var newMessages = parseInt(window.sessionStorage.getItem('chat_MessagesNew_' +data.from) || 0);
		window.sessionStorage.setItem('chat_MessagesNew_' +data.from, ++newMessages);
		console.log('new messages avialable', window.sessionStorage.getItem('chat_MessagesNew_' +data.from));
		updateUsersList();
	}
	var messagesHistory = JSON.parse(window.sessionStorage.getItem('chat_Messages_' +data.from) || '[]');
	messagesHistory.push({
		ts: new Date(),
		from_me: false,
		msg: data.msg
	});
	window.sessionStorage.setItem('chat_Messages_' +data.from, JSON.stringify(messagesHistory));
});

function sendMessage() {
	socket.emit('sendMessage', {
		to: chatWith,
		msg: document.getElementById('sendMsgField').value
	});

	// Save to history
	var messagesHistory = JSON.parse(window.sessionStorage.getItem('chat_Messages_' +chatWith) || '[]');
	messagesHistory.push({
		ts: new Date(),
		from_me: true,
		msg: document.getElementById('sendMsgField').value
	});
	window.sessionStorage.setItem('chat_Messages_' +chatWith, JSON.stringify(messagesHistory));

	document.getElementById('messageDialog').innerHTML += '<div class="">'
			+ document.getElementById('sendMsgField').value + '<br /><small class="text-muted">'
			+ new Date()
		+ '</small></div>';
	document.getElementById('messageDialog').scrollTo(0, document.getElementById('messageDialog').scrollHeight);

	document.getElementById('sendMsgField').value="";
	document.getElementById('sendMsgField').focus();
}

function startChatWith(user) {
	chatWith = user;
	updateUsersList();
	updateChatWindow();

	// Reset any old message counters
	window.sessionStorage.setItem('chat_MessagesNew_' +user, '0');
}

function updateChatWindow() {
	var dom = document.getElementById('chatWindow');
	dom.innerHTML = chatwindow_template.chat_template(chatWith);
	showChatHistory();
}

function showChatHistory() {
	var dom = document.getElementById('messageDialog');
	var history = JSON.parse(window.sessionStorage.getItem('chat_Messages_' +chatWith) || '[]');
	console.log('Showing history', history);
	for (var i = Math.max(history.length-30, 0); i<history.length; i++) {
		var p = document.createElement('div');
		p.innerHTML = '' + history[i].msg + '<br /><small class="text-muted">' +new Date(history[i].ts) + '</small>';
		if (!history[i].from_me) {
			p.className = 'text-right';
		}
		dom.appendChild(p);
	}
	document.getElementById('messageDialog').scrollTo(0, document.getElementById('messageDialog').scrollHeight);
}

function updateUsersList() {
	var dom = document.getElementById('usersList');
	dom.innerHTML = '<div class="list-group">';
	chatUsers.forEach(function(user) {
		if (user == myName) {
			dom.innerHTML += '<div class="list-group-item list-group-item-action disabled">'
				+ user + '</div>';
		} else {
			if (user == chatWith) {
				dom.innerHTML += '<a href="#" onclick="startChatWith(\'' +user+ '\'); return false;" class="list-group-item list-group-item-action active">'
					+ user + '</a>';
			} else {
				var newMessages = parseInt(window.sessionStorage.getItem('chat_MessagesNew_' +user) || 0, 10);
				var domHTML = '<a href="#" onclick="startChatWith(\'' +user+ '\'); return false;" class="list-group-item list-group-item-action">' + user;
				if (newMessages > 0) {
					domHTML += '<span class="badge badge-info float-right">'+ newMessages.toString() +'</span>';
				}
				domHTML += '</a>';
				dom.innerHTML += domHTML;
			}
		}
	});
	dom.innerHTML += '</div>';
}

jQuery('#ChatRegistration').on('submit', function(e) {
	e.preventDefault();
	jQuery.ajax({
	  type: "POST",
	  url: '/register',
	  data: {
	  	name: jQuery(this).find('#name').val(),
	  	nickname: jQuery(this).find('#nickname').val(),
	  	password: jQuery(this).find('#password').val(),
	  	email: jQuery(this).find('#email').val(),
	  	gender: jQuery(this).find('#gender').val(),
	  	// token: jQuery(this).find('#token').val()
	  },
	  success: function(ret) {
	  	console.log(ret);
	  },
		error: function(data) {
        console.log(ret);
            }
	  //dataType: dataType
	});
}
);
jQuery('#loginForm').on('submit', function(e) {
        e.preventDefault();
        jQuery.ajax({
            type: "POST",
            url: '/login',
            data: {
                nickname: jQuery(this).find('#nickname').val(),
                password: jQuery(this).find('#password').val(),
                email: jQuery(this).find('#email').val(),
                token: jQuery(this).find('#token').val()
            },
            success: function(data) {

            	window.location = 'http://' + window.location.host + '/chat';

                const parsedData = JSON.parse(data);
                sessionStorage.setItem('username', parsedData.username);
                sessionStorage.setItem('authToken', parsedData.token);

            },
            error: function(error) {
                console.log(error);
            }
        });
    }
);

function redirect_to_login(){
	window.location = 'http://' + window.location.host + '/login';
}
function redirect_to_registration(){
    window.location = 'http://' + window.location.host + '/registration';
}

function redirect_to_index(){
    window.location = 'http://' + window.location.host + '/index';
}


