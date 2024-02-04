const User = require('../models/userModel.js')
const Admin = require('../models/adminModel.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error occured when fetching users...!' })
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        message: 'Error occured when the time  of fetching single user...!',
      })
  }
}

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profile: req.file ? `${req.file.filename}` : null,
    })

    await newUser.save()

    res.status(201).json({ message: 'User created Successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error occured when creating a user...!' })
  }
}

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params
    const { body } = req

    const updatedUser = await User.findByIdAndUpdate(userId, body, {
      new: true,
    })

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res
      .status(200)
      .json({ message: 'User updated successfully', user: updatedUser })
  } catch (error) {
    console.error('Error updating user:', error.message)
    res.status(500).json({ message: 'Error occured when updating a use..!' })
  }
}

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId)
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res
      .status(200)
      .json({ message: 'User deleted successfully', user: deletedUser })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error occred on deleting user ..!' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await Admin.findOne({ email })

    if (!admin) {
      return res.status(401).json({ message: 'Only admin can access ...!' })
    }

    const isPasswordValid = password == admin.password

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Only admin can access ...!' })
    }

    const token = jwt.sign(
      { adminId: admin._id, role: 'admin' },
      'thisIsSecret',
      { expiresIn: '6d' }
    )

    res.status(200).json({ token })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Error occured in the time of Admin login' })
  }
}
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
}
