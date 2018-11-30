import React, { Component } from 'react'
import './Home.css'
import logo from '../../logo.svg'
import { Container, Row, Col, Form, Input, FormGroup, FormFeedback, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Main from '../Main/Main'
import logic from '../../logic'

class Home extends Component {
  state = { }

  componentWillMount = async () => {
    debugger
    const user = await logic.getUserData()

    this.setState(user)
  }

  render() {
    debugger
    return (
      <div className="wrapper">
        <Navbar />
        <section className="home">
          <div className="container">
            <div className="row mt-5">
              <Sidebar path={this.props.location.pathname} />
              <Main path={this.props.location.pathname} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Home