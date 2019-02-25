const Remark = require('remark')
const visit = require(`unist-util-visit`)
const plugin = require('../index')

describe(`gatsby-remark-gemoji-to-image`, () => {
  let remark

  beforeEach(() => {
    remark = new Remark().data(`settings`, {
      commonmark: true,
      footnotes: true,
      pedantic: true
    })
  })

  it(`parse ':octocat:'`, async () => {
    const markdownAST = remark.parse(`:octocat:`)

    const transformed = plugin({ markdownAST })

    visit(transformed, `image`, node => {
      expect(node).toEqual({
        'type': 'image',
        'title': ':octocat:',
        'url': 'https://github.githubassets.com/images/icons/emoji/octocat.png',
        'alt': ':octocat:',
        'data': {
          'hName': 'img',
          'hProperties': {
            'align': 'absmiddle',
            'className': ['emoji'],
            'style': 'height: 1.2em' },
          'hChildren': []
        }
      })
    })
  })
  it(`parse ':octocat: foo :joy: bar'`, async () => {
    const markdownAST = remark.parse(`:octocat: foo :joy: bar`)

    const transformed = plugin({ markdownAST })

    visit(transformed, `text`, (node, index) => {
      switch (index) {
        case 1:
          expect(node.value).toBe(` foo `)
          break
        case 3:
          expect(node.value).toBe(` bar`)
          break
        default:
          throw new Error(`Unexpected index: ${index}`)
      }
    })
    visit(transformed, `image`, (node, index) => {
      switch (index) {
        case 0:
          expect(node).toEqual({
            'type': 'image',
            'title': ':octocat:',
            'url': 'https://github.githubassets.com/images/icons/emoji/octocat.png',
            'alt': ':octocat:',
            'data': {
              'hName': 'img',
              'hProperties': {
                'align': 'absmiddle',
                'className': ['emoji'],
                'style': 'height: 1.2em' },
              'hChildren': []
            }
          })
          break
        case 2:
          expect(node).toEqual({
            'type': 'image',
            'title': ':joy:',
            'url': 'https://github.githubassets.com/images/icons/emoji/joy.png',
            'alt': ':joy:',
            'data': {
              'hName': 'img',
              'hProperties': {
                'align': 'absmiddle',
                'className': ['emoji'],
                'style': 'height: 1.2em' },
              'hChildren': []
            }
          })
          break
        default:
          throw new Error(`Unexpect index: ${index}`)
      }
    })
  })
})
