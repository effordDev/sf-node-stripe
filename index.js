if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const { sfConn, sfUpdateSobject } = require("./utilities/sf");

const { validate } = require("./utilities/auth");

const app = require("./utilities/cors").whitelisting(express());

const port = process.env.PORT || 3000;

app.post("/payment", express.json(), validate, async (req, res) => {
	try {
		console.log("payment hit");

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",

			line_items: [
				{
					price_data: {
						currency: "usd",
						product_data: {
							name: "Companies To Watch Application",
						},
						unit_amount: 9900,
					},
					quantity: 1,
				},
			],
			metadata: {
				recordId: req?.recordId,
			},

			success_url: `${process.env.ReturnUrl}/${req?.recordId}`,
			cancel_url: `${process.env.ReturnUrl}/${req?.recordId}`,
		});

		// console.log(session.url)
		res.json({ url: session.url });
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: e });
	}
});

app.post(
	"/webhook",
	express.json({ type: "application/json" }),
	async (req, res) => {
		try {
			const event = req.body;

			console.log("event", event);
			console.log("event.type ", event.type);
			console.log("event.data.object.metadata ", event.data.object.metadata);

			// Handle the event
			if (event.type === "checkout.session.completed") {
				console.log("checkoutSessionCompleted");

				const { sfLoginUrl, sfUsername, sfPassword, sfToken } = process.env;

				const connectionResult = await sfConn(
					sfLoginUrl,
					sfUsername,
					sfPassword,
					sfToken
				);

				const record = {
					Id: event.data.object.metadata.recordId,
					Status__c: "In Progress",
				};

				const recordResult = await sfUpdateSobject(
					connectionResult.conn,
					"Application__c",
					record
				);

				console.log(recordResult);
			}

			res.send();
		} catch (error) {
			console.log(error);
			res.status(500).json({ error });
		}
	}
);

app.listen(port, () => {
	console.log(`server is running on port 📡 ${port}`);
});
