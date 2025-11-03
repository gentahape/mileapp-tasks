import Task from "../models/taskModel.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task =  new Task({
      title,
      description,
      status,
      userId: req.user.id
    });

    const createTask = await task.save();
    res.status(201).json(createTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status
    } = req.query;
    
    const query = { userId: req.user.id };
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const totalItems = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalItems / Number(limit));

    res.status(200).json({
      data: tasks,
      meta: {
        totalItems,
        totalPages,
        currentPage: Number(page),
        itemsPerPage: Number(limit),
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};