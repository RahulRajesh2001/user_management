import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { MdEdit, MdDeleteForever } from 'react-icons/md'
import { FaSignOutAlt } from 'react-icons/fa'
import { logoutAdmin } from '../reducers/authSlice'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_BASEURL

function Dashboard() {
  const dispatch = useDispatch()
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')

    if (adminToken) {
      axios
        .get(`${baseUrl}/admin/users`, {
          headers: {
            Authorization: adminToken,
          },
        })
        .then((results) => {
          setUsers(results.data)
        })
        .catch((error) => {
          console.error('Error fetching user data:', error.response.data)
        })
    } else {
      console.error('Admin token not found...!')
    }
  }, [])

  const handleLogout = () => {
    dispatch(logoutAdmin())
    localStorage.removeItem('adminToken')
    navigate('/login')
  }

  const handleDelete = (userId) => {
    if (confirm('Are you sure ?')) {
      const adminToken = localStorage.getItem('adminToken')
      axios
        .delete(`${baseUrl}/admin/users/${userId}`, {
          headers: {
            Authorization: adminToken,
          },
        })
        .then((result) => {
          alert(result.data.message)
          setUsers((users) => users)
        })
        .catch((err) => {
          console.log(err)
          alert(err.data.message)
        })
    }
  }
  const filterUsers = () => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <div className='bg-white h-screen '>
      <div className='bg-emerald-500 flex items-center justify-center h-20'>
        <h1 className='text-white text-xl font-bold'>Welcome 🎉🎉🎉</h1>
        <button
          onClick={handleLogout}
          className='ml-4 bg-transparent flex items-center hover:bg-gray-200 text-white hover:text-gray-900 font-bold py-2 px-4 rounded-full'
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
        <div className='flex bg-blue-500 text-white p-2 rounded-lg gap-2 absolute right-40 -top-12'>
          <Link to='/createuser'>
            <button>Create User</button>
          </Link>
        </div>
        <table className='bg-white shadow-xl w-[80%] mt-20 text-gray-600 mx-auto overflow-hidden  rounded-lg'>
          <thead className='bg-slate-100'>
            <tr>
              <td className='border-b-2 p-4 pl-10 text-start'>Profile</td>
              <td className='border-b-2 p-4 text-start'>Name</td>
              <td className='border-b-2 p-4 text-start'>Email</td>
              <td className='border-b-2 p-4 text-start'>Created at</td>
              <td className='border-b-2 p-4 text-start'>Edit</td>
              <td className='border-b-2 p-4 text-start'>Delete</td>
            </tr>
          </thead>
          <tbody>
            {filterUsers().map((item) => {
              return (
                <tr
                  key={item._id}
                  className='hover:bg-gray-200 hover:text-gray-950'
                >
                  <td className='border-b-2 p-4 pl-10'>
                    <div className='w-16 h-16 rounded-full border'>
                      <img
                        src={`${baseUrl}/uploads/${item.profile}`}
                        alt='image'
                      />
                    </div>
                  </td>
                  <td className='border-b-2 p-4'>{item.name}</td>
                  <td className='border-b-2 p-4'>{item.email}</td>
                  <td className='border-b-2 p-4'>{item.createdAt}</td>
                  <td className='border-b-2 p-4'>
                    <Link to={`/editUser/${item._id}`}>
                      <MdEdit />
                    </Link>
                  </td>
                  <td
                    onClick={() => handleDelete(item._id)}
                    className='border-b-2 p-4'
                  >
                    <MdDeleteForever />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
