import React, { useState, useEffect } from "react";
import { useStateValue } from './StateProvider';
import { auth, db } from './firebase-setup/firebase';

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

  //for user auth purposes
  const [{ user }, dispatch] = useStateValue();

  const signOut = () => {
    if (user) {
        auth.signOut();
    }
  }

  const [name, setName] = useState("No User");
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");

  //this should retireve names and tasks
  useEffect(() => {
    db.collection("user_names").doc(user.uid)
        .onSnapshot(doc => setName(doc.data().name));
    db.collection("users").doc(user.uid).collection("tasks")
        .onSnapshot(snapshot => (
            setTasks(snapshot.docs.map(doc => ({
              name: doc.id,
              data: doc.data()
            })))
        ))
  }, [])

  const addToCurrent = () => {

    db
      .collection("users")
      .doc(user?.uid)
      .collection("tasks")
      .doc(taskName)
      .set({
        name: taskName
      });

      alert("Task was created!");
  }

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
