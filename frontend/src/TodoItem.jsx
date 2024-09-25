import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const TodoItem = ({ todo, id, fetchTodos, completed }) => {
  const [isCompleted, setIsCompleted] = useState(completed);

  const onRemove = (id) => {
    fetch(`http://localhost:3005/todos/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Item not found");
        }
        toast.error("Item deleted !");
        fetchTodos();
      })
      .catch((error) => console.error("Error:", error));
  };

  const updateTodo = (newValue, id, completed = false) => {
    fetch(`http://localhost:3005/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newValue,
        completed: completed,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Item not found");
        }
        return response.json();
      })
      .then((data) => {
        toast.success("Updated Successfully.");
        fetchTodos();
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));

    console.log(`Updated with value = ${todo}`);
  };

  const onEdit = (id) => {
    let value = prompt("Enter the new value", todo);
    if (value.trim() == todo || value.trim() == "") {
      alert("Enter the valid value !");
    } else if (value) {
      updateTodo(value.trim(), id);
    }
  };

  const onCheck = () => {};

  return (
    <>
      <li className="w-full flex justify-between items-center bg-gray-800 text-white p-2 cursor-default mb-2 rounded-md">
        <div className="todoData">
          <input
            checked={isCompleted}
            type="checkbox"
            name="toggle"
            id="toggle"
            className="cursor-pointer mr-2 size-4"
            onChange={(e) => {
              setIsCompleted(e.target.checked);
              updateTodo(todo, id, e.target.checked);
            }}
          />
          <span className={`${isCompleted && " text-gray-500"}`}>
            {todo}
          </span>
        </div>

        <div className="buttons">
          <button
            onClick={() => onEdit(id)}
            className="bg-blue-500 mr-2 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => onRemove(id)}
            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-200"
          >
            Remove
          </button>
        </div>
      </li>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default TodoItem;
