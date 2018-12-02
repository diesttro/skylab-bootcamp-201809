import React, { Component } from 'react'
import './Profile.css'
import logo from '../../logo.svg'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Main from '../Main/Main'
import logic from '../../logic'

class Profile extends Component {
  state = {}

  componentDidMount = async () => {
    try {
      const user = await logic.getUserData()
      
      this.setState({ user: user })
    } catch (error) {
      console.error(error.message)
    }
  }

  update = () => {
    this.forceUpdate()
  }

  render() {
    // debugger
    return (
      <div className="wrapper">
        <Navbar {...this.props} user={this.state.user} />
        <section className="home">
          <div className="container">
            <div className="row mt-5">
              <Sidebar {...this.props} user={this.state.user} update={this.update} />
              <Main {...this.props} user={this.state.user} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Profile