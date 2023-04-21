import React, { useState, useEffect } from "react";
import { useStateValue } from "../StateProvider";
import { auth, db } from "../firebase-setup/firebase";
// import components
import Header from "./Header";
import ListHeader from "./ListHeader";
import List from "./List";
import AddTaskForm from "./AddTaskForm";
import EditTaskForm from "./EditTaskForm";

export default function Tasks() {
  //for user auth purposes
  const [{ user }, dispatch] = useStateValue();
  const [name, setName] = useState("No User");
  const [tasks, setTasks] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [toggleAddTask, setToggleAddTask] = useState(false);
  const [editTask, setEditTask] = useState(null);

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
  // user log out
  const signOut = () => {
    if (user) {
      auth.signOut();
    }
  };

  // init filtered task for search functionality
  useEffect(() => {
    const results = tasks.filter((task) =>
      task.data.name.toLowerCase().includes(searchPhrase.toLowerCase())
    );
    setFilteredTasks(results);
  }, [searchPhrase, tasks]);

  return (
    <div className="main">
      <Header name={name} signOut={signOut} />
      <section className="tasks">
        <ListHeader
          setFilteredTasks={setFilteredTasks}
          searchPhrase={searchPhrase}
          setSearchPhrase={setSearchPhrase}
          setToggleAddTask={setToggleAddTask}
        />
        <List
          user={user}
          db={db}
          filteredTasks={filteredTasks}
          setEditTask={setEditTask}
          setFilteredTasks={setFilteredTasks}
        />
      </section>
      {/* logic allows add task form to be opened and closed */}
      {toggleAddTask && (
        <AddTaskForm user={user} db={db} setToggleAddTask={setToggleAddTask} />
      )}
      {editTask && (
        <EditTaskForm
          user={user}
          db={db}
          editTask={editTask}
          setEditTask={setEditTask}
        />
      )}
    </div>
  );
}
