import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../reducers/authSlice";


const baseUrl = import.meta.env.VITE_BASEURL;

function Home() {
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        var token=localStorage.getItem('token')
        const response = await axios.get(`${baseUrl}/user/getUser/${userId}`, {
          headers: {
            Authorization: token,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
  

      <div className="flex justify-center items-center w-[100%] h-screen">
        <div className="flex flex-col justify-center items-center">
        <div>
        <img src={`${baseUrl}/uploads/${userData.profile}`} alt="Profile" className="rounded-full border w-32 h-32 mb-4 bg-slate-400" />
        </div>
        <div>

        {userData && <div  className="font-semibold text-[25px] flex gap-5 justify-center"><div className="text-[20px] font-light">Hii...!</div> {userData.name}</div>}
        <h3 className="font-light text-xl flex justify-center">Welcome to HomePage...!</h3>
        </div>
        <div className="flex justify-center items-center gap-5">
        <Link to={`/edituserhome/${userId}`}>
          <button className=" bg-red-500 mt-4 w-[10px] flex  justify-center  rounded-full px-10 text-white p-2">Edit</button>
        </Link>
        <button onClick={handleLogout} className="bg-pink-600 mt-4 w-[10px] flex  justify-center  rounded-full px-10 text-white p-2">
          Logout
        </button>
        
        </div>
      </div>
      </div>
      
    
  );
}

export default Home;
