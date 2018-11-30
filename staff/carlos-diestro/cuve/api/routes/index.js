const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../logic')
const jwt = require('jsonwebtoken')
const jwtHelper = require('../utils/jwt-helper')
// const fs = require('fs')

const jsonBodyParser = bodyParser.json()
const router = express.Router()

const { env: { JWT_SECRET } } = process

router.post('/register', jsonBodyParser, async (req, res) => {
  const { fullname, username, email, password } = req.body

  debugger

  try {
    await logic.register(fullname, username, email, password)

    res.json({
      message: 'user registered'
    })
  } catch (error) {
    res.status(409).json({
      error: error.message
    })
  }
})

router.post('/auth', jsonBodyParser, async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await logic.authenticate(username, password)

    const token = jwt.sign({ sub: id }, JWT_SECRET)

    res.json({
      data: {
        id,
        token
      },
      message: 'user authenticated'
    })
  } catch (error) {
    res.status(401).json({
      error: error.message
    })
  }
})

router.get('/users/id/:id', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { id }, sub } = req

  try {
    if (sub !== id) throw Error('token sub does not match with user id')

    const user = await logic.retrieveUser(id)

    res.json({
      data: user,
      message: 'user found'
    })
  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }
})

router.get('/users/username/:username/:id*?', jsonBodyParser, async (req, res) => {
  const { params: { username, id } } = req

  try {
    const user = await logic.retrieveUserByUsername(id, username)

    res.json({
      data: user,
      message: 'user found'
    })
  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }
})

router.post('/users/:id/follow/:username', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { username, id }, sub } = req

  try {
    if (sub !== id) throw Error('token sub does not match with user id')

    const result = await logic.followUserByUsername(id, username)

    res.json({
      message: 'user followed'
    })
  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }
})

router.post('/users/:id/unfollow/:username', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { username, id }, sub } = req
  
  try {
    if (sub !== id) throw Error('token sub does not match with user id')

    const result = await logic.unfollowUserByUsername(id, username)

    res.json({
      message: 'user unfollowed'
    })
  } catch (error) {
    res.status(404).json({
      error: error.message
    })
  }
})

router.get('/users/:uid/threads', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const threads = await logic.retrieveUserThreads(uid)

    res.json({
      data: threads
    })
  } catch (error) {
    debugger
    res.status(409).json({
      error: error.message
    })
  }
})

router.get('/users/:uid/following/threads', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const threads = await logic.retrieveFollowingUsersThreads(uid)

    res.json({
      data: threads
    })
  } catch (error) {
    debugger
    res.status(409).json({
      error: error.message
    })
  }
})

router.get('/users/threads/:tid', async (req, res) => {
  const { params: { tid } } = req

  try {
    const thread = await logic.retrieveThread(tid)

    res.json({
      data: thread
    })
  } catch (error) {
    res.status(409).json({
      error: error.message
    })
  }
})

router.post('/users/:uid/threads', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid }, sub } = req

  const { text } = req.body

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.addThread(uid, text)

    res.json({
      message: 'thread added'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.delete('/users/:uid/threads/:tid', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')
    
    const result = await logic.removeThread(tid, uid)

    res.json({
      message: 'thread removed'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.post('/users/:uid/threads/:tid/comments', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid }, sub } = req

  const { text } = req.body

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.addComment(tid, uid, text)

    res.json({
      message: 'comment added'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.delete('/users/:uid/threads/:tid/comments/:cid', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid, cid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.removeComment(tid, cid, uid)

    res.json({
      message: 'comment removed'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.post('/users/:uid/threads/:tid/share', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.shareThread(tid, uid)

    res.json({
      message: 'thread shared'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.delete('/users/:uid/threads/:tid/unshare', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.unshareThread(tid, uid)

    res.json({
      message: 'thread unshared'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.post('/users/:uid/threads/:tid/like', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.likeThread(tid, uid)

    res.json({
      message: 'thread liked'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.delete('/users/:uid/threads/:tid/unlike', [jwtHelper, jsonBodyParser], async (req, res) => {
  const { params: { uid, tid }, sub } = req

  try {
    if (sub !== uid) throw Error('token sub does not match with user id')

    const result = await logic.unlikeThread(tid, uid)

    res.json({
      message: 'thread unliked'
    })
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

module.exports = router