import React, { useState, useEffect } from "react";
import { auth } from "./firebase-setup/firebase";

// mock data for dev
const mockTasks = [
  {
    name: "Iterate through tasks data and create list of tisk items",
    due: "04/19/23",
    status: "in progress",
    description: "this area will contain a description of the task",
  },
  {
    name: "create handle filter function",
    due: "04/20/23",
    status: "to-do",
    description: "this area will contain a description of the task",
  },
  {
    name: "allow users to delete task items",
    due: "04/19/13",
    status: "to-do",
    description: "this area will contain a description of the task",
  },
  {
    name: "allow users to edit task items",
    due: "04/19/23",
    status: "to-do",
    description: "this area will contain a description of the task",
  },
];

export default function Tasks() {
  const [name, setName] = useState("No User");
  const [tasks, setTasks] = useState(mockTasks);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [toggleAddTask, setToggleAddTask] = useState(false);
  // init filtered task for search functionality
  useEffect(() => {
    const results = tasks.filter((task) =>
      task.name.toLowerCase().includes(searchPhrase.toLowerCase())
    );
    setFilteredTasks(results);
  }, [searchPhrase, tasks]);
  // user placeholder
  const user = "Test User";
  // init user
  useEffect(() => {
    setName(user);
  }, []);
  // user log out
  const signOut = () => {
    if (user) {
      auth.signOut();
    }
  };

  return (
    <div className="main">
      <Header name={name} signOut={signOut} />
      <TasksLayout>
        <TasksHeader
          setFilteredTasks={setFilteredTasks}
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          setToggleAddTask={setToggleAddTask}
        />
        <TasksItems filteredTasks={filteredTasks} />
      </TasksLayout>
      {/* logic allows add task form to be opened and closed */}
      {toggleAddTask && (
        <AddTaskForm
          tasks={tasks}
          setTasks={setTasks}
          setToggleAddTask={setToggleAddTask}
        />
      )}
    </div>
  );
}
// tasks page header
function Header({ name, signOut }) {
  return (
    <div className="header">
      <h1 className="header__title">Task Tracker</h1>
      <h2 className="header__user">{name}</h2>
      <button className="header__log-out" type="button" onClick={signOut}>
        Log Out
      </button>
    </div>
  );
}
// tasks section layout
function TasksLayout({ children }) {
  return (
    <div className="tasks">
      <h2 className="tasks__title">Tasks</h2>

      {children}
    </div>
  );
}
// tasks section header with search, sort, and add task ui
function TasksHeader({
  setFilteredTasks,
  searchPhrase,
  setSearchPhrase,
  setToggleAddTask,
}) {
  // sorts tasks by name into filteredTasks
  const sortName = () => {
    setFilteredTasks((tasks) => {
      let newTasks = [...tasks];
      newTasks.sort((a, b) => {
        const aLower = a.name.toLowerCase();
        const bLower = b.name.toLowerCase();
        if (aLower < bLower) {
          return -1;
        } else if (aLower > bLower) {
          return 1;
        } else {
          return 0;
        }
      });
      return newTasks;
    });
  };
  // sorts tasks by status into filteredTasks
  const sortStatus = () => {
    setFilteredTasks((tasks) => {
      let newTasks = [...tasks];
      newTasks.sort((a, b) => {
        const aLower = a.status.toLowerCase();
        const bLower = b.status.toLowerCase();
        if (aLower < bLower) {
          return -1;
        } else if (aLower > bLower) {
          return 1;
        } else {
          return 0;
        }
      });
      return newTasks;
    });
  };
  // sorts tasks by due dat into filteredTasks
  const sortDue = () => {
    setFilteredTasks((tasks) => {
      let newTasks = [...tasks];
      newTasks.sort((a, b) => {
        const aLower = a.due.toLowerCase();
        const bLower = b.due.toLowerCase();
        if (aLower < bLower) {
          return -1;
        } else if (aLower > bLower) {
          return 1;
        } else {
          return 0;
        }
      });
      return newTasks;
    });
  };

  return (
    <div className="tasks__list-header">
      <div className="tasks__search-group">
        <label className="offscreen" htmlFor="search">
          Search Tasks
        </label>
        <input
          type="text"
          id="search"
          name="search"
          key="search"
          onChange={(e) => setSearchPhrase(e.target.value)}
          value={searchPhrase}
        ></input>
      </div>
      <div className="tasks__sort-group">
        <button className="" type="button" onClick={() => sortName()}>
          Name
        </button>
        <button className="" type="button" onClick={() => sortStatus()}>
          Status
        </button>
        <button className="" type="button" onClick={() => sortDue()}>
          Due
        </button>
      </div>

      <button
        className="tasks__new-btn"
        type="button"
        onClick={() => setToggleAddTask(true)}
      >
        Add new task
      </button>
    </div>
  );
}
// task items content
function TasksItems({ filteredTasks }) {
  return (
    <ul className="tasks__list">
      {filteredTasks.map((task) => (
        <li className="tasks__list-item" key={task.name}>
          <div className="tasks__item-main">
            <span className="tasks__task-name">{task.name}</span>
            <span>{task.status}</span>
            <span>{task.due}</span>
            <button>Edit</button>
            <button>Delete</button>
          </div>
          <span className="tasks__task-description">{task.description}</span>
        </li>
      ))}
    </ul>
  );
}
// pop out form to add new task
// see no added value by using controlled inputs
function AddTaskForm({ tasks, setTasks, setToggleAddTask }) {
  // reformats date from form
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  // appends new task to tasks
  const handleSubmitTask = (e) => {
    e.preventDefault();
    setTasks([
      ...tasks,
      {
        name: e.currentTarget.name.value,
        due: formatDate(e.currentTarget.due.value),
        status: e.currentTarget.status.value,
        description: e.currentTarget.description.value,
      },
    ]);
    // closes new task form
    setToggleAddTask(false);
  };

  return (
    <div className="form__container">
      <button type="button" onClick={() => setToggleAddTask(false)}>
        Close
      </button>
      <form
        className="form"
        id="add-task"
        onSubmit={(e) => handleSubmitTask(e)}
      >
        <h2 className="form__title">New Task</h2>
        <label htmlFor="name">Task</label>
        <input type="text" id="name" name="name" required></input>
        <label htmlFor="due">Due Date</label>
        <input type="date" id="for" name="due" required></input>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description"></textarea>
        <div className="form__radio-group">
          <div>
            <input type="radio" id="to-do" name="status" value="to-do"></input>
            <label htmlFor="to-do">To-do</label>
          </div>
          <div>
            <input
              type="radio"
              id="in-progress"
              name="status"
              value="in-progress"
            ></input>
            <label htmlFor="in-progress">In Progress</label>
          </div>
          <div>
            <input
              type="radio"
              id="complete"
              name="status"
              value="complete"
            ></input>
            <label htmlFor="complete">Complete</label>
          </div>
        </div>

        <button className="tasks__new-btn" type="submit" form="add-task">
          Add Task
        </button>
      </form>
    </div>
  );
}
