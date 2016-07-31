import Promise from 'bluebird'
import superagent from 'superagent'
import moment from 'moment'

const get = Promise.promisify(superagent.get)

const GITHUB_URL = 'https://api.github.com'

/**
 * Given how pagination works with the Github api we need to make sure we
 * get all the repos for each company by checking to see if there are any
 * more pages of repos to get from the API
 * 
 * @param  {Object} headers
 * 
 * @return {String|null}
 */
export const getNextPageUrl = response => {
  if (!response.headers || !response.headers.link) {
    return null
  }

  const linkParts = response.headers.link.split(',')
  const nextPart = linkParts.find(part => part.indexOf('rel="next"') > -1)

  if (!nextPart) {
    return null
  }

  // Regex for extracting url between <> brackets as explained here
  // https://developer.github.com/v3/#pagination
  const regExp = /<([^>]+)>/ 
  const matches = regExp.exec(nextPart)

  if (matches.length === 0) {
    return null
  } 

  return matches[1] // Get text contained within brackets
}

/**
 * Given a response from Github extrat the information
 * about rate limiting according to https://developer.github.com/v3/#rate-limiting
 *
 * @param {Object} response
 */
export const getRequestInfo = response => {
  let error = null 
  let requestsLimit = null
  let requestsLeft = null
  let requestsLeftUntil = null

  if (response.statusCode === 403) {
    error = 'We could not complete this request, it seems you have hit your rate limit!'
  } else if (response.statusCode === 404) {
    error = 'We could not find any repositories for this organisation!'
  } else if (response.statusCode >= 400) {
    error = 'We could not complete this request!'
  }

  if (response.headers) {
    requestsLimit = parseInt(response.headers['x-ratelimit-limit'], 10)
    requestsLeft = parseInt(response.headers['x-ratelimit-remaining'], 10)
    requestsLeftUntil = moment.unix(response.headers['x-ratelimit-reset'])
  }

  return {
    error,
    requestsLimit,
    requestsLeft,
    requestsLeftUntil
  }
}

/**
 * Get all of the organisations repos
 * 
 * @param  {String} organisation 
 * 
 * @return {Array}
 */
export const getOrgRepos = organisation => {
  let repositories = []
  let requestInfo = null
  let callCount = 0

  const url = `${GITHUB_URL}/orgs/${organisation}/repos?per_page=100`

  const retrieve = (url) => {
    return get(url)
    .then(response => {
      let nextPageUrl = getNextPageUrl(response)

      console.log(` | Next page url is ${nextPageUrl}`)

      requestInfo = getRequestInfo(response)
      repositories = repositories.concat(response.body)

      if (callCount > 3 ) {
        return 
      }

      if (nextPageUrl) {
        callCount++
        return retrieve(nextPageUrl)
      }
    })
    .catch(e => {
      requestInfo = getRequestInfo(e.response)
    })
  }

  return retrieve(url).then(() => ({
    requestInfo,
    repositories
  }))
  .catch(() => {
    requestInfo,
    repositories
  })
}



