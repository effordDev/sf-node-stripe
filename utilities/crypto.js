const { createHash, createDecipheriv } = require("node:crypto");

const decrypt = (encrypted, key, iv) => {
	const decipher = createDecipheriv("aes-128-cbc", key, iv);
	const decrypted = decipher.update(encrypted, "base64", "utf8");
	return decrypted + decipher.final("utf8");
};

const toHash = (text) => {
	const hash = createHash("sha256");
	hash.update(text);
	return hash.digest("hex");
};

module.exports = {
	decrypt,
	toHash,
};
