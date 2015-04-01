var net = require('net');
var fs = require('fs');
var server = net.createServer();
var readJson = fs.readFileSync('./info/user.json', 'utf8');
var parseJson = JSON.parse(readJson);

server.on('connection', function(client) {
	client.setEncoding('utf8');
	client.write("WELCOME TO HIPSTER CODE MEETUP" + '\n');
	client.write("LIST ---> To list current Meetup please type LIST" + '\n')
	client.write("RSVP ---> To reserve current Meetup please type RSVP," + '\n' + "followed by your name followed by your email address" + '\n');
	client.write("COUNT ---> To see how many hipsters attending Meetup," + '\n' + "type COUNT" + '\n');

	client.on('data', function(clientInput) {
		var trimInput = clientInput.trim();
		var input = trimInput.split(" ");
		var firstName = input[1];
		var email = input[2];
		var admin = "Admin";
		var password = '1111';
		var date = input[1];
		var topic = input[2];
			
		if (input[0] === "MEETUP" && date && topic) {

			parseJson.forEach(function(e) {
				if(e.meetupDate && e.meetupTopic) {
					e.meetupDate = date;
					e.meetupTopic = topic;
				}

			});
			var stringJson = JSON.stringify(parseJson);
			var writeJson = fs.writeFileSync('./info/user.json', stringJson);

			client.write("Thank you Admin for updating new meetup event" + '\n');
			client.end();

		} else if (input[0] === admin && input[1] === "DELETE" && input[2] === password) {
			parseJson.forEach(function(e) {
				if(e.meetupDate && e.meetupTopic) {
					e.meetupDate = "";
					e.meetupTopic = "";
				}

			});
			var stringJson = JSON.stringify(parseJson);
			var writeJson = fs.writeFileSync('./info/user.json', stringJson);

			client.write("Your meetup event has been deleted" + '\n');
			client.end();

		} else if (input[0] === admin && input[1] === password) {
			client.write(" *** Welcome Admin" + '\n');
			client.write(" *** To list all names of registered hipsters please type Admin followed by LIST" + '\n');
			client.write(" *** To add new meetup please type MEETUP followed by date --> Month/Day/Year" + '\n' + "followed by topic --> name" + '\n');

		} else if (input[0] === admin && input[1] === "LIST") {
			parseJson.forEach(function(e) {
				client.write(e.name + '\n');
			});
			client.end();

		} else if (input[0] === admin && input[1] !== password) {
			client.write("Password does not match" + '\n');
			client.end();

		} else if (input[0] === "RSVP" && firstName && email) {

		var userInfo = {
			name: firstName,
			email: email
		}

		parseJson.push(userInfo);

		client.write("Thank you " + userInfo.name + " for registering" + '\n')
		client.end();

		} else if (input[0] === "LIST") {
			parseJson.forEach(function(e) {
				client.write(e.meetupDate + '\n');
				client.write(e.meetupTopic + '\n');
				client.end();
			});
			
		} else if (input[0] === "RSVP" && !firstName && !email) {
			client.write("Plesae provide your first name and email address" + '\n');
			client.end();

		} else if (input[0] === "COUNT") {
			var count = 0;
			parseJson.forEach(function(e) {
				if(e.name) {
					count++;
				}
			});
			client.write("Confirmed: " + count.toString() + " hipsters" + '\n');
			client.end();
		}

		var stringJson = JSON.stringify(parseJson);
		var writeJson = fs.writeFileSync('./info/user.json', stringJson);
		
	});
});

server.listen(8142, function() {
	console.log('connected');
})