import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASEURL;

function EditUserHome() {
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const ID = useParams();
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim() === "") {
      alert("Please enter your name.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePhoto", image);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    const token = localStorage.getItem("token");

    axios
      .put(`${baseUrl}/user/edituser/${ID.userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })
      .then((response) => {
        alert(response.data.message);
        navigate("/");
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${baseUrl}/user/getuser/${ID.userId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        setUser(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">Edit</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            <label htmlFor="upload" className={`inline-block bg-gray-200 rounded-full  p-0 cursor-pointer`}>
              {<img src={imagePreview ? imagePreview : `${baseUrl}/uploads/${user.profile}`} alt="Preview" className="rounded-full w-32 h-32 object-cover border p-2" />}
            </label>
            <input type="file" id="upload" accept="image/*" style={{ display: "none" }} required onChange={handleImageChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
              Full Name *
            </label>
            <input type="text" id="name" className="htmlForm-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500" required placeholder={user.name} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address *
            </label>
            <input type="email" id="email" className="htmlForm-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500" required placeholder={user.email} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Password *
            </label>
            <input type="password" id="password" className="htmlForm-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Submit edit
          </button>
          <Link to="/dashboard">
            <button className="mx-auto flex mt-4 underline">go back</button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default EditUserHome;