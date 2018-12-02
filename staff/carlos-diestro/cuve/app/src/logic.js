const validate = require('./utils/validate')

const logic = {
  url: 'http://localhost:8080/api/',
  _user: JSON.parse(sessionStorage.getItem('user')) || null,

  get isLoggedIn() {
    return !!this._user
  },

  async signUp(fullname, username, email, password, repassword) {
    validate([
      { key: 'fullname', value: fullname, type: String },
      { key: 'username', value: username, type: String },
      { key: 'email', value: email, type: String },
      { key: 'password', value: password, type: String },
      { key: 'repassword', value: repassword, type: String }
    ])

    if (repassword !== password) throw Error('passwords do not match')

    const endpoint = 'register'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ fullname, username, email, password })
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
    
    if (res.error) throw Error(res.error)
    
    return res
  },

  async signIn(username, password) {
    validate([
      { key: 'username', value: username, type: String },
      { key: 'password', value: password, type: String }
    ])

    const endpoint = 'auth'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ username, password })
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
    
    if (res.error) throw Error(res.error)

    const { id, token } = res.data
    
    this._user = {
      id,
      token
    }

    sessionStorage.setItem('user', JSON.stringify(this._user))
  },

  signOut() {
    this._user = null
    
    sessionStorage.removeItem('user')
  },

  async getUserData() {
    const endpoint = 'users/id/' + this._user.id
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
    
    if (res.error) throw Error(res.error)
    
    return res.data
  },

  async getUserDataByUsername(username) {
    validate([
      { key: 'username', value: username, type: String }
    ])

    let endpoint = 'users/username/' + username
    let headers = { 'Content-Type': 'application/json; charset=utf-8' }
    
    if (this.isLoggedIn) {
      endpoint = 'users/username/' + username + '/' + this._user.id
      headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    const options = {
      method: 'GET',
      headers: headers
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
    
    if (res.error) throw Error(res.error)
    
    return res.data
  },

  async saveChanges(avatar, fullname, username, email, priv) {
    // validate([
    //   { key: 'text', value: text, type: String }
    // ])

    let formData = new FormData()

    formData.append('avatar', avatar)
    formData.append('fullname', fullname)
    formData.append('username', username)
    formData.append('email', email)
    formData.append('private', priv)

    const endpoint = 'users/' + this._user.id + '/update'
    const options = {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      },
      body: formData
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    debugger

    if (res.error) throw Error(res.error)

    return res.message
  },

  async searchUser(username) {
    validate([
      { key: 'username', value: username, type: String }
    ])

    const endpoint = 'users/search/' + username
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // 'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
    
    if (res.error) throw Error(res.error)
    
    return res.data
  },

  async getUserThreads() {
    const endpoint = 'users/' + this._user.id + '/threads'
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
    
    if (res.error) throw Error(res.error)
    
    return res.data
  },

  async getThread(id) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    const endpoint = 'users/threads/' + id
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // 'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
    
    if (res.error) throw Error(res.error)
    
    return res.data
  },

  async getFollowingUsersThreads() {
    const endpoint = 'users/' + this._user.id + '/following/threads'
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
    
    if (res.error) throw Error(res.error)
    
    return res.data
  },

  async writeThread(text) {
    validate([
      { key: 'text', value: text, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/threads'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      },
      body: JSON.stringify({ text })
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    if (res.error) throw Error(res.error)

    return res.message
  },

  async writeComment(id, text) {
    debugger
    validate([
      { key: 'id', value: id, type: String },
      { key: 'text', value: text, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/threads/' + id + '/comments'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      },
      body: JSON.stringify({ text })
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()
debugger
    if (res.error) throw Error(res.error)

    return res.message
  },

  async shareThread(id) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/threads/' + id + '/share'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    if (res.error) throw Error(res.error)

    return res.message
  },

  async unshareThread(id) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/threads/' + id + '/unshare'
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    if (res.error) throw Error(res.error)

    return res.message
  },

  async likeThread(id) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/threads/' + id + '/like'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    if (res.error) throw Error(res.error)

    return res.message
  },

  async unlikeThread(id) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/threads/' + id + '/unlike'
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    if (res.error) throw Error(res.error)

    return res.message
  },

  async deleteThread(id) {
    validate([
      { key: 'id', value: id, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/threads/' + id
    
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    if (res.error) throw Error(res.error)

    return res.data
  },

  async follow(username) {
    validate([
      { key: 'username', value: username, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/follow/' + username
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    if (res.error) throw Error(res.error)

    return res.message
  },

  async unfollow(username) {
    validate([
      { key: 'username', value: username, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/unfollow/' + username
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    if (res.error) throw Error(res.error)

    return res.message
  },

  async acceptFollow(username) {
    validate([
      { key: 'username', value: username, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/follow/' + username + '/accept'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    if (res.error) throw Error(res.error)

    return res.message
  },

  async rejectFollow(username) {
    validate([
      { key: 'username', value: username, type: String }
    ])

    const endpoint = 'users/' + this._user.id + '/follow/' + username + '/reject'
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + this._user.token
      }
    }

    let res =  await fetch(this.url + endpoint, options)
    res = await res.json()

    if (res.error) throw Error(res.error)

    return res.message
  }
}

export default logic