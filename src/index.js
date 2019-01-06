import p from 'path'
import * as t from 'babel-types'

const REG = new RegExp(`\\${p.sep}`, 'g')

function getProperties(path) {
  if (path.isObjectExpression) {
    return path.get('properties')
  }
  return null
}

function dotPath(path) {
  return path.replace(REG, '.')
}

function getPrefix(state) {
  const {
    file: {
      opts: { filename },
    }
  } = state
  const file = p.relative(process.cwd(), filename)
  const formatted = dotPath(file.replace(/\..+$/, ''))

  return formatted
}

function objectProperty(key, value) {
  return t.objectProperty(t.stringLiteral(key), t.stringLiteral(value))
}

export default function () {
  return {
    visitor: {
      CallExpression(path, state) {
        const callee = path.node.callee
        if (callee.name !== 'defineMessages') {
          return
        }

        const props = getProperties(path.get('arguments.0'))
        for (const prop of props) {
          const propKey = prop.get('key')
          const propValue = prop.get('value')
          const messageDescriptors = []

          if (propValue.isObjectExpression()) {
            const objProps = propValue.get('properties')
            objProps.forEach(item => messageDescriptors.push(item.node))
          } else if (propValue.isStringLiteral()) {
            messageDescriptors.push(
              objectProperty('id', `${getPrefix(state)}.${propKey.node.name}`),
              objectProperty('defaultMessage', propValue.node.value)
            )
          }
          propValue.replaceWith(t.objectExpression(messageDescriptors))
        }
      }
    }
  };
}
