import React, { Component } from 'react'
import moment from 'moment'

import './App.styl'
import SearchBar from '../components/SearchBar'
import RepositoryList from '../components/RepositoryList'

import { getOrgRepos } from '../service/github'

export default class App extends Component {
  constructor(props) {
    super(props)
    
    // We manage the state of the application in our root component.
    // We could use a state container, but in the interests of
    // simplicity and not over engineering this assignment I have opted
    // to just use component state
    this.state = {
      initialLookup: null,
      lookupError: null,
      isLookingUp: false,
      requestInfo: null,
      repositories: []
    }
  }

  /**
   * Our lookup function that calls getOrgRepos, which returns a promise
   * and then handles both success and failure by setting appropriate state
   * with the response
   * 
   * @param  {String} organisation
   */
  doLookup(organisation) {
    this.setState({ isLookingUp: true, repositories: [], lookupError: null })
    
    getOrgRepos(organisation)
    .then(response => {
      let { requestInfo, repositories } = response

      this.setState({ 
        repositories,
        requestInfo,
        isLookingUp: false,
      })
    })
    .catch(errorResponse => {
      let { requestInfo, repositories } = errorResponse

      this.setState({ 
        repositories,
        requestInfo,
        isLookingUp: false,
      })
    })
  }

  render() {
    return <div className='App-container'>
      <div className='App-header'>
        <h2>Organisation Repo Viewer</h2>
      </div>
      <div className='App-body'>
        <SearchBar 
          initialLookup={this.state.initialLookup}
          doLookup={this.doLookup.bind(this)} 
          isLookingUp={this.state.isLookingUp} 
          requestInfo={this.state.requestInfo}
        /> 
        <RepositoryList 
          repositories={this.state.repositories} 
          isLookingUp={this.state.isLookingUp} 
        />
      </div>
    </div>
  }
}