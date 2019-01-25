import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'

const Lang = defineMessages({
  hello: 'other hello',
  world: 'other world',
  title: 'title message',
})

export default class Other extends React.Component {
  render() {
    return (
        <div>
          <FormattedMessage {...Lang.hello} />
          <br />
          <FormattedMessage {...Lang.world} />
        </div>
    )
  }
}