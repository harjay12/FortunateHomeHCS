'use strict';
const bodyparser = require('body-parser');
const bodyparse = require('body-parser');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const express = require('express');
const OAuth2 = google.auth.OAuth2;
const path = require('path');
require('dotenv').config();
const app = express();

app.use(bodyparse.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static('build'));

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/api/forma', (req, res) => {
	let data = req.body;

	const oAuth2Client = new google.auth.OAuth2(
		process.env.CLIENT_ID,
		process.env.CLIENT_SECRET,
		process.env.REFRESH_TOKEN,
		'https://www.googleapis.com/auth/gmail.send'
	);
	oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

	const accessToken = oAuth2Client.getAccessToken();
	let smtpTransport = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.EMAIL,
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			refreshToken: process.env.REFRESH_TOKEN,
			accessToken: accessToken,
		},
	});
	let mailOptions = {
		from: data.email,
		to: 'kekuroso84@gmail.com',
		subject: data.subject,
		html: `<h3 style="color:blue">Sender Info</h3> <ul>
		       <li> Name: ${data.name} <li>
		       Email: ${data.email}</li></ul>
		       <h3>Message</h3>
		       <p> ${data.message}</p> </li> `,
	};

	smtpTransport.sendMail(mailOptions, (error) => {
		if (error) {
			res.send(error);
			console.log(res.send(error));
		} else {
			res.send('Succes');
		}
		smtpTransport.close();
	});
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}...`);
});
// [END app]

module.exports = app;

// /* jshint esversion: 6 */
// const express = require('express');
// const bodyparse = require('body-parser');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// const bodyparser = require('body-parser');
// require('dotenv').config();
// const path = require('path');
// const app = express();
// const { google } = require('googleapis');
// const OAuth2 = google.auth.OAuth2;

// app.use(express.static(path.join(__dirname, '../frontend/build')));
// app.use(bodyparse.urlencoded({ extended: true }));
// app.use(bodyparser.json());
// app.use(cors());

// app.get('/*', function (req, res) {
// 	res
// 		.status(200)
// 		.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

// app.post('/api/forma', (req, res) => {
// 	let data = req.body;
// 	const oAuth2Client = new google.auth.OAuth2(
// 		process.env.CLIENT_ID,
// 		process.env.CLIENT_SECRET,
// 		process.env.REFRESH_TOKEN,

// 	);
// 	oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// 	const accessToken = oAuth2Client.getAccessToken();

// 	let smtpTransport = nodemailer.createTransport({
// 		service: 'gmail',
// 		auth: {
// 			type: 'OAuth2',
// 			user: process.env.EMAIL,
// 			scope : "https://www.googleapis.com/auth/gmail.send",
// 			clientId: process.env.CLIENT_ID,
// 			clientSecret: process.env.CLIENT_SECRET,
// 			refreshToken: process.env.REFRESH_TOKEN,
// 			accessToken: accessToken,
// 		},
// 	});
// 	let mailOptions = {
// 		from: data.email,
// 		to: 'kekuroso84@gmail.com',
// 		subject: data.subject,
// 		html: `<h3>Informations</h3> <ul>
//        <li> Name: ${data.name} <li>
//        Email: ${data.email}</li></ul>
//        <h3>Message</h3>
//        <p> ${data.message}</p> </li> `,
// 	};

// 	smtpTransport.sendMail(mailOptions, (error) => {
// 		if (error) {
// 			res.send(error);
// 			console.log(res.send(error));
// 		} else {
// 			res.send('Succes');
// 		}
// 		smtpTransport.close();
// 	});
// });
// const hostname = 'http://localhost';
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, function () {
// 	console.log(`Server is running on port ${hostname}:${PORT}`);
// });
