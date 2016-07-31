import React, { PropTypes } from 'react'
import moment from 'moment'

import './RepositoryItem.styl'

/**
 * This is a stateless functional component. Because we do not need
 * to store any internal state in this component we can just create
 * a component that renders based on what it is passed as props.
 */
const RepositoryItem = (props) => <div className='RepositoryItem-container'>
  <h3 className='RepositoryItem-title'>
    <a href={props.html_url} target='_blank'>{props.name}</a>
  </h3>
  <p>{props.description || <span className='NoDescription'>No Description</span>}</p>
  <div className='RepositoryItem-stats'>
    <div className='RepositoryItem-stat stars'>
      <i className="fa fa-star" aria-hidden="true"></i>
      <span>{props.stargazers_count}</span>
    </div>
    <div className='RepositoryItem-stat forks'>
      <i className="fa fa-code-fork" aria-hidden="true"></i>
      <span>{props.forks_count}</span>
    </div>
    <div className='RepositoryItem-stat watchers'>
      <i className="fa fa-eye" aria-hidden="true"></i>
      <span>{props.watchers_count}</span>
    </div>
    <div className='RepositoryItem-stat size'>
      <i className="fa fa-code" aria-hidden="true"></i>
      <span>{props.size.toLocaleString()}kb</span>
    </div>
    <div className='RepositoryItem-stat created'>
      <i className="fa fa-clock-o" aria-hidden="true"></i>
      <span>{moment(props.created_at).format('YYYY')}</span>
    </div>
  </div>
</div>

/**
 * This is for prop type validation
 */
RepositoryItem.propTypes = {
  name: PropTypes.string.isRequired
}

export default RepositoryItem

