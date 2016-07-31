/* global describe */
/* global it */

import sinon from 'sinon'
import chai from 'chai'
import React from 'react'
import { shallow } from 'enzyme'

import 'babel-polyfill' // For testing any es6 functions

const expect = chai.expect

import RepositoryItem from '../../../client/components/RepositoryItem'

describe('RepositoryItem', () => {
  it('should be exposed as a module and be of type function', () => {
    expect(RepositoryItem).to.be.a('function')
  })

  describe('render', () => {
    var sampleRepo = {
      name: 'Sample',
      html_url: 'https://www.github.com/sample/sample',
      stargazers_count: 50,
      watchers_count: 50,
      forks_count: 20,
      size: 15000,
      created_at: '2016-07-16T20:29:24Z'
    }

    it('should render an item with a name and link', () => {
      var elem = shallow(<RepositoryItem {...sampleRepo} />)

      expect(elem).to.be.ok

      let title = elem.find('.RepositoryItem-title')

      expect(title).to.have.length(1)
      expect(title.text()).to.equal('Sample')

      expect(elem.find('.RepositoryItem-stats')).to.have.length(1)
      expect(elem.find('.RepositoryItem-stat')).to.have.length(5)

      let stars = elem.find('.stars')
      let forks = elem.find('.forks')
      let watchers = elem.find('.watchers')
      let size = elem.find('.size')
      let created = elem.find('.created')

      expect(stars.text()).to.equal('50')
      expect(watchers.text()).to.equal('50')
      expect(forks.text()).to.equal('20')
      expect(size.text()).to.equal('15000kb')
      expect(created.text()).to.equal('2016')
    })
  })
})