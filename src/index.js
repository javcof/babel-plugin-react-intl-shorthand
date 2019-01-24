import * as p from 'path'

const FUNCTION_NAMES = [
  'defineMessages',
]

const DESCRIPTOR_PROPS = new Set(['id', 'description', 'defaultMessage'])
const REG_SEP = new RegExp(`\\${p.sep}`, 'g')

export default function ({ types: t }) {
  function getModuleSourceName(opts) {
    return opts.moduleSourceName || 'react-intl'
  }

  // function evaluatePath(path) {
  //   const evaluated = path.evaluate();
  //   if (evaluated.confident) {
  //     return evaluated.value
  //   }

  //   throw path.buildCodeFrameError(
  //     '[React Intl] Messages must be statically evaluate-able for extraction.'
  //   )
  // }

  function referencesImport(path, mod, importedNames) {
    if (!(path.isIdentifier() || path.isJSXIdentifier())) {
      return false
    }

    return importedNames.some(name => path.referencesImport(mod, name));
  }

  function getMessageDescriptorKey(path) {
    if (path.isIdentifier() || path.isJSXIdentifier()) {
      return path.node.name
    }

    return ''
  }

  function getMessageDescriptorValue(path) {
    const descriptorValue = path.node.value;
    if (typeof descriptorValue === 'string') {
      return descriptorValue.trim();
    }

    return descriptorValue;
  }

  function createMessageDescriptor(propPaths) {
    return propPaths.reduce((hash, [keyPath, valuePath]) => {
      const key = getMessageDescriptorKey(keyPath)

      if (DESCRIPTOR_PROPS.has(key)) {
        hash[key] = valuePath
      }

      return hash
    }, {})
  }

  function evaluateMessageDescriptor(descriptor) {
    Object.keys(descriptor).forEach((key) => {
      const valuePath = descriptor[key]

      descriptor[key] = getMessageDescriptorValue(valuePath)
    })

    return descriptor
  }

  return {
    visitor: {
      CallExpression(path, state) {
        const moduleSourceName = getModuleSourceName(state.opts)
        const callee = path.get('callee')

        function generateMessageDescriptorKey(message) {
          const {
            file: {
              opts: { filename },
            }
          } = state
          const file = p.relative(process.cwd(), filename)
          const formatted = file.replace(/\..+$/, '').replace(REG_SEP, '.')
          const parent = message.find(item => item.isProperty())
          const keyPath = parent.get('key')

          return `${formatted}.${keyPath.node.name}`
        }

        function assertObjectExpression(node) {
          if (!(node && node.isObjectExpression())) {
            throw path.buildCodeFrameError(
              `[React Intl] \`${callee.node.name}()\` must be ` +
              'called with an object expression with values ' +
              'that are React Intl Message Descriptors, also ' +
              'defined as object expressions.'
            )
          }
        }

        function processLiteral(message) {
          message.replaceWith(t.objectExpression([
            t.objectProperty(
              t.stringLiteral('id'),
              t.stringLiteral(generateMessageDescriptorKey(message))
            ),
            t.objectProperty(
              t.stringLiteral('defaultMessage'),
              t.stringLiteral(message.node.value)
            )
          ]))
        }

        function processMessageObject(messageObj) {
          assertObjectExpression(messageObj)


          const properties = messageObj.get('properties')

          let descriptor = createMessageDescriptor(
            properties.map(prop => [
              prop.get('key'),
              prop.get('value'),
            ])
          )
          descriptor = evaluateMessageDescriptor(descriptor);

          messageObj.replaceWith(t.objectExpression([
            t.objectProperty(
              t.stringLiteral('id'),
              t.stringLiteral(descriptor.id)
            ),
            t.objectProperty(
              t.stringLiteral('defaultMessage'),
              t.stringLiteral(descriptor.defaultMessage)
            )
          ]))
        }

        if (referencesImport(callee, moduleSourceName, FUNCTION_NAMES)) {
          const messagesObj = path.get('arguments')[0]

          assertObjectExpression(messagesObj);

          messagesObj.get('properties')
            .map(prop => prop.get('value'))
            .forEach((item) => {
              if (item.isLiteral()) {
                processLiteral(item)
              } else {
                processMessageObject(item)
              }
            })
        }
      }
    }
  }
}
