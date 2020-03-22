const sha256 = require("js-sha256");

const cryptDeprecated = (metadata, salt) => {
  const value = sha256(metadata.email + metadata.service + salt);
  let gen = value.substring(7, 12);
  gen += "$A";
  gen += value.substring(20, 25);
  gen += "#Z";
  gen += value.substring(30, 36);
  return gen;
};

const crypt = (metadata, salt) => {
  const data = `${metadata.service}|${metadata.email}|${metadata.version}`;
  let gen = sha256(data + salt);
  // transform letters to uppercase
  if (!metadata.config.lower_case) gen = transformUpperCase(gen);
  // remove numbers if configured
  if (!metadata.config.alphanumeric) gen = gen.replace(/[0-9]/g, "");
  // add special characters
  if (metadata.config.special_chars)
    gen =
      "$" +
      gen.substr(0, 5) +
      "!" +
      gen.substr(5, 5) +
      "&" +
      gen.substr(10, 5) +
      "?" +
      gen.substr(15, 5) +
      "%";
  return gen.substr(0, metadata.config.length);
};

const transformUpperCase = str => {
  for (let i = 1; (i += 3); i <= 25) {
    str = replaceAt(str, i, str.charAt(i).toUpperCase());
  }
  return str;
};

const replaceAt = (str, index, replacement) => {
  return (
    str.substr(0, index) + replacement + str.substr(index + replacement.length)
  );
};

module.exports = {
  cryptDeprecated,
  crypt
};
