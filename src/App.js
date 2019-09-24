import React, { Component, useState } from 'react'
import { render } from 'react-dom'
import './index.styl'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      headerLinks: localStorage.headerLinks ? JSON.parse(localStorage.headerLinks) : [],
      logo: localStorage.logo ? localStorage.logo : 'Logo',
      dragStarted: false,
      blockIds: 0,
      mainContentBlocks: [],
    }
  }

  destructElement (id) {
    let mainContentBlocksCopy = this.state.mainContentBlocks.splice(0)
    let filtered = mainContentBlocksCopy.filter(item => {
      return item != id
    })

    this.setState({
      mainContentBlocks: filtered
    })
  }

  onDrop (e) {
    this.setState({dragginOver: false})
    const data = e.dataTransfer.getData('layout')
    let ids = this.state.blockIds
    let mainContentBlocksCopy = this.state.mainContentBlocks.splice(0)

    switch (data) {
      case 'left-block':
        if (mainContentBlocksCopy.length == 0) {
          mainContentBlocksCopy = [[ids]]
        } else {
          mainContentBlocksCopy.push([ids])
        }
        this.setState({
          mainContentBlocks: mainContentBlocksCopy,
          blockIds: ids + 1,
        })
        break
      case 'right-block':
        if (mainContentBlocksCopy.length == 0) {
          mainContentBlocksCopy = [[ids, ids + 1]]
        } else {
          mainContentBlocksCopy.push([ids, ids + 1])
        }
        this.setState({
          mainContentBlocks: mainContentBlocksCopy,
          blockIds: ids + 2,
        })
        break
    }
  }

  render () {
    let mainContentClass = 'content-container'
    if (this.state.dragStarted) mainContentClass += ' drag-started'
    if (this.state.dragginOver) mainContentClass += ' drag-over'

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

        {this.state.mainContentBlocks.map(area => (
          <div className="empty-blocks-container" key={area}>
            {area.map(id => (
              <EmptyBlock
                key={id}
                blockId={id}
                selfDestruct={id => this.destructElement(id)}
              />
            ))}
          </div>
        ))}

        <div
          onDragEnter={e => {
            e.preventDefault()
            this.setState({dragginOver: true})
          }}
          onDragLeave={e => {
            e.preventDefault()
            this.setState({dragginOver: false})
          }}
          onDragOver={e => e.preventDefault()}
          className={mainContentClass}
          onDrop={e => {
            e.preventDefault()
            this.onDrop(e)
          }}
        ></div>

        <SettingsBox
          headerLinks={this.state.headerLinks}
          setHeaderLinks={headerLinks => {
            this.setState({headerLinks})
          }}
          setLogo={logo => {
            this.setState({logo})
          }}
          dragStarted={e => this.setState({dragStarted: true})}
          dragEnded={e => this.setState({dragStarted: false})}
        />
      </div>
    )
  }
}

function SettingsBox (props) {
  const [selectedItem, setSelectedItem] = useState('layout')
  return (
    <div className="settings-box">
      <select className="settings-select" onChange={e => {
        setSelectedItem(e.target.value)
      }}>
        <option value="layout" name="admin-panel">Layout</option>
        <option value="header" name="admin-panel">Header</option>
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
        dragStarted={props.dragStarted}
        dragEnded={props.dragEnded}
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

class LayoutSettings extends Component {
  constructor (props) {
    super(props)
  }

  dragStart (e) {
    e.dataTransfer.setData('layout', e.target.className)
    e.target.style.opacity = 0.4
    this.props.dragStarted(e.target.className)
  }

  dragEnd (e) {
    e.target.style.opacity = 1
    this.props.dragEnded(e.target.className)
  }

  render () {
    return (
      <div className={this.props.show ? "settings-layout" : 'hidden'}>
        <h3>Layout blocks</h3>
        <div className="settings-layout-actions">
          <div
            className="left-block"
            draggable="true"
            onDragStart={e => this.dragStart(e)}
            onDragEnd={e => this.dragEnd(e)}
          ></div>
          <div
            className="right-block"
            draggable="true"
            onDragStart={e => this.dragStart(e)}
            onDragEnd={e => this.dragEnd(e)}
          >
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    )
  }
}

function EmptyBlock (props) {
  const [isTitleHidden, setTitleHidden] = useState(false)
  const [isEditingHeading, setIsEditingHeading] = useState(false)
  const [headingText, setHeadingText] = useState('Text')
  const [showEditHeadingButton, setShowEditHeadingButton] = useState(false)

  const [isTextHidden, setTextHidden] = useState(false)
  const [isEditingText, setIsEditingText] = useState(false)
  const [textContent, setTextContent] = useState('Text')
  const [showTextEditButton, setShowTextEditButton] = useState(false)

  const [isImgHidden, setImgHidden] = useState(false)
  const [uploadedImg, setUploadedImg] = useState(null)

  let imgUploadRef = React.createRef()
  let className = 'empty-block-actions'
  if (isTitleHidden || isTextHidden || isImgHidden) className += ' hidden'
  return (
    <div className="empty-block">
      <div className="empty-block-inner">
        <button
          type="button"
          className="delete-button"
          onClick={e => {
            props.selfDestruct(props.blockId)
          }}
        >Delete</button>

        <div className={isTitleHidden ? '' : 'hidden'}>
          <form className={isEditingHeading ? '' : 'hidden'} onSubmit={e => {
            e.preventDefault()
            setIsEditingHeading(false)
          }}>
            <input type="text" onChange={e => {
              setHeadingText(e.target.value)
            }} placeholder="Title text..." defaultValue={headingText}/>
            <button
              type="button"
              onClick={e => {
                setIsEditingHeading(false)
              }}
            >Edit</button>
          </form>
          <h3
            className={!isEditingHeading ? '' : 'hidden'}
            onMouseEnter={e => {
              setShowEditHeadingButton(true)
            }}
            onMouseLeave={e => {
              setShowEditHeadingButton(false)
            }}
          >
            {headingText} &nbsp;
            <button
              className={showEditHeadingButton ? '' : 'hidden'}
              type="button"
              onClick={e => {
                setIsEditingHeading(true)
              }}
            >Edit</button>
          </h3>
        </div>

        <div className={isTextHidden ? '' : 'hidden'}>
          <form className={isEditingText ? '' : 'hidden'} onSubmit={e => {
            e.preventDefault()
            setIsEditingText(false)
          }}>
            <input type="text" onChange={e => {
              setTextContent(e.target.value)
            }} placeholder="Title text..." defaultValue={textContent}/>
            <button
              type="button"
              onClick={e => {
                setIsEditingText(false)
              }}
            >Save</button>
          </form>
          <p
            className={!isEditingText ? '' : 'hidden'}
            onMouseEnter={e => {
              setShowTextEditButton(true)
            }}
            onMouseLeave={e => {
              setShowTextEditButton(false)
            }}
          >
            {textContent} &nbsp;
            <button
              className={showTextEditButton ? '' : 'hidden'}
              type="button"
              onClick={e => {
                setIsEditingText(true)
              }}
            >Edit</button>
          </p>
        </div>

        <div className={isImgHidden ? 'image-container' : 'hidden'}>
          <input
            ref={imgUploadRef}
            type="file"
            className={uploadedImg ? 'hidden' : ''}
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                let img = document.createElement('img')
                img.src = URL.createObjectURL(e.target.files[0])
                img.addEventListener('load', () => {
                  setUploadedImg(img.src)
                })
              }
            }}
          />
          <img
            src={uploadedImg}
            alt="Uploaded img"
            className={uploadedImg ? 'uploaded-image' : 'hidden'}
          />
        </div>

        <div className={className}>
          <button type="button" onClick={e => {
            setTitleHidden(true)
          }}>Add Heading</button>
          <button type="button" onClick={e => {
            setTextHidden(true)
          }}>Add Text</button>
          <button type="button" onClick={e => {
            setImgHidden(true)
            imgUploadRef.current.click()
          }}>Add Image</button>
        </div>
      </div>

      <div className="dropzone">Drop here</div>
    </div>
  )
}

render(<App />, document.querySelector('#root'))
