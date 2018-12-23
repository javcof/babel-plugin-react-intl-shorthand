import { transform } from '@babel/core';

const code = `
import { defineMessages } from 'react-intl'

defineMessages({
    test: 'test message',
})
`

const options = {
  plugins: [
    './src'
  ]
}

transform(code, options, (err, result) => {
  console.log(result.code)
})