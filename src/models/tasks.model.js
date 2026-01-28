const db = require("../configs/database");

const findAll = () => {
  return db.query("SELECT * FROM tasks");
};

const findOne = (id) => {
  return db.query("SELECT * FROM tasks WHERE id = ?", [id]);
};

const create = (title) => {
  return db.query(
    `INSERT
     INTO tasks (title, completed, created_at, updated_at)
     VALUES (?,  b'0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [title],
  );
};

const update = (id, taskData) => {
  return db.query(
    `UPDATE tasks
SET
  title = ?,
  completed = ?,
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?;`,
    [taskData.title, taskData.completed, id],
  );
};

const destroy = (id) => {
  return db.query("DELETE FROM tasks WHERE id = ?", [id]);
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  destroy,
};
