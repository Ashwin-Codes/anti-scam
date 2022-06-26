(async () => {
	const url = document.location.href;
	const hostName = url.split("//")[1].split("/")[0];

	function whitelist(hostname) {
		localStorage.setItem(hostname, "whitelist");
		console.log("test");
	}

	function warn(hostname) {
		if (localStorage[hostName] === "whitelist") {
			return;
		} else {
			const modal = `<div class="modal-backdrop-antiscam">
							<div class="modal-antiscam">
							<div class="modal-header-antiscam">
							<h1>WARNING !</h1>
							</div>
							<div class="modal-content-antiscam">
							<h1>${hostName} is a malicious / fraudulent / scam website.</h1>
							</div>
							<button class="go-back-btn-antiscam">Whitelist</button>
							</div>
							</div>`;
			document
				.querySelectorAll('style,link[rel="stylesheet"]')
				.forEach((item) => item.remove());
			document.body.innerHTML = modal;
			document.querySelector(".go-back-btn-antiscam").addEventListener("click", (e) => {
				whitelist(hostname);
				location.reload();
			});
		}
	}

	const res = await fetch("https://anti-scam-api.herokuapp.com/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			hostName,
		}),
	});
	const data = await res.json();
	console.log(data);
	if (data.isMalicious === true) {
		warn(data.hostName);
	}
})();
