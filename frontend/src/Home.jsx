import { useEffect, useState, useContext } from "react";
import TodoItem from "./components/TodoItem";
import { AuthContext } from "./context/AuthContextProvider";
import { Toaster, toast } from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { BiLogOut, BiSolidUserCircle } from "react-icons/bi";
import { Link } from "react-router-dom";

const Home = () => {
  const { user, login, logout } = useContext(AuthContext);
  const { isLoggedIn, userId } = user;
  const [userName, setUserName] = useState(null);

  const [noTodos, setNoTodos] = useState(true);
  // console.log(user);

  const urlFetchTodos = `http://localhost:3005/api/todos/${userId}`;
  const urlAdd = "http://localhost:3005/api/todos/";
  const verifyUrl = "http://localhost:3005/api/auth/verifyToken";

  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [tab, setTab] = useState("all");
  const [counts, setCounts] = useState({
    total: 0,
    completed: 0,
    notCompleted: 0,
  });
  const [loader, setLoader] = useState(false);


  const updateCounts = (todos) => {
    const { total, completed, notCompleted } = todos.reduce(
      (acc, todo) => {
        acc.total += 1;
        if (todo.completed) {
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

  const fetchTodos = async () => {
    let token = localStorage.getItem("uid")
    try {
      const response = await fetch(urlFetchTodos, {
        credentials: "include",
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },

      })

      if (response.status == 204) {
        // no todos created by the user yet
        setTodos([]);
        setNoTodos(true);
        return
      }
      if (response.ok) {
        const data = await response.json();
        // console.log(` :: fetchTodos Url : ${urlFetchTodos} Data for  (Userid : ${userId}) : `);
        // console.table(data);
        setTodos(data);
        updateCounts(data);
        setNoTodos(false);

        setUserName(data[0].user.username)
        return
      } else {
        // logout()
        console.log("Error while fetching the user detail !")
      }
    }
    catch (error) {
      console.log("Fetch error in fetchTodos:", error);
    }
  };



  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const checkLoginStatus = async () => {
      if (uid) {
        try {
          const response = await fetch(verifyUrl, {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${uid}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            // console.log("Verified user detail - ");
            // console.table(data.user)
            // console.log("Before login() userId from data is : " + data.user.userId);
            login(data.user.userId, data.user.email, data.user.username);
          }
        } catch (error) {
          console.log("Error verifying token :: inside fetch(verifyUrl)\n" + error);
          logout();
          localStorage.removeItem("uid");
        }
      }
    };

    if (isLoggedIn || uid) {
      checkLoginStatus();
    }
  }, []);

  useEffect(() => {
    if (userId) {
      // console.log("After login() userId from context is : " + userId);
      fetchTodos();
    }
  }, [userId]); // This runs when userId is updated



  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  const handleAddTask = () => {
    const token = localStorage.getItem('uid');
    if (!token) {
      logout();
    }

    if (task.trim()) {
      setLoader(true);
      fetch(urlAdd, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // Include token in Authorization header
        },
        body: JSON.stringify({
          title: task,
          userId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Created item:", data);
          fetchTodos();  // Refresh the todos
          toast.success("Successfully added!");
          setTask("");
          setLoader(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("This didn't work.");
          setLoader(false);
        });
    } else {
      toast.error("Enter a valid value.");
    }
  };


  if (!isLoggedIn) {
    return (
      <>
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-850 text-white">
          <img
            src={"./todoBanner.jpg"}
            alt="Todo Banner"
            className="w-full md:w-1/2 lg:w-1/3 mb-6 md:mb-0 md:mr-6"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-6">Welcome to Tasks!</h1>
            <p className="text-lg mb-8">
              Manage your tasks efficiently and effectively.
            </p>
            <div className="flex flex-col md:flex-row space-x-0 md:space-x-4">
              <Link
                to="/signup"
                className="mb-2 h-14 md:mb-0 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-6 h-14 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-5 bg-gray-900 text-white">
      {userName && (
        <h1 className="mb-10 font-bold text-3xl underline underline-offset-8 font-mono text-blue-300  ">
          {userName}&lsquo;s Tasks
        </h1>
      )}

      <form>
        <div className="flex w-[400px] max-w-md gap-2">
          <input
            type="text"
            value={task}
            onChange={handleInputChange}
            placeholder="Add a new task"
            className="flex-1 p-2 h-20 border font-bold text-xl border-gray-700 rounded-l-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddTask();
            }}
            className="bg-blue-500 text-white px-7  text-4xl font-bold rounded-r-md hover:bg-blue-600 transition duration-200"
          >
            {!loader ? (
              <FaPlus />
            ) : (
              <img src="/loading.gif" className="size-8" />
            )}
          </button>
        </div>
      </form>

      {/* if there is no todos yet  */}
      {noTodos && (
        <h1 className="text-white mt-5 font-bold">
          There is no todos yet ! create first one now 👆
        </h1>
      )}

      {/* Tabs */}
      {!noTodos && (
        <>

          <ul className="mt-5 flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
            <li className="me-2" onClick={() => setTab("all")}>
              <a
                href="#"
                className={`${tab === "all" ? "text-blue-400 bg-slate-800" : ""
                  } inline-block p-4 rounded-t-lg hover:text-gray-200 hover:bg-gray-800`}
              >
                All ({counts.total})
              </a>
            </li>
            <li className="me-2" onClick={() => setTab("active")}>
              <a
                href="#"
                className={`${tab === "active" ? "text-blue-400 bg-slate-800" : ""
                  } inline-block p-4 rounded-t-lg hover:text-gray-200 hover:bg-gray-800`}
              >
                Active ({counts.notCompleted})
              </a>
            </li>
            <li className="me-2" onClick={() => setTab("completed")}>
              <a
                href="#"
                className={`${tab === "completed" ? "text-blue-400 bg-slate-800" : ""
                  } inline-block p-4 rounded-t-lg hover:text-gray-200 hover:bg-gray-800`}
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
                {todos.filter((todoItem) => !todoItem.completed).length > 0 ? (
                  todos
                    .filter((todoItem) => !todoItem.completed)
                    .map((todoItem) => (
                      <TodoItem
                        key={todoItem.id}
                        todo={todoItem.title}
                        id={todoItem.id}
                        completed={todoItem.completed}
                        fetchTodos={fetchTodos}
                      />
                    ))
                ) : (
                  <p>No Active tasks</p>
                )}
              </>
            )}

            {tab === "completed" && (
              <>
                {todos.filter((todoItem) => todoItem.completed).length > 0 ? (
                  todos
                    .filter((todoItem) => todoItem.completed)
                    .map((todoItem) => (
                      <TodoItem
                        key={todoItem.id}
                        todo={todoItem.title}
                        id={todoItem.id}
                        completed={todoItem.completed}
                        fetchTodos={fetchTodos}
                      />
                    ))
                ) : (
                  <p>No completed tasks</p>
                )}
              </>
            )}



            {isLoggedIn && (<section className="BottomSection mt-28 mb-20 flex justify-center items-center gap-4 w-full">
              <button
                onClick={() => {
                  logout();
                  localStorage.removeItem("uid");
                }}
                className="h-10 flex items-center bg-gray-800 text-white rounded-lg px-4 hover:bg-gray-700 transition">
                <BiLogOut className="h-6 w-6 mr-2" />
                Sign out
              </button>
              <Link to={"/profile"}>
                <button className="h-10 flex items-center bg-gray-800 text-white rounded-lg px-4 hover:bg-gray-700 transition">
                  <BiSolidUserCircle className="h-6 w-6 mr-2" />
                  Profile
                </button>
              </Link>
            </section>)}


          </div>
        </>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Home;
