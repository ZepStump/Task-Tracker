import React from "react";
// import icons
import { FaTrashAlt, FaEdit } from "react-icons/fa";

export default function List({
  user,
  db,
  filteredTasks,
  setEditTask,
  setFilteredTasks,
}) {
  // handle edit task
  const handleEdit = (taskName) => {
    console.log({ taskName });
    setEditTask(taskName);
  };
  // delete task from db
  const remove = (task) => {
    console.log(task);
    db.collection("users")
      .doc(user?.uid)
      .collection("tasks")
      .doc(task.name)
      .delete();

    alert("Task was deleted!");
  };
  // handle delete task from db
  const handleDelete = (task) => {
    remove(task);
    const updatedTasks = filteredTasks.filter((t) => t.name !== task.name);
    setFilteredTasks(updatedTasks);
    // console.log(filteredTasks);
  };
  // reformats date from data
  const formatDate = (date) => {
    console.log(date);
    const dateParsed = date.split("-");
    return `${dateParsed[1]}/${dateParsed[2]}/${dateParsed[0]}`;
  };

  // Changes color based on status
  const determineBackgroundColor = (status) => {
    if (status === "in-progress") {
      return "#fffc99";
    }
    if (status === "to-do") {
      return "#9ac6ef";
    }
    return "#aae39e";
  };

  return (
    <ul className="tasks__list">
      {filteredTasks.map((task) => (
        <li
          className="tasks__list-item"
          key={task.name}
          style={{
            backgroundColor: determineBackgroundColor(task.data.status),
          }}
        >
          <div className="tasks__item-main">
            <span className="tasks__item-name">{task.data.name}</span>
            <p className="tasks__task-description">{task.data.text}</p>
          </div>
          <span className="tasks__item-info">{task.data.status}</span>
          <span className="tasks__item-info">{formatDate(task.data.due)}</span>
          <div className="tasks__item-btn-group">
            <button
              className="icon-btn"
              type="button"
              key={task.name}
              onClick={() => handleEdit(task)}
            >
              <FaEdit size={25} />
            </button>
            <button
              className="icon-btn"
              type="button"
              onClick={() => handleDelete(task)}
            >
              <FaTrashAlt size={25} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
