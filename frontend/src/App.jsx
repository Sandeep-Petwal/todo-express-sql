import React, { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { Toaster, toast } from "react-hot-toast";

const App = () => {
  const url = "http://localhost:3005/todos";
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [tab, setTab] = useState("all");
  const [counts, setCounts] = useState({
    total: 0,
    completed: 0,
    notCompleted: 0,
  });

  const fetchTodos = () => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        updateCounts(data); // Update counts after setting todos
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const updateCounts = (todos) => {
    const { total, completed, notCompleted } = todos.reduce(
      (acc, todo) => {
        acc.total += 1;
        if (todo.completed === 1) {
          acc.completed += 1;
        } else {
          acc.notCompleted += 1;
        }
        return acc;
      },
      { total: 0, completed: 0, notCompleted: 0 }
    );

    setCounts({ total, completed, notCompleted });
  };

  useEffect(() => {
    fetchTodos();
  }, [url]);

  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  const handleAddTask = () => {
    if (task.trim()) {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Created item:", data);
          fetchTodos();
          toast.success("Successfully added!");
          setTask("");
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("This didn't work.");
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <form>
        <div className="flex w-[400px] max-w-md gap-2">
          <input
            type="text"
            value={task}
            onChange={handleInputChange}
            placeholder="Add a new task"
            className="flex-1 p-2 border border-gray-700 rounded-l-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="submit"
            value="+"
            onClick={(e) => {
              e.preventDefault();
              handleAddTask();
            }}
            className="bg-blue-500 text-white px-7 py-5 text-4xl font-bold rounded-r-md hover:bg-blue-600 transition duration-200"
          />
        </div>
      </form>

      {/* tabs */}
      <ul className="mt-5 flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-2" onClick={() => setTab("all")}>
          <a
            href="#"
            className={`${
              tab === "all" ? "text-blue-400 bg-slate-800" : ""
            } inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300`}
          >
            All ({counts.total})
          </a>
        </li>
        <li className="me-2" onClick={() => setTab("active")}>
          <a
            href="#"
            className={`${
              tab === "active" ? "text-blue-400 bg-slate-800" : ""
            } inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300`}
          >
            Active ({counts.notCompleted})
          </a>
        </li>
        <li className="me-2" onClick={() => setTab("completed")}>
          <a
            href="#"
            className={`${
              tab === "completed" ? "text-blue-400 bg-slate-800" : ""
            } inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300`}
          >
            Completed ({counts.completed})
          </a>
        </li>
      </ul>

      <div className="item-container w-[400px] mt-10">
        {tab === "all" &&
          todos.map((todoItem) => (
            <TodoItem
              key={todoItem.id}
              todo={todoItem.title}
              id={todoItem.id}
              completed={todoItem.completed}
              fetchTodos={fetchTodos}
            />
          ))}

        {tab === "active" && (
          <>
            {todos.some((todoItem) => todoItem.completed === 0) ? (
              todos.map((todoItem) => {
                if (!todoItem.completed) {
                  return (
                    <TodoItem
                      key={todoItem.id}
                      todo={todoItem.title}
                      id={todoItem.id}
                      completed={todoItem.completed}
                      fetchTodos={fetchTodos}
                    />
                  );
                }
                return null;
              })
            ) : (
              <p>No Active tasks</p>
            )}
          </>
        )}

        {tab === "completed" && (
          <>
            {todos.some((todoItem) => todoItem.completed) ? (
              todos.map((todoItem) => {
                if (todoItem.completed) {
                  return (
                    <TodoItem
                      key={todoItem.id}
                      todo={todoItem.title}
                      id={todoItem.id}
                      completed={todoItem.completed}
                      fetchTodos={fetchTodos}
                    />
                  );
                }
                return null;
              })
            ) : (
              <p>No completed tasks</p>
            )}
          </>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
