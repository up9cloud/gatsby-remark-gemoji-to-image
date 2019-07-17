const { name } = require('../package.json')
const debug = require('debug')(name)
const visit = require('unist-util-visit')
const escape = require('escape-string-regexp')

const gemojiAliases = require('./gemoji-aliases.js')

function transformer (ast, { regex, base, ext, height }) {
  function visitor (node, index, parent) {
    let definitions = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(node.value)) !== null) {
      const emojiStr = match[0]
      debug(`found a emoji "%s" from text "%s"`, emojiStr, node.value)

      if (match.index !== lastIndex) {
        const textAst = extractText(node, lastIndex, match.index)
        debug(`extract text "%s"`, textAst.value)
        definitions.push(textAst)
      }
      lastIndex = match.index + emojiStr.length

      const emojiAst = extractEmoji(node, match.index, lastIndex, { base, ext, height })
      debug(`extract emoji "%s" and convert it to %o`, emojiStr, emojiAst)
      definitions.push(emojiAst)

      debug('move check start index to %d', lastIndex)
    }

    if (lastIndex !== node.value.length) {
      const textAst = extractText(node, lastIndex, node.value.length)
      debug(`extract text "%s"`, textAst.value)
      definitions.push(textAst)
    }

    parent.children = [
      ...parent.children.slice(0, index),
      ...definitions,
      ...parent.children.slice(index + 1)
    ]
  }

  visit(ast, 'text', visitor)
}

function extractEmoji (node, start, end, { height, base, ext }) {
  let tNode = extractText(node, start, end)
  let emojiStr = tNode.value
  delete tNode.value
  const name = emojiStr.substr(1, emojiStr.length - 2)
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
    },
    position: tNode.position
  }
}
function extractText ({ value, position }, start, end) {
  let startLine = position.start.line
  let endLine = position.start.line
  let startColumn = position.start.column + start
  let endColumn = position.start.column + end
  let prev = 0
  for (const [i, m] of [...value.matchAll('\n')].entries()) {
    if (start <= m.index) {
      startLine = position.start.line + i
      if (i > 0) {
        startColumn = start - prev + 1
      }
    }
    if (end <= m.index) {
      endLine = position.start.line + i
      if (i > 0) {
        endColumn = end - prev + 1
      }
    }
    prev = m.index
  }
  return {
    type: 'text',
    value: value.slice(start, end),
    // TODO: it should be Position instance?
    position: {
      start: {
        line: startLine,
        column: startColumn,
        offset: position.start.offset + start
      },
      end: {
        line: endLine,
        column: endColumn,
        offset: position.start.offset + end
      },
      // TODO: handle indent
      // @see https://github.com/remarkjs/remark/blob/475c72b823ed1b2b3e0a2d12b2829e4b4c421ee8/packages/remark-parse/lib/tokenizer.js#L169
      indent: []
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
  debug(`original ast: %O`, markdownAST)
  transformer(markdownAST, { regex, base, ext, height })
  debug(`transformed ast: %O`, markdownAST)
  return markdownAST
}
