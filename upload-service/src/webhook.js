// ! IN PRODUCTION USE THIS
// const {Webhooks, createNodeMiddleware} = require("@octokit/webhooks");

// const webhooks = new Webhooks({
// 	secret: "mysecret123",
// });

// webhooks.onAny(({id, name, payload}) => {
// 	console.log(name, "event received");
// 	console.log("payload:", payload);
// });

// require("http").createServer(createNodeMiddleware(webhooks)).listen(3000);
// can now receive webhook events at /api/github/webhooks

// ! FOR LOCAL TESTING USE THIS
const EventSource = require("eventsource");
const webhookProxyUrl = "https://smee.io/CvQ4wCbfn1eYE229"; // replace with your own Webhook Proxy URL
const source = new EventSource(webhookProxyUrl);
source.onmessage = (event) => {
	const webhookEvent = JSON.parse(event.data);
	const payload = JSON.parse(webhookEvent.body.payload);
	console.log("payload", payload);
	// save payload to json file
	const fs = require("fs");
	fs.writeFile("webhook.event.output.json", JSON.stringify(payload), (err) => {
		if (err) throw err;
		console.log("Data has been written to payload.json");
	});
};
