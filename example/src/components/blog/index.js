import React from 'react'
import { FormattedMessage } from 'react-intl'
import Lang from './Lang'

export default class Blog extends React.Component {


  render() {
    return (
      <div>
        Blog<br/>
        <FormattedMessage {...Lang.hello} />
        <FormattedMessage {...Lang.world} />
      </div>
    )
  }
}