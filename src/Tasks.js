import React, { useState, useEffect } from "react";
import { useStateValue } from "./StateProvider";
import { auth, db, deleteDoc } from "./firebase-setup/firebase";
import { Link } from "react-router-dom";

// import icons
import { FaTrashAlt, FaEdit, FaPlus, FaSearch } from "react-icons/fa";

export default function Tasks() {
  //for user auth purposes
  const [{ user }, dispatch] = useStateValue();
  const [name, setName] = useState("No User");
  const [tasks, setTasks] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [toggleAddTask, setToggleAddTask] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // init filtered task for search functionality
  useEffect(() => {
    const results = tasks.filter((task) =>
      task.data.name.toLowerCase().includes(searchPhrase.toLowerCase())
    );
    setFilteredTasks(results);
  }, [searchPhrase, tasks]);
  // user log out
  const signOut = () => {
    if (user) {
      auth.signOut();
    }
  };

  // //this should retrieve names and tasks
  useEffect(() => {
    if (user) {
      db.collection("user_names")
        .doc(user.uid)
        .onSnapshot((doc) => setName(doc.data().name));
      db.collection("users")
        .doc(user.uid)
        .collection("tasks")
        .onSnapshot((snapshot) =>
          setTasks(
            snapshot.docs.map((doc) => ({
              name: doc.id,
              data: doc.data(),
            }))
          )
        );
    }
  }, [user]);

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
        <TasksItems
          user={user}
          filteredTasks={filteredTasks}
          setEditTask={setEditTask}
        />
      </TasksLayout>
      {/* logic allows add task form to be opened and closed */}
      {toggleAddTask && (
        <AddTaskForm
          user={user}
          tasks={tasks}
          setTasks={setTasks}
          setToggleAddTask={setToggleAddTask}
        />
      )}
      {editTask && (
        <EditTaskForm
          user={user}
          editTask={editTask}
          setEditTask={setEditTask}
        />
      )}
    </div>
  );
}

// ****** COMPONENTS ***** //

// tasks page header
function Header({ name, signOut }) {
  return (
    <div className="header">
      <h1 className="header__title">{name}'s Task Tracker</h1>
      <Link to="/">
        <button className="header__logout-btn" onClick={signOut}>
          Log Out
        </button>
      </Link>
    </div>
  );
}

// tasks section layout
function TasksLayout({ children }) {
  return <div className="tasks">{children}</div>;
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
        const aLower = a.data.name.toLowerCase();
        const bLower = b.data.name.toLowerCase();
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
        const aLower = a.data.status.toLowerCase();
        const bLower = b.data.status.toLowerCase();
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
  // sorts tasks by due date into filteredTasks
  const sortDue = () => {
    setFilteredTasks((tasks) => {
      let newTasks = [...tasks];
      newTasks.sort((a, b) => {
        const aLower = a.data.due.toLowerCase();
        const bLower = b.data.due.toLowerCase();
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
        <input
          className="tasks__search"
          type="text"
          id="search"
          name="search"
          key="search"
          onChange={(e) => setSearchPhrase(e.target.value)}
          value={searchPhrase}
        ></input>
        <label className="" htmlFor="search">
          <FaSearch />
        </label>
      </div>
      <div className="tasks__sort-group">
        <button
          className="tasks__sort-btn"
          type="button"
          onClick={() => sortName()}
        >
          Name
        </button>
        <button
          className="tasks__sort-btn"
          type="button"
          onClick={() => sortStatus()}
        >
          Status
        </button>
        <button
          className="tasks__sort-btn"
          type="button"
          onClick={() => sortDue()}
        >
          Due
        </button>
      </div>
      <div className="tasks__new-btn-wrapper">
        <button
          className="icon-btn tasks__new-btn"
          type="button"
          onClick={() => setToggleAddTask(true)}
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
}

// task items content
function TasksItems({ user, filteredTasks, setEditTask }) {
  // handle edit task
  const handleEdit = (taskName) => {
    console.log({ taskName });
    setEditTask(taskName);
  };
  // delete task from db
  const remove = (task) => {
    console.log(user.uid);
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task.name)
      .delete();

    alert("Task was deleted!");
  };
  // handle delete task from db
  const handleDelete = (task) => {
    remove(task);
  };
  // reformats date from data
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  return (
    <ul className="tasks__list">
      {filteredTasks.map((task) => (
        <li className="tasks__list-item" key={task.name}>
          <div className="tasks__item-main">
            <span className="tasks__task-name">{task.data.name}</span>
            <p className="tasks__task-description">{task.data.text}</p>
          </div>
          <span>{task.data.status}</span>
          <span>{formatDate(task.data.due)}</span>
          <div className="tasks__item-btn-group">
            <button
              className="icon-btn"
              type="button"
              key={task.name}
              onClick={() => handleEdit(task)}
            >
              <FaEdit />
            </button>
            <button
              className="icon-btn"
              type="button"
              onClick={() => handleDelete(task)}
            >
              <FaTrashAlt />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

// pop out form to add new task
function AddTaskForm({ user, tasks, setTasks, setToggleAddTask }) {
  console.log(`User.uid ${user.uid}`);
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

function EditTaskForm({ user, editTask, setEditTask }) {
  const [updatedTask, setUpdatedTask] = useState(editTask);
  // handle update of form input
  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setUpdatedTask({
      ...updatedTask,
      data: { ...updatedTask.data, [name]: value },
    });
  };
  // reformats date from form
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  // update task data on db
  const edit = (task) => {
    db.collection("users")
      .doc(user?.uid)
      .collection("tasks")
      .doc(task.name)
      .update({
        name: task.data.name,
        due: formatDate(task.data.due),
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
          <button className="form__add-btn" type="submit" form="add-task">
            Edit
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
