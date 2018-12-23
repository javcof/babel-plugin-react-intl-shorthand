function getProperties(path) {
  if (path.isObjectExpression) {
    return path.get('properties')
  }
  return null
}

export default function(babel) {
  const { types: t } = babel
  return {
    visitor: {
      CallExpression(path, state) {
        
        const callee = path.node.callee;
        if (callee.name !== "defineMessages") {
          return
        }
        
		    const props = getProperties(path.get('arguments.0'))
        for (const prop of props) {
          const propValue = prop.get('value')
          if (t.isStringLiteral(propValue)) {
            propValue.node.value = 'test'
          } else if (t.isObjectExpression(propValue)) {                                     
            const objProps = propValue.get('properties')
            objProps.forEach((item) => {
              item.get('value').node.value = 'test'
            })
          } else {
            // others
          }
        }

      }
    }
  }
}