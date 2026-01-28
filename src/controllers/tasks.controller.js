const model = require("../models/task.model");

const findAll = async (req, res) => {
  try {
    const [tasks] = await model.findAll();
    if (tasks.length === 0) {
      return res.error(404, "Tasks not found");
    }
    res.success(tasks);
  } catch (error) {
    res.error(500, "Internal server error");
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const [task] = await model.findOne(id);
    if (!task.length) {
      return res.error(404, "Task not found");
    }
    res.success(task);
  } catch (error) {
    res.error(500, "Internal server error");
  }
};

const create = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.error(400, "Title is required");
    }
    const [result] = await model.create(title);
    return res.success(
      {
        id: result.insertId,
        title: title.trim(),
        completed: false,
      },
      201,
    );
  } catch (error) {
    console.error("Create task error:", error);
    res.error(500, "Internal server error");
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const [task] = await model.findOne(id);

    if (!task.length) {
      return res.error(404, "Task not found");
    }

    const { title, completed } = req.body;

    if (!title || !title.trim()) {
      return res.error(400, "Title is required");
    }

    await model.update(id, { title, completed });

    return res.success({
      ...task[task.length - 1],
      title,
      completed,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    res.error(500, "Internal server error");
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const [task] = await model.findOne(id);

    if (!task.length) {
      return res.error(404, "Task not found");
    }

    await model.destroy(id);
    return res.success(task);
  } catch (error) {
    res.error(500, "Internal server error");
  }
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  destroy,
};
