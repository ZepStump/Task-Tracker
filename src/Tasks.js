import React from "react";

const mockData = [
  {
    name: "Iterate through tasks data and create list of tisk items",
    due: "04/19/23",
    status: "in progress",
  },
  {
    name: "create handle filter function",
    due: "04/20/23",
    status: "to-do",
  },
  {
    name: "allow users to delete task items",
    due: "04/19/13",
    status: "to-do",
  },
  {
    name: "allow users to edit task items",
    due: "04/19/23",
    status: "to-do",
  },
];

function Tasks() {
  const Header = () => {
    return (
      <div className="header">
        <h1 className="header__title">Task Tracker</h1>
        <h2 className="header__user">User</h2>
        <button className="header__log-out">Log Out</button>
      </div>
    );
  };
  const TaskItems = (props) => {
    return (
      <div className="tasks">
        <h2 className="tasks__title">Tasks</h2>
        <ul className="tasks__list">
          {props.taskData.map((task) => (
            <li className="tasks__list-item" key="task.name">
              <span className="tasks__task-name">{task.name}</span>
              <span>{task.status}</span>
              <span>{task.due}</span>
              <button>Edit</button>
              <button>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="main">
      <Header />
      <TaskItems taskData={mockData} />
    </div>
  );
}

export default Tasks;
