const records = [
  {
    id: 1,
    username: "arulhasbi",
    password: "codec@demy10",
  },
];

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
  findByUsername,
  findById,
};
