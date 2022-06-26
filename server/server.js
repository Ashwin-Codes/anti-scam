const express = require("express");
const cors = require("cors");
const fs = require("fs");

const dataList = require("./dataset");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: "*",
	})
);

app.use(express.json());

app.get("/", (req, res) => {
	res.send("running..");
});

app.post("/", (req, res) => {
	const body = req.body;
	const maliciousHost = dataList.includes(body.hostName);
	res.send(JSON.stringify({ hostName: body.hostName, isMalicious: maliciousHost }));
});

app.post("/blacklist", (req, res) => {
	const hostName = req.body.hostName;
	const data = JSON.parse(fs.readFileSync("./userBlacklist.txt", { encoding: "utf-8" }));

	if (hostName in data) {
		data[hostName] = data[hostName] + 1;
	} else {
		data[hostName] = 1;
		console.log(data);
	}

	fs.writeFileSync("./userBlacklist.txt", JSON.stringify(data));
});

app.post("/whitelist", (req, res) => {
	const hostName = req.body.hostName;
	const data = JSON.parse(fs.readFileSync("./userBlacklist.txt", { encoding: "utf-8" }));

	if (hostName in data) {
		data[hostName] = data[hostName] - 1;
	}

	if (data[hostName] < 0) {
		data[hostName] = 0;
	}

	fs.writeFileSync("./userBlacklist.txt", JSON.stringify(data));
});

app.post("/info", (req, res) => {
	const hostName = req.body.hostName;
	const data = JSON.parse(fs.readFileSync("./userBlacklist.txt", { encoding: "utf-8" }));

	if (hostName in data) {
		res.send(
			JSON.stringify({
				hostName: hostName,
				reports: data[hostName],
			})
		);
	} else {
		res.send(
			JSON.stringify({
				hostName: hostName,
				reports: 0,
			})
		);
	}
});

app.listen(PORT, () => {
	console.log("App running on port 3000");
});
