const debug = require('debug')('gatsby:gatsby-remark-gemoji-to-image')
const visit = require('unist-util-visit')
const escape = require('escape-string-regexp')
const { cssifyObject } = require('css-in-js-utils')

const gemojiAliases = require('./gemoji-aliases.js')

function transformer (ast, regex, { base, ext, props }) {
  function visitor (node, index, parent) {
    let definitions = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(node.value)) !== null) {
      const emojiStr = match[0]
      debug(`found an emoji alias "%s" from text "%s"`, emojiStr, node.value)

      if (match.index !== lastIndex) {
        const textAst = extractText(node, lastIndex, match.index)
        debug(`extract text "%s" to be %o`, textAst.value, textAst)
        definitions.push(textAst)
      }
      lastIndex = match.index + emojiStr.length

      const emojiAst = extractEmoji(node, match.index, lastIndex, { base, ext, props })
      debug(`extract emoji "%s" to be %o`, emojiStr, emojiAst)
      definitions.push(emojiAst)

      debug('move check start index to %d', lastIndex)
    }

    if (!definitions.length) {
      return
    }

    if (lastIndex !== node.value.length) {
      const textAst = extractText(node, lastIndex, node.value.length)
      debug(`extract text "%s" to be %o`, textAst.value, textAst)
      definitions.push(textAst)
    }

    parent.children = [
      ...parent.children.slice(0, index),
      ...definitions,
      ...parent.children.slice(index + 1)
    ]
  }

  debug(`original ast: %o`, ast)
  visit(ast, 'text', visitor)
  debug(`transformed ast: %o`, ast)
}

function extractEmoji (node, start, end, { base, ext, props }) {
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
        ...props
      },
      hChildren: []
    },
    position: tNode.position
  }
}
function extractText ({ value, position }, start, end) {
  const startMatches = [...value.slice(0, start).matchAll('\n')]
  let startLine = position.start.line + startMatches.length
  let startColumn = startMatches.length
    ? start - startMatches[startMatches.length - 1].index
    : position.start.column + start
  const endMatches = [...value.slice(0, end).matchAll('\n')]
  let endLine = position.start.line + endMatches.length
  let endColumn = endMatches.length
    ? end - endMatches[endMatches.length - 1].index
    : position.start.column + end
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
function createRegex () {
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
    class: className = ['emoji'],
    height = null, // v1.0.x compatible
    style = {
      height: '1.2em', // github default, class "g-emoji"
      display: 'inline',
      position: 'relative',
      top: '0.15em',
      margin: 0
    },
    ...args
  } = {}
) => {
  if (height !== null && style) {
    style.height = height
  }
  transformer(markdownAST, createRegex(), {
    base,
    ext,
    props: {
      className,
      style: cssifyObject(style),
      ...args
    }
  })
  return markdownAST
}
