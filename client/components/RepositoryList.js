import React, { Component, PropTypes } from 'react'
import _ from 'lodash'

import './RepositoryList.styl'
import RepositoryItem from './RepositoryItem'
import Loader from './Loader'

export default class RepositoryList extends Component {
  static propTypes = {
    repositories: PropTypes.array.isRequired,
    orderBy: PropTypes.string
  }

  constructor(props) {
    super(props)

    // We'll default to using stars as the metric that we order by
    // and we'll also default to ordering by highest first
    this.state = {
      orderBy: props.orderBy || 'stargazers_count',
      desc: (typeof props.desc !== 'undefined') ? props.desc : true
    }
  }

  /**
   * An action handler used for updating state when a change is made
   * to the orderBy Select element
   * 
   * @param  {Object} e
   */
  onOrderByChanged(e) {
    this.setState({ orderBy: e.target.value })
  }

  /**
   * Toggle the state of desc any time this function is triggered
   */
  onDescClicked() {
    this.setState({ desc: !this.state.desc })
  }

  render() {
    // Default content if no results are present
    let contents = <div className='RepositoryList-empty'>
      <p>No results yet!</p>
    </div>

    if (this.props.isLookingUp) {
      // If we still loading the results then display our 
      // loading animation
      contents = <Loader />
    } else if (this.props.repositories.length > 0) {

      // Sort the results based upon the chosen metric
      let sortedList = _.sortBy(this.props.repositories, repo => repo[this.state.orderBy])

      // If we want to order the results by highest first
      // then we can just reverse the sortedList
      if (this.state.desc) {
        sortedList = sortedList.reverse()
      }

      // Map each repo object to a RepositoryItem component
      contents = <ul className='RepositoryList-container'>
        {sortedList.map((repo, id) => <li key={id}><RepositoryItem {...repo} /></li>)}
      </ul>
    }
    

    return <div className='RepositoryList-container'>
      <div className='RepositoryList-controls'>
        <label>Order by</label>
        <select name='orderBy' onChange={this.onOrderByChanged.bind(this)}>
          <option value='stargazers_count'>Stars</option>
          <option value='forks_count'>Forks</option>
          <option value='watchers_count'>Watchers</option>
          <option value='size'>Size</option>
          <option value='created_at'>Created</option>
        </select>
        <label>Highest First</label>
        <input type='checkbox' name='desc' checked={this.state.desc} onChange={this.onDescClicked.bind(this)} />
      </div>
      {contents}
    </div>
  }
}