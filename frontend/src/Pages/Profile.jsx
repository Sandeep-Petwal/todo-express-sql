import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import { FaEdit, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const  Profile = () => {
    const { user, logout, login, updatedUser, updateTheUser } = useContext(AuthContext);
    const { userId, username, email: originalEmail } = user;
    const { Updatedsername, UpdatedEemail } = updatedUser;
    const navigate = useNavigate();

    // Modal
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    // Modal values
    const [name, setName] = useState(Updatedsername || username);
    const [email, setEmail] = useState(UpdatedEemail || originalEmail);


    const [warning, setWarning] = useState("")

    const handleUpdateUser = async () => {
        // Validate name
        if (!name) {
            alert("Name cannot be empty.");
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setWarning("Email cannot be empty.");
            return;
        } else if (!emailRegex.test(email)) {
            setWarning("Please enter a valid email address.");
            return;
        }
        if (email === originalEmail && name === username) {
            setWarning("Credencials cannot be the same as the current.");
            return;
        }


        // Proceed with the update logic
        try {
            console.log("Updating user:", { name, email, userId });
            const uid = localStorage.getItem("uid")
            const url = `http://localhost:3005/api/user/${userId}`;

            const response = await fetch(url, {
                method: 'PUT', // or 'PATCH' depending on your API design
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${uid}`
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setWarning(data.message || "User not found"); // Use a more specific error message
                throw new Error(data.message || "User not found");
            }

            // Optionally handle successful response
            console.log("\n Succeess update \n");
            console.log(data); // or any other success handling logic
            updateTheUser(name, email);
            login(userId, email, name);
            handleClose();

        } catch (error) {
            setWarning("Error while Updating the user!");
            console.error(error); // Log the error for debugging
            throw new Error("Error updating user profile");
        }

    };

    let firstLetter;
    if (Updatedsername) {
        firstLetter = Updatedsername.charAt(0).toUpperCase(); // Get the first letter of the name
    } else {
        firstLetter = username.charAt(0).toUpperCase(); // Get the first letter of the name
    }

    return (
        <>
            <Modal className="mt-32" show={showModal} onHide={handleClose}>
                <Modal.Header closeButton className="bg-blue-600 text-white">
                    <Modal.Title>Update Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-gray-600">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label text-white">Name</label>
                            <input
                                required
                                value={name}
                                type="text"
                                id="name"
                                className="form-control bg-slate-300 text-black"
                                placeholder="Enter your name"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label text-white">Email</label>
                            <input
                                required
                                value={email}
                                type="email"
                                id="email"
                                className="form-control bg-slate-300 text-black"
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </form>

                    <div className="warning text-red-500 font-semibold ">
                        {warning}
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-gray-600">
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateUser}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="main flex justify-center items-center">
                <div className="mt-36 mx-4 flex flex-col items-center p-8 bg-gray-800 text-white shadow-md rounded-lg w-fit">
                    <div className="flex items-center justify-center w-24 h-24 bg-blue-600 text-white text-5xl font-bold rounded-full">
                        {firstLetter}
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">{Updatedsername || username}</h2>
                    <p className="mt-2 text-gray-400">{UpdatedEemail || originalEmail}</p>

                    {/* Button Group */}
                    <div className="mt-4 flex justify-center items-center flex-wrap gap-2 space-x-4">
                        <button
                            onClick={handleShow}
                            className="w-40 flex justify-center ml-4 items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                            <FaEdit className="mr-2" />
                            Edit Profile
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                localStorage.removeItem("uid");
                                navigate("/");
                            }}
                            className="w-40 flex justify-center items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                            <FaSignOutAlt className="mr-2" />
                            Logout
                        </button>
                        <Link to={"/"}>
                            <button className="w-40 flex justify-center items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                <FaHome className="mr-2" />
                                Home
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
