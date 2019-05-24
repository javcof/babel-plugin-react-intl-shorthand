import path from 'path'
import { transform } from '@babel/core'
import plugin from '../src'

const filename = path.resolve(__dirname, 'index.js')

it('works', () => {
  const example = `
    import { defineMessages } from 'react-intl'

    defineMessages({
        test: 'test message',
        hello: {
          id: 'hello',
          defaultMessage: 'hello world',
        },
        title: {
          defaultMessage: 'title message',
        },
    })
  `
  const options = {
    plugins: [
      [
        plugin,
        {
          useHash: true,
        }
      ]
    ],
    filename,
  }

  const { code } = transform(example, options);
  expect(code).toMatchSnapshot();
})
