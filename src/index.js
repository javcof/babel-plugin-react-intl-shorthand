export default function (babel) {
  const { types: t } = babel

  function getProperties(path) {
    if (path.isObjectExpression) {
      return path.get('properties')
    }
    return null
  }

  function objectProperty(key, value) {
    return t.objectProperty(t.stringLiteral(key), t.stringLiteral(value))
  }

  return {
    visitor: {

      CallExpression(path) {
        const callee = path.node.callee
        if (callee.name !== 'defineMessages') {
          return
        }

        const props = getProperties(path.get('arguments.0'))
        for (const prop of props) {
          const propValue = prop.get('value')
          const messageDescriptors = []

          if (propValue.isObjectExpression()) {
            const objProps = propValue.get('properties')
            objProps.forEach(item => messageDescriptors.push(item.node))
          } else if (propValue.isStringLiteral()) {
            messageDescriptors.push(
              objectProperty('id', '1001'),
              objectProperty('defaultMessage', 'hello world')
            )
          }
          propValue.replaceWith(t.objectExpression(messageDescriptors))
        }
      }
    }
  }
}
