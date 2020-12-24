const express = require("express");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require("mongoose");
const shortId = require("shortid");
const shortUrl = require("./models");
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const app = express();


mongoose.connect(process.env.mongoDbUri, {
	useNewUrlParser: true, useUnifiedTopology: true,
	useFindAndModify: false, useCreateIndex: true,
});
mongoose.connection
	.once("open", () => console.log("MongoDB succesfully connected!"))
	.on("error", (error) => {
		console.log("Error in connecting MongoDB:", error);
	});

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));
app.use(morgan("tiny"));


app.post("/postUrl", async (req, res) => {
	if (!req.body || !req.body.fullUrl) {
		res.status(400).send({
			message: "fullUrl is required"
		});
		return;
	}
	let urlObject = await shortUrl.findOne({
		fullUrl: req.body.fullUrl
	});
	
	if (!urlObject) {
		const shortenedUrl = shortId.generate(req.body.fullUrl);
		try {
			urlObject = await shortUrl.create({
				fullUrl: req.body.fullUrl,
				shortUrl: shortenedUrl
			});
		} catch (err) {
			res.status(500).send({
				message: "Sorry, Please Try Again."
			});
			return;
		}
	}
	
	res.json({
		fullUrl: urlObject.fullUrl,
		shortUrl: urlObject.shortUrl
	});
});

app.get("/:shortUrlParam", async (req, res) => {
	let urlObject = await shortUrl.findOne({
		shortUrl: req.params.shortUrlParam
	});
	if (!urlObject) {
		res.status(400).send({
			message: "shortUrl Not Found"
		});
		return;
	}
	urlObject.visits++;
	urlObject.save();
	res.redirect(urlObject.fullUrl);
});

const server = app.listen(PORT, () => {
	console.log(`Server is listening at http://localhost:${PORT}`)
})