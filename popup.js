const blacklistBtn = document.querySelector(".popup-blacklist-btn");
let tabUrl = "";

function setBtnText() {
	console.log(tabUrl);
	console.log(localStorage[tabUrl]);
	if (localStorage[tabUrl] === "blacklisted") {
		blacklistBtn.innerText = "Whitelist";
	}
}

function hostNameInfo() {
	fetch("https://anti-scam-api.herokuapp.com/info", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			hostName: tabUrl,
		}),
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data);
			const hostNameDom = document.querySelector(".popup-container-hostname");
			const reportsDom = document.querySelector(".popup-container-reports");

			hostNameDom.innerText = `Website : ${data.hostName}`;
			reportsDom.innerText = `Reports : ${data.reports}`;
		});
}

function blacklist() {
	localStorage.setItem(tabUrl, "blacklisted");
	blacklistBtn.innerText = "Whitelist";
	console.log(tabUrl);
	fetch("https://anti-scam-api.herokuapp.com/blacklist", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			hostName: tabUrl,
		}),
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data);
		});

	const reportsDom = document.querySelector(".popup-container-reports");
	let num = parseInt(reportsDom.innerText.match(/\d+/g)[0]) + 1;
	console.log(num);
	reportsDom.innerText = `Reports : ${num}`;
}

function whitelist() {
	localStorage.setItem(tabUrl, "whitelisted");
	blacklistBtn.innerText = "Blacklist";

	fetch("https://anti-scam-api.herokuapp.com/whitelist", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			hostName: tabUrl,
		}),
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data);
		});

	const reportsDom = document.querySelector(".popup-container-reports");
	let num = parseInt(reportsDom.innerText.match(/\d+/g)[0]) - 1;
	if (num < 0) {
		num = 0;
	}
	console.log(num);
	reportsDom.innerText = `Reports : ${num}`;
}

function getTabUrl() {
	const query = { active: true, currentWindow: true };
	function callback(tabs) {
		const currentTab = tabs[0];
		const url = currentTab.url.split("//")[1].split("/")[0];
		tabUrl = url;
		hostNameInfo();
		setBtnText();
	}
	chrome.tabs.query(query, callback);
}

getTabUrl();

blacklistBtn.addEventListener("click", () => {
	if (localStorage[tabUrl] === "blacklisted") {
		whitelist();
	} else {
		blacklist();
	}
});
