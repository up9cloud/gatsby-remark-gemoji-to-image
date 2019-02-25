const visit = require('unist-util-visit')
const escape = require('escape-string-regexp')

const gemojiAliases = require('./gemoji-aliases.js')

function transformer (ast, { regex, base, ext, height }) {
  function visitor (node, index, parent) {
    let definitions = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(node.value)) !== null) {
      let emoji = match[0]

      if (match.index !== lastIndex) {
        definitions.push(extractText(node.value, lastIndex, match.index))
      }

      definitions.push(makeImageAst(emoji, { base, ext, height }))

      lastIndex = match.index + emoji.length
    }

    if (lastIndex !== node.value.length) {
      definitions.push(extractText(node.value, lastIndex, node.value.length))
    }

    let last = parent.children.slice(index + 1)
    parent.children = parent.children.slice(0, index)
    parent.children = parent.children.concat(definitions)
    parent.children = parent.children.concat(last)
  }

  visit(ast, 'text', visitor)
}

function makeImageAst (emojiStr, { height, base, ext }) {
  let name = emojiStr.substr(1, emojiStr.length - 2)
  return {
    type: 'image',
    title: emojiStr,
    url: base + name + ext,
    alt: emojiStr,
    data: {
      hName: 'img',
      hProperties: {
        align: 'absmiddle',
        className: ['emoji'],
        style: `height: ${height}`
      },
      hChildren: []
    }
  }
}
function extractText (string, start, end) {
  var startLine = string.slice(0, start).split('\n')
  var endLine = string.slice(0, end).split('\n')

  return {
    type: 'text',
    value: string.slice(start, end),
    position: {
      start: {
        line: startLine.length,
        column: startLine[startLine.length - 1].length + 1
      },
      end: {
        line: endLine.length,
        column: endLine[endLine.length - 1].length + 1
      }
    }
  }
}
function create () {
  let names = []

  for (const alias of gemojiAliases) {
    names.push(escape(`:${alias}:`))
  }

  names.sort(function (a, b) {
    return b.length - a.length
  })

  return new RegExp(names.join('|'), 'g')
}

module.exports = (
  { markdownAST },
  {
    base = 'https://github.githubassets.com/images/icons/emoji/',
    ext = '.png',
    height = '1.2em'
  } = {}
) => {
  let regex = create()
  transformer(markdownAST, { regex, base, ext, height })
  return markdownAST
}
