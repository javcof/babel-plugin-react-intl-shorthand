# babel-plugin-react-intl-shorthand

Make u write react-intl message descriptor more easy.

## Dependencies

## Installation

```sh
$ npm install babel-plugin-react-intl-shorthand
```

## Usage
**This Babel plugin only visits ES6 modules which `import` React Intl.**

### Via `.babelrc` (Recommanded)

**.babelrc**

```json
{
  "plugins": [
    ["react-intl-shorthand"],
    ["react-intl", {
        "messagesDir": "./build/messages/"
    }]
  ]
}
```

### Via Dva 2.0 .webpackrc

**.webpackrc**

```json
{
  "extraBabelPlugins": [
    ["react-intl-shorthand"],
    ["react-intl", {
      "messagesDir": "./build/messages/"
    }]
  ]
}
```

### Options
- **`moduleSourceName`**: The ES6 module source name of the React Intl package. Defaults to: `"react-intl"`, but can be changed to another name/path to React Intl.


