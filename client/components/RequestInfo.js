import React, { PropTypes } from 'react'

import './RequestInfo.styl'

/**
 * Component for displaying information about request response
 *  e.g. number of requests left allowed and any error that was
 *  experienced
 *  
 * @param  {Object} props
 */
const RequestInfo = (props) => {
  let { requestInfo } = props
  let errorElem = null
  let limitsElem = null

  if (requestInfo 
    && requestInfo.requestsLimit 
    && requestInfo.requestsLeft >= 0
    && requestInfo.requestsLeftUntil
  ) {
    let { requestsLimit, requestsLeft, requestsLeftUntil } = requestInfo

    limitsElem = <span>
      {requestsLeft} / {requestsLimit} requests left until {requestsLeftUntil.format('HH:mm:ss')}
    </span>
  }

  if (requestInfo && requestInfo.error) {
    errorElem = <span className='error'>{requestInfo.error}</span>
  }

  return <div className='RequestInfo-container'>
    {limitsElem}
    {errorElem}
  </div>
}

RequestInfo.propTypes = {
  requestInfo: PropTypes.object
}

export default RequestInfo