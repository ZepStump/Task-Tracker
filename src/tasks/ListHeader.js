import React, { useState } from "react";
// icons
import { FaPlus, FaSearch } from "react-icons/fa";

// tasks section header with search, sort, and add task ui
export default function TasksHeader({
  setFilteredTasks,
  searchPhrase,
  setSearchPhrase,
  setToggleAddTask,
}) {
  // init state to monitor sort option
  const [sort, setSort] = useState("due");
  // sorts tasks by name into filteredTasks
  const sortName = () => {
    setSort("name");
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
    setSort("status");
    setFilteredTasks((tasks) => {
      let newTasks = [...tasks];
      newTasks.sort((a, b) => {
        const aLower = a.data.status.toLowerCase();
        const bLower = b.data.status.toLowerCase();
        if (aLower > bLower) {
          return -1;
        } else if (aLower < bLower) {
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
    setSort("due");
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
          className={
            sort === "name" ? "tasks__sort-btn-selected" : "tasks__sort-btn"
          }
          type="button"
          onClick={() => sortName()}
        >
          Name
        </button>
        <button
          className={
            sort === "status" ? "tasks__sort-btn-selected" : "tasks__sort-btn"
          }
          type="button"
          onClick={() => sortStatus()}
        >
          Status
        </button>
        <button
          className={
            sort === "due" ? "tasks__sort-btn-selected" : "tasks__sort-btn"
          }
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
          <FaPlus size={50} />
        </button>
      </div>
    </div>
  );
}
