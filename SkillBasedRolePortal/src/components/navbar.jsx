import * as React from 'react'
import login from './login.jsx'
import { Container, Nav,  Navbar, NavDropdown } from 'react-bootstrap'

function navbar(){
    var status = sessionStorage.getItem('status')
    var fname = sessionStorage.getItem('fname')
    var lname = sessionStorage.getItem('lname')
    function checkUser() {
        if (status !== 'true') {
          return (
            <Nav>
              {login()}
            </Nav>
          );
        } else {
          return (
            <Nav>
              <NavDropdown title={`${fname} ${lname}`} id="collasible-nav-dropdown">
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item href="/logout">Log Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          );
        }
      }

    // Display if HR is logged in
    function checkHr() {
        if(sessionStorage.getItem('sys_role') == 'hr'){
            return (
                <Nav.Link href="/viewSkills">Skills</Nav.Link>
            )
        }
    }

 
    return(
        <>
        <Navbar collapseOnSelect expand ="lg" className='bg-body-tertiary'>
            <Container>
                <Navbar.Brand href="/">Skill Based Role Portal</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className='mr-auto'>
                        <Nav.Link href="/viewRoles">Role Listings</Nav.Link>
                        <Nav.Link href="/viewSingleRole">Single Role Listing</Nav.Link>
                        <Nav.Link href="/createRoleListing">Create Role Listing</Nav.Link>
                        <Nav.Link href="/updateRoleListing">Update Role Listing</Nav.Link>
                        <Nav.Link href="/about">About</Nav.Link>
                        <Nav.Link href="/contact">Contact</Nav.Link>
                        <Nav.Link href="/faq">FAQ</Nav.Link>
                        <Nav.Link href="/help">Help</Nav.Link>
                        <Nav.Link href="/resources">Resources</Nav.Link>
                        <Nav.Link href="/terms">Terms</Nav.Link>
                        <Nav.Link href="/privacy">Privacy</Nav.Link>
                        {checkHr()}
                    </Nav>
                    <Nav className='m-auto'>
                        {checkUser()}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    )

}

export default navbar