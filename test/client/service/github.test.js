/* global describe */
/* global it */

import sinon from 'sinon'
import chai from 'chai'

import 'babel-polyfill' // For testing any es6 functions

const expect = chai.expect

import { getNextPageUrl, getRequestInfo } from '../../../client/service/github.js'

describe('github', () => {
  describe('getNextPageUrl', () => {
    it('should extract next page from the link header field of a response', () => {
      let fakeResponse = {
        headers: {
          link: '<https://api.github.com/user/repos?page=3&per_page=100>; rel="next", <https://api.github.com/user/repos?page=50&per_page=100>; rel="last"'
        }
      }

      let nextPageUrl = getNextPageUrl(fakeResponse)

      expect(nextPageUrl).to.equal('https://api.github.com/user/repos?page=3&per_page=100')
    })

    it('should return null when no next link is present in header', () => {
      let fakeResponse = {
        headers: {
          link: '<https://api.github.com/user/repos?page=50&per_page=100>; rel="last"'
        }
      }

      let nextPageUrl = getNextPageUrl(fakeResponse)

      expect(nextPageUrl).to.equal(null)
    })

    it('should return null when no headers present', () => {
      let fakeResponse = {}

      let nextPageUrl = getNextPageUrl(fakeResponse)

      expect(nextPageUrl).to.equal(null)
    })

    it('should return null when no link header present', () => {
      let fakeResponse = {
        headers: {
          foo: 1
        }
      }

      let nextPageUrl = getNextPageUrl(fakeResponse)

      expect(nextPageUrl).to.equal(null)
    })
  })

  describe('getRequestInfo', () => {
    it('should extract request limit, request left, request left until but no error from header on 200 response', () => {
      let fakeResponse = {
        headers: {
          'x-ratelimit-limit': '600',
          'x-ratelimit-remaining': '340',
          'x-ratelimit-reset': '1470002162'
        },
        statusCode: 200
      }

      let requestInfo = getRequestInfo(fakeResponse)

      expect(requestInfo.error).to.equal(null)
      expect(requestInfo.requestsLimit).to.equal(600)
      expect(requestInfo.requestsLeft).to.equal(340)
      expect(requestInfo.requestsLeftUntil.utc().format('HH:mm:ss')).to.equal('21:56:02')
    })

    it('should extract request limit, request left, request left until and error from header on 403 response', () => {
      let fakeResponse = {
        headers: {
          'x-ratelimit-limit': '600',
          'x-ratelimit-remaining': '339',
          'x-ratelimit-reset': '1470002164'
        },
        statusCode: 403
      }

      let requestInfo = getRequestInfo(fakeResponse)

      expect(requestInfo.error).to.equal('We could not complete this request, it seems you have hit your rate limit!')
      expect(requestInfo.requestsLimit).to.equal(600)
      expect(requestInfo.requestsLeft).to.equal(339)
      expect(requestInfo.requestsLeftUntil.utc().format('HH:mm:ss')).to.equal('21:56:04')
    })

    it('should extract request limit, request left, request left until and error from header on 404 response', () => {
      let fakeResponse = {
        headers: {
          'x-ratelimit-limit': '600',
          'x-ratelimit-remaining': '338',
          'x-ratelimit-reset': '1470002169'
        },
        statusCode: 404
      }

      let requestInfo = getRequestInfo(fakeResponse)

      expect(requestInfo.error).to.equal('We could not find any repositories for this organisation!')
      expect(requestInfo.requestsLimit).to.equal(600)
      expect(requestInfo.requestsLeft).to.equal(338)
      expect(requestInfo.requestsLeftUntil.utc().format('HH:mm:ss')).to.equal('21:56:09')
    })

    it('should extract request limit, request left, request left until and error from header on 400 response', () => {
      let fakeResponse = {
        headers: {
          'x-ratelimit-limit': '600',
          'x-ratelimit-remaining': '337',
          'x-ratelimit-reset': '1470002174'
        },
        statusCode: 400
      }

      let requestInfo = getRequestInfo(fakeResponse)

      expect(requestInfo.error).to.equal('We could not complete this request!')
      expect(requestInfo.requestsLimit).to.equal(600)
      expect(requestInfo.requestsLeft).to.equal(337)
      expect(requestInfo.requestsLeftUntil.utc().format('HH:mm:ss')).to.equal('21:56:14')
    })
  })
})