import React from "react";
// icons
import { FaPlus, FaSearch } from "react-icons/fa";

// tasks section header with search, sort, and add task ui
export default function TasksHeader({
  setFilteredTasks,
  searchPhrase,
  setSearchPhrase,
  sort,
  setSort,
  setToggleAddTask,
}) {
  // sorts tasks by name into filteredTasks
  const sortName = () => {
    setSort("name");
  };
  // sorts tasks by status into filteredTasks
  const sortStatus = () => {
    setSort("status");
  };
  // sorts tasks by due date into filteredTasks
  const sortDue = () => {
    setSort("due");
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
