import React, { useState } from "react";

export default function EditTaskForm({ user, db, editTask, setEditTask }) {
  const [updatedTask, setUpdatedTask] = useState(editTask);
  // handle update of form input
  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setUpdatedTask({
      ...updatedTask,
      data: { ...updatedTask.data, [name]: value },
    });
  };
  // update task data on db
  const edit = (task) => {
    db.collection("users")
      .doc(user?.uid)
      .collection("tasks")
      .doc(task.name)
      .update({
        name: task.data.name,
        due: task.data.due,
        text: task.data.text,
        status: task.data.status,
      });

    alert("Task was updated!");
  };
  // handle update task
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    edit(updatedTask);
    // closes edit task form
    setEditTask(null);
  };

  return (
    <div className="form__container">
      <form
        className="form"
        id="edit-task"
        onSubmit={(e) => handleSubmitEdit(e)}
      >
        <h2 className="form__title">Edit Task</h2>
        <label htmlFor="name">Task</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) => handleChange(e)}
          value={updatedTask.data.name}
          required
        ></input>
        <label htmlFor="due">Due Date</label>
        <input
          type="date"
          id="for"
          name="due"
          onChange={(e) => handleChange(e)}
          value={updatedTask.data.due}
          required
        ></input>
        <label htmlFor="text">Description</label>
        <textarea
          id="text"
          name="text"
          onChange={(e) => handleChange(e)}
          value={updatedTask.data.text}
        ></textarea>
        <div className="form__radio-group">
          <div>
            <input
              type="radio"
              id="to-do"
              name="status"
              value="to-do"
              checked={updatedTask.data.status === "to-do"}
              onChange={(e) => handleChange(e)}
            ></input>
            <label htmlFor="to-do">To-do</label>
          </div>
          <div>
            <input
              type="radio"
              id="in-progress"
              name="status"
              value="in-progress"
              checked={updatedTask.data.status === "in-progress"}
              onChange={(e) => handleChange(e)}
            ></input>
            <label htmlFor="in-progress">In Progress</label>
          </div>
          <div>
            <input
              type="radio"
              id="complete"
              name="status"
              value="complete"
              checked={updatedTask.data.status === "complete"}
              onChange={(e) => handleChange(e)}
            ></input>
            <label htmlFor="complete">Complete</label>
          </div>
        </div>
        <div className="form__btn-group">
          <button className="form__add-btn" type="submit" form="edit-task">
            Save
          </button>
          <button
            className="form__close-btn"
            type="button"
            onClick={() => setEditTask(null)}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
