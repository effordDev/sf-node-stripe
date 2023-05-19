const { decrypt, toHash } = require("./crypto");

const validate = (req, res, next) => {
	const time = new Date().getTime();

	if (!req.headers.fromapex) {
		return res.status(401).send("Invalid Headers");
	}

	if (req.headers.fromapex.length !== 18) {
		return res.status(401).send("Invalid Headers");
	}

	const { sfOrgId, SECRET_HASH, ENC_KEY, IV } = process.env;

	const decryptedBody = JSON.parse(decrypt(req.body.content, ENC_KEY, IV));

	const { todaysDate, orgId, key, recordId } = decryptedBody;

	const abs = Math.abs(todaysDate - time);

	if (abs > 20000) {
		return res.status(401).send("Invalid Date");
	}
	if (orgId !== sfOrgId) {
		return res.status(401).send("Invalid Org");
	}
	if (toHash(key) !== SECRET_HASH) {
		return res.status(401).send("Invalid Hash");
	}

	req.recordId = recordId;
	next();
};

module.exports = {
	validate,
};
