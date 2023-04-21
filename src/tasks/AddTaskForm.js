import React, { useState } from "react";

export default function AddTaskForm({ user, db, setToggleAddTask }) {
  // init new task state
  const [newTask, setNewTask] = useState({
    name: "",
    due: "",
    description: "",
    status: "to-do",
  });
  // handle update of form input
  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  // append new task to db
  const add = (task) => {
    console.log(`Add user: ${user}`);
    db.collection("users")
      .doc(user?.uid)
      .collection("tasks")
      .doc(task.name)
      .set({
        name: task.name,
        due: task.due,
        text: task.description,
        status: task.status,
      });

    alert("Task was created!");
  };
  // appends new task to tasks
  const handleSubmitTask = (e) => {
    e.preventDefault();
    add(newTask);
    // closes new task form
    setToggleAddTask(false);
  };

  return (
    <div className="form__container">
      <form
        className="form"
        id="add-task"
        onSubmit={(e) => handleSubmitTask(e)}
      >
        <h2 className="form__title">New Task</h2>

        <label htmlFor="name">Task</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) => handleChange(e)}
          value={newTask.name}
          required
        ></input>
        <label htmlFor="due">Due Date</label>
        <input
          type="date"
          id="for"
          name="due"
          onChange={(e) => handleChange(e)}
          value={newTask.due}
          required
        ></input>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          onChange={(e) => handleChange(e)}
          value={newTask.description}
        ></textarea>
        <div className="form__radio-group">
          <div>
            <input
              type="radio"
              id="to-do"
              name="status"
              value="to-do"
              checked={newTask.status === "to-do"}
              onChange={(e) => handleChange(e)}
            ></input>
            <label className="form__radio-label" htmlFor="to-do">
              To-do
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="in-progress"
              name="status"
              value="in-progress"
              checked={newTask.status === "in-progress"}
              onChange={(e) => handleChange(e)}
            ></input>
            <label className="form__radio-label" htmlFor="in-progress">
              In Progress
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="complete"
              name="status"
              value="complete"
              checked={newTask.status === "complete"}
              onChange={(e) => handleChange(e)}
            ></input>
            <label className="form__radio-label" htmlFor="complete">
              Complete
            </label>
          </div>
        </div>
        <div className="form__btn-group">
          <button className="form__add-btn" type="submit" form="add-task">
            Add
          </button>
          <button
            className="form__close-btn"
            type="button"
            onClick={() => setToggleAddTask(false)}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
