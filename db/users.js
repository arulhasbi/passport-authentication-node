const bcrypt = require("bcrypt");
const records = [];

const addNewUser = (username, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return reject(err);
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) return reject(err);
        let newUser = {
          username: username,
          password: hash,
        };
        newUser = {
          id: records.length === 0 ? 1 : records.length + 1,
          ...newUser,
        };
        records.push(newUser);
        resolve(records);
      });
    });
  });
};

const findByUsername = (username, callback) => {
  process.nextTick(() => {
    const usernames = records.map((data) => data.username);
    const indexpos = usernames.indexOf(username);
    if (indexpos !== -1) {
      callback(null, records[indexpos]);
    } else {
      callback(new Error(`no record found with username: ${username}`));
    }
  });
};

const findById = (id, callback) => {
  process.nextTick(() => {
    const ids = records.map((data) => data.id);
    const indexpos = ids.indexOf(id);
    if (indexpos !== -1) {
      callback(null, records[indexpos]);
    } else {
      callback(new Error(`no record found with id: ${id}`));
    }
  });
};

module.exports = {
  addNewUser,
  findByUsername,
  findById,
};
