import { transform } from '@babel/core'
import plugin from '../src'

it('works', () => {

  const example = `
    import { defineMessages } from 'react-intl'

    defineMessages({
        test: 'test message',
        hello: {
          id: 'hello',
          defaultMessage: 'hello world',
        },
    })
  `
  const options = {
    plugins: [plugin],
  }

  const { code } = transform(example, options);
  expect(code).toMatchSnapshot();
})