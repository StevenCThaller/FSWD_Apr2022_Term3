import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models'

const router = express.Router()

router
  .route('/:id')
  .get(async (request, response) => {
    const populateQuery = [
      {
        path: 'posts',
        populate: { path: 'author', select: ['username', 'profile_image'] },
      },
    ]

    const user = await User.findOne({ username: request.params.id })
      .populate(populateQuery)
      .exec()
    if (user) {
      response.json(user.toJSON())
    } else {
      response.status(404).end()
    }
  })
  .put(async (request, response) => {
    const { password, profile_image, current_password } = request.body
    const { id } = request.params

    console.log("Password:", password)
    console.log("Profile Image:", profile_image)

    if (!current_password) {
      return response.status(422).json({ error: "Current password required." })
    }

    const user = await User.findById(id)

    if (!user) {
      return response.status(404).json({ error: "User not found." })
    }

    const isCurrentPasswordValid = bcrypt.compareSync(current_password, user.passwordHash)

    if (!isCurrentPasswordValid) {
      return response.status(401).json({ error: "Invalid password." })
    }

    const updateObject = {}
    if (password) {

      if (password.length < 8 || password.length > 20) {
        return response.status(422).json({ error: "New password must be between 8 and 20 characters in length." })
      }

      updateObject.passwordHash = await bcrypt.hash(password, 12)
    }

    if (profile_image) {
      updateObject.profile_image = profile_image
    }

    if (!password && !profile_image) {
      return response.status(422).json({ error: "Missing all data" })
    }

    try {
      const userUpdate = await User.findByIdAndUpdate(
        {
          _id: id,
        },
        updateObject,
        {
          new: true,
        }
      )

      response.json(userUpdate.toJSON())
    } catch (error) {
      response.status(404).end()
    }
  })

module.exports = router
