import { useDemoLinks, useQueryState } from 'components/hook'
import React, { useState, useRef } from 'react'
import { Layout } from 'components/patterns'
import { Location } from '@reach/router'
import mql from '@microlink/mql'

import Examples from 'components/pages/embed/examples'
import Template from 'components/pages/embed/template'

export default () => {
  const [status, setStatus] = useState('initial')
  const inputEl = useRef(null)
  const demoLinks = useDemoLinks()
  const [data, setData] = useState(null)
  const [query, setQuery] = useQueryState()

  const fetchData = async url => {
    try {
      setStatus('fetching')
      const { data } = await mql(url)
      setData(data)
      setQuery({ url })
      setStatus('fetched')
    } catch (err) {
      setStatus('error')
      console.error(err)
    }
  }

  const onSubmit = event => {
    event.preventDefault()
    fetchData(inputEl.current.value)
  }

  const focusInput = () => {
    if (inputEl.current) {
      inputEl.current.value = ''
      inputEl.current.focus()
    }
  }

  return (
    <Layout image='https://cdn.microlink.io/page/embed.png'>
      <Location>
        {({ location }) => {
          const hasQuery = location.search !== ''
          if (hasQuery) return <Template data={data} />
          focusInput()
          return (
            <Examples
              demoLinks={demoLinks}
              onSubmit={onSubmit}
              url={query.url}
              innerRef={inputEl}
              isLoading={status === 'fetching'}
            />
          )
        }}
      </Location>
    </Layout>
  )
}
