import React, { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const TodoItem = ({ todo, id, fetchTodos, completed }) => {
  const [isCompleted, setIsCompleted] = useState(completed);

  // modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [modalValue, setModalValue] = useState(todo);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showModal) {
      inputRef.current.focus();
    }
  }, [showModal]);

  const onRemove = (id) => {
    const token = localStorage.getItem('uid');  // Retrieve token from localStorage
  
    console.log("Deleting item with id : " + id);
    fetch(`http://localhost:3005/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,  // Include token in Authorization header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Item not found");
        }
        toast.error("Item deleted !");
        fetchTodos();  // Refresh the todos
      })
      .catch((error) => {
        toast.error("Error while deleting  !");
        console.error("Error:", error);
      });
  };
  

  const updateTodo = (newValue, id, completed = false) => {
    const token = localStorage.getItem('uid');  // Retrieve token from localStorage
  
    fetch(`http://localhost:3005/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // Include token in Authorization header
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
        fetchTodos();  // Refresh the todos
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  };
  

  const onEdit = (id) => {
    setModalValue(todo); // Set current todo value to modal input
    handleShow(); // Show the modal for editing
  };

  const handleModalSubmit = () => {
    if (modalValue.trim() === "" || modalValue.trim() === todo) {
      alert("Enter a valid value!");
    } else {
      updateTodo(modalValue.trim(), id); // Update todo with the new value
      handleClose(); // Close modal after updating
    }
  };

  return (
    <>
      <div>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Todo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              ref={inputRef}
              type="text"
              value={modalValue}
              className="ring-1 w-full h-11 p-2"
              onChange={(e) => {
                setModalValue(e.target.value);
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleModalSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <li className="w-full flex justify-between items-center bg-gray-800 hover:bg-gray-700 text-white p-2 cursor-default mb-2 rounded-md">
        <div className="todoData">
          <input
            checked={isCompleted}
            type="checkbox"
            name="toggle"
            id="toggle"
            className="cursor-pointer mr-2 size-5"
            onChange={(e) => {
              setIsCompleted(e.target.checked);
              updateTodo(todo, id, e.target.checked);
            }}
          />
          <span className={`${isCompleted && " text-gray-500"}`}>{todo}</span>
        </div>

        <div className="buttons">
          {!completed && (
            <button
              onClick={() => onEdit(id)} // Show modal on Edit button click
              className="bg-blue-500 mr-2 h-10 w-18 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition duration-200"
            >
              <FaPen />
            </button>
          )}{" "}
          <button
            onClick={() => onRemove(id)}
            className="bg-red-500 h-10 w-18 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-200"
          >
            <FaRegTrashAlt className="" />
          </button>
        </div>
      </li>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default TodoItem;
