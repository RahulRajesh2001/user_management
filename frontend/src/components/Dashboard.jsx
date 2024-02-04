import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MdEdit, MdDeleteForever } from 'react-icons/md';
import { FaSignOutAlt } from 'react-icons/fa';
import { logoutAdmin } from '../reducers/authSlice';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASEURL;

function Dashboard() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');

    if (adminToken) {
      axios
        .get(`${baseUrl}/admin/users`, {
          headers: {
            Authorization: adminToken,
          },
        })
        .then((results) => {
          setUsers(results.data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error.response.data);
        });
    } else {
      console.error('Admin token not found...!');
    }
  }, []);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure?')) {
      const adminToken = localStorage.getItem('adminToken');
      axios
        .delete(`${baseUrl}/admin/users/${userId}`, {
          headers: {
            Authorization: adminToken,
          },
        })
        .then((result) => {
          alert(result.data.message);
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        })
        .catch((err) => {
          console.log(err);
          alert(err.response.data.message);
        });
    }
  };

  const filterUsers = () => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className='bg-white h-screen flex flex-col gap-10'>
      <div className='flex items-center justify-end h-20'>
        <button
          onClick={handleLogout}
          className='ml-4 bg-transparent flex items-center hover:bg-gray-200 text-black hover:text-gray-900 font-bold py-2 px-4 rounded-full mr-[100px]'
        >
          <FaSignOutAlt className='w-4 h-4' /> Logout
        </button>
      </div>
      <div className='relative pb-40'>
        <div className='flex items-center absolute -top-12 left-40 '>
          <p className='mr-4'>Search: </p>
          <input
            className='p-2 outline outline-2 rounded-md outline-gray-200 focus:outline-gray-400'
            type='text'
            placeholder='search...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='flex  text-black hover:text-gray-900 hover:bg-gray-200 p-2 rounded-lg gap-2 absolute right-40 -top-12'>
          <Link to='/createuser'>
            <button>Create User</button>
          </Link>
        </div>

         <div className='w-[100%] flex justify-center gap-5'>
         {filterUsers().map((element) => (
          <div key={element._id} className='flex flex-col justify-center items-center max-w-sm rounded overflow-hidden shadow-lg'>
            <img className='w-[150px] h-[150px] rounded-full ' src={`${baseUrl}/uploads/${element.profile}`} alt='User profile'  />
            <div className='px-6 py-4'>
              <div className='font-bold text-xl mb-2'>{element.name}</div>
              <p className='text-gray-700 text-base'>{element.email}</p>
              <p className='text-gray-700 text-base'>{element.createdAt}</p>
            </div>
            <div className='px-6 pt-4 pb-2'>
              <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
                <Link to={`/editUser/${element._id}`}>Edit</Link>
              </span>
              <span
                onClick={() => handleDelete(element._id)}
                className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer'
              >
                Delete
              </span>
            </div>
          </div>
        ))}
        </div> 
      </div>
    </div>
  );
}

export default Dashboard;
