import React, { Component, useState } from 'react'
import { render } from 'react-dom'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      headerLinks: localStorage.headerLinks ? JSON.parse(localStorage.headerLinks) : [],
    }
  }

  render () {
    return (
      <div>
        <div>
          <div>Logo</div>
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

        <SettingsBox
          headerLinks={this.state.headerLinks}
          setHeaderLinks={headerLinks => {
            this.setState({headerLinks})
          }}
        />
      </div>
    )
  }
}

function SettingsBox (props) {
  return (
    <div>
      <select name="admin-panel" onChange={e => {
        console.log(e.target.value)
      }}>
        <option value="header" name="admin-panel">Header</option>
        <option value="layout" name="admin-panel">Layout</option>
        <option value="footer" name="admin-panel">Footer</option>
        <option value="content" name="admin-panel">Content</option>
      </select>

      <div className="admin-panel-header">
        <div className="logo-modifier"></div>
        <div className="links-modifier">
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
            const copyHeaderLinks = props.headerLinks.slice(0)
            copyHeaderLinks.push(newLink)
            localStorage.setItem('headerLinks', JSON.stringify(copyHeaderLinks))
            props.setHeaderLinks(copyHeaderLinks)
          }}>
            <input type="text" name="header-link-input" />
            <button>Add Link</button>
          </form>
        </div>
      </div>

      <div className="admin-panel-content">
        <button type="button">Background Image</button>
        <div>
          <div className="left-block"></div>
          <div className="right-block"></div>
        </div>
      </div>
    </div>
  )
}

render(<App />, document.querySelector('#root'))
