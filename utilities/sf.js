const jsforce = require("jsforce");

const sfConn = (loginUrl, sfUsername, sfPassword, sfToken) => {
	const conn = new jsforce.Connection({ loginUrl });

	return new Promise((resolve, reject) => {
		conn.login(sfUsername, sfPassword + sfToken, (err, res) => {
			if (err) {
				return reject(err);
			}
			resolve({ conn, res });
		});
	});
};

const sfCreateSobject = (conn, sobjectApi, record) => {
	return new Promise((resolve, reject) => {
		conn.sobject(sobjectApi).create(record, (err, res) => {
			if (err) {
				return reject(err);
			}
			resolve({ res });
		});
	});
};

const sfUpdateSobject = (conn, sobjectApi, record) => {
	return new Promise((resolve, reject) => {
		conn.sobject(sobjectApi).update(record, (err, res) => {
			if (err) {
				return reject(err);
			}
			resolve({ res });
		});
	});
};

module.exports = {
	sfConn,
	sfCreateSobject,
	sfUpdateSobject,
};
