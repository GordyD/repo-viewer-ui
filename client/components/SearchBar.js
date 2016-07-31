import React, { Component, PropTypes } from 'react'
import cx from 'classnames'

import './SearchBar.styl'

import RequestInfo from './RequestInfo'

export default class SearchBar extends Component {
  static propTypes = {
    initialLookup: PropTypes.string,
    doLookup: PropTypes.func.isRequired,
    isLookingUp: PropTypes.bool.isRequired,
    requestInfo: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      lookup: props.initialLookup,
      valid: !!props.initialLookup
    }
  }

  /**
   * Action handler used when a change is made to the text input
   */
  onLookupChanged(e) {
    this.setState({ lookup: e.target.value, valid: !!e.target.value })
  }

  /**
   * Action handler used when the button is clicked
   */
  onClickLookup() {
    this.props.doLookup(this.state.lookup)
  }

  render() {
    let buttonClass = cx({ disabled: !this.state.valid })

    return <div className='SearchBar-container'>
      <input 
        type='text' 
        name='organisation' 
        placeholder='Type in an Organisation' 
        onChange={this.onLookupChanged.bind(this)}
      />
      <button 
        className={buttonClass} 
        disabled={!this.state.valid || this.props.isLookingUp} 
        onClick={this.onClickLookup.bind(this)}>
        { (this.props.isLookingUp) ? 'Looking Up...' : 'Lookup' }
      </button>
      <RequestInfo {...this.props} />
    </div>
  }
}