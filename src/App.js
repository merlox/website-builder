import React, { Component, useState } from 'react'
import { render } from 'react-dom'
// import { useDrag } from 'react-dnd'
import './index.styl'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      headerLinks: localStorage.headerLinks ? JSON.parse(localStorage.headerLinks) : [],
      logo: localStorage.logo ? localStorage.logo : 'Logo',
    }
  }

  render () {
    return (
      <div className="main-container">
        <div className="navigation">
          <div className="logo">{this.state.logo}</div>
          <div className="links">
            <ul>
              {this.state.headerLinks.map((item, i) => {
                return (
                  <li key={i}>{item}</li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="content-container">Hi this is the main content :)</div>

        <SettingsBox
          headerLinks={this.state.headerLinks}
          setHeaderLinks={headerLinks => {
            this.setState({headerLinks})
          }}
          setLogo={logo => {
            this.setState({logo})
          }}
        />
      </div>
    )
  }
}

function SettingsBox (props) {
  const [selectedItem, setSelectedItem] = useState('header')
  return (
    <div className="settings-box">
      <select className="settings-select" onChange={e => {
        setSelectedItem(e.target.value)
      }}>
        <option value="header" name="admin-panel">Header</option>
        <option value="layout" name="admin-panel">Layout</option>
        <option value="footer" name="admin-panel">Footer</option>
        <option value="content" name="admin-panel">Content</option>
      </select>

      <HeaderSettings
        show={selectedItem == 'header'}
        headerLinks={props.headerLinks}
        setHeaderLinks={props.setHeaderLinks}
        setLogo={props.setLogo}
      />

      <LayoutSettings
        show={selectedItem == 'layout'}
      />
    </div>
  )
}

function HeaderSettings (props) {
  const inputRef = React.createRef()
  return (
    <div className={props.show ? "settings-header" : 'hidden'}>
      <div className="settings-header-logo">
        <h3>Logo text</h3>
        <div className="settings-header-logo-actions">
          <input type="text" ref={inputRef} placeholder="Change logo text..."/>
          <button type="button" onClick={() => {
            localStorage.setItem('logo', inputRef.current.value)
            props.setLogo(inputRef.current.value)
          }}>Update Logo</button>
        </div>
      </div>
      <div className="settings-header-links">
        <h3>Navigation items</h3>
        <div className="settings-header-links-actions">
          <ul>
            {props.headerLinks.map((item, i) => {
              return (
                <li
                  key={i}
                  onClick={() => {
                      let copyHeaderLinks = props.headerLinks.slice(0)
                      copyHeaderLinks.splice(i, 1)
                      localStorage.setItem('headerLinks', JSON.stringify(copyHeaderLinks))
                      props.setHeaderLinks(copyHeaderLinks)
                    }}
                >{item}</li>
              )
            })}
          </ul>
          <form onSubmit={e => {
            e.preventDefault()
            const newLink = e.target.querySelector('input[name=header-link-input]').value
            e.target.querySelector('input[name=header-link-input]').value = ''
            const copyHeaderLinks = props.headerLinks.slice(0)
            copyHeaderLinks.push(newLink)
            localStorage.setItem('headerLinks', JSON.stringify(copyHeaderLinks))
            props.setHeaderLinks(copyHeaderLinks)
          }}>
            <input type="text" name="header-link-input" placeholder="Nav link name..." />
            <button>Add Link</button>
          </form>
        </div>
      </div>
    </div>
  )
}

function LayoutSettings (props) {
  // const [collectedProps, drag] = useDrag({
  //   item: {id, type},
  // })
  // console.log(collectedProps, drag)
  return (
    <div className={props.show ? "settings-layout" : 'hidden'}>
      <h3>Layout blocks</h3>
      <div className="settings-layout-actions">
        <div className="left-block"></div>
        <div className="right-block">
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

render(<App />, document.querySelector('#root'))
