import path from 'path'
import { transform } from 'babel-core'
import plugin from '../src'

const filename = path.resolve(__dirname, 'index.js')

it('works', () => {
  const example = `
    import { defineMessages } from 'react-intl'

    defineMessages({
        hello: {
          id: 'hello',
          defaultMessage: 'hello world',
        },
    })
  `
  const options = {
    plugins: [plugin],
    filename,
  }

  const { code } = transform(example, options);
  expect(code).toMatchSnapshot();
})
