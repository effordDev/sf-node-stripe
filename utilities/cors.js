const cors = require("cors");

const whitelisting = (app) => {
	const whitelist = Object.keys(process.env).reduce((acc, curr) => {
		return curr.toLowerCase().includes("allowed")
			? [...acc, process.env[curr]]
			: acc;
	}, []);

	console.log(whitelist);

	const corsOptions = {
		origin: function (origin, callback) {
			console.log("origin  given");
			console.log(origin);

			if (whitelist.indexOf(origin) !== -1 || !origin) {
				callback(null, true);
			} else {
				callback("Not allowed by CORS");
			}
		},
	};

	app.use(cors(corsOptions));

	return app;
};

module.exports = {
	whitelisting,
};
