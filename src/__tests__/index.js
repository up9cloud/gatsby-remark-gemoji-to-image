const util = require('util')
const fs = require('fs')
const path = require('path')
const Remark = require('remark')
const visit = require(`unist-util-visit`)
const plugin = require('../index.js')

// function oLog (o) {
//   return util.inspect(o, {
//     depth: Infinity,
//     breakLength: Infinity
//   })
// }

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
        },
        'position': {
          'start': {
            'line': 1,
            'column': 1,
            'offset': 0
          },
          'end': {
            'line': 1,
            'column': 10,
            'offset': 9
          },
          'indent': []
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
            },
            'position': {
              'start': {
                'line': 1,
                'column': 1,
                'offset': 0
              },
              'end': {
                'line': 1,
                'column': 10,
                'offset': 9
              },
              'indent': []
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
            },
            'position': {
              'start': {
                'line': 1,
                'column': 15,
                'offset': 14
              },
              'end': {
                'line': 1,
                'column': 20,
                'offset': 19
              },
              'indent': []
            }
          })
          break
        default:
          throw new Error(`Unexpect index: ${index}`)
      }
    })
  })
  it(`parse README.md`, async () => {
    const readme = fs.readFileSync(path.join(__dirname, '..', '..', 'README.md'), 'utf8')

    const markdownAST = remark.parse(readme)
    // console.log(oLog(markdownAST))

    const transformed = plugin({ markdownAST })
    // console.log(oLog(transformed))

    // visit(transformed, `text`, (node, index) => {
    //   switch (index) {
    //     default:
    //       console.log(index, node)
    //   }
    // })
    visit(transformed, `image`, (node, index) => {
      switch (index) {
        case 1:
          switch (node.title) {
            case ':joy:':
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
                },
                'position': {
                  'start': {
                    'column': 10,
                    'line': 13,
                    'offset': 354
                  },
                  'end': {
                    'column': 15,
                    'line': 13,
                    'offset': 359
                  },
                  'indent': []
                }
              })
              break
            case ':sob:':
              expect(node).toEqual({
                'type': 'image',
                'title': ':sob:',
                'url': 'https://github.githubassets.com/images/icons/emoji/sob.png',
                'alt': ':sob:',
                'data': {
                  'hName': 'img',
                  'hProperties': {
                    'align': 'absmiddle',
                    'className': ['emoji'],
                    'style': 'height: 1.2em' },
                  'hChildren': []
                },
                'position': {
                  'start': {
                    'column': 12,
                    'line': 31,
                    'offset': 594
                  },
                  'end': {
                    'column': 17,
                    'line': 31,
                    'offset': 599
                  },
                  'indent': []
                }
              })
              break
          }
          break
        default:
          // console.log(index, node)
      }
    })
  })
})
