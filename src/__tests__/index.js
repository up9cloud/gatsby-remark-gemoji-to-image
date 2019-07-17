const Remark = require('remark')
const plugin = require('../index.js')
// const plugin = require(path.join(__dirname, '..', '..', 'dist', 'index.js'))

// function oLog (o) {
//   return util.inspect(o, {
//     depth: Infinity,
//     breakLength: Infinity
//   })
// }

describe(`gatsby-remark-gemoji-to-image`, () => {
  let remark
  const defaultOptions = {
    class: ['emoji'],
    style: {
      height: '1.2em',
      display: 'inline',
      position: 'relative',
      top: '0.15em',
      margin: 0
    }
  }

  beforeEach(() => {
    remark = new Remark().data(`settings`, {
      commonmark: true,
      footnotes: true,
      pedantic: true
    })
  })

  it(`should not modify 'foo'`, async () => {
    const markdownAST = remark.parse(`foo`)
    const ref = markdownAST.children[0].children
    plugin({ markdownAST })
    expect(markdownAST.children[0].children).toEqual(ref)
  })
  it(`parse ':octocat:'`, async () => {
    const markdownAST = remark.parse(`:octocat:`)
    plugin({ markdownAST })

    expect(markdownAST.children[0].children).toEqual([
      {
        'type': 'image',
        'title': ':octocat:',
        'url': 'https://github.githubassets.com/images/icons/emoji/octocat.png',
        'alt': ':octocat:',
        'data': {
          'hName': 'img',
          'hProperties': {
            'className': defaultOptions.class,
            'style': defaultOptions.style },
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
      }
    ])
  })
  it(`parse ':octocat: foo :joy: bar\n :sob: baz'`, async () => {
    const markdownAST = remark.parse(`:octocat: foo :joy: bar\n :sob: baz`)
    plugin({ markdownAST })

    expect(markdownAST.children[0].children).toEqual([
      {
        'type': 'image',
        'title': ':octocat:',
        'url': 'https://github.githubassets.com/images/icons/emoji/octocat.png',
        'alt': ':octocat:',
        'data': {
          'hName': 'img',
          'hProperties': {
            'className': defaultOptions.class,
            'style': defaultOptions.style },
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
      },
      {
        'type': 'text',
        'value': ' foo ',
        'position': {
          'start': {
            'line': 1,
            'column': 10,
            'offset': 9
          },
          'end': {
            'line': 1,
            'column': 15,
            'offset': 14
          },
          'indent': []
        }
      },
      {
        'type': 'image',
        'title': ':joy:',
        'url': 'https://github.githubassets.com/images/icons/emoji/joy.png',
        'alt': ':joy:',
        'data': {
          'hName': 'img',
          'hProperties': {
            'className': defaultOptions.class,
            'style': defaultOptions.style },
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
      },
      {
        'type': 'text',
        'value': ' bar\n ',
        'position': {
          'start': {
            'line': 1,
            'column': 20,
            'offset': 19
          },
          'end': {
            'line': 2,
            'column': 2,
            'offset': 25
          },
          'indent': []
        }
      },
      {
        'type': 'image',
        'title': ':sob:',
        'url': 'https://github.githubassets.com/images/icons/emoji/sob.png',
        'alt': ':sob:',
        'data': {
          'hName': 'img',
          'hProperties': {
            'className': defaultOptions.class,
            'style': defaultOptions.style },
          'hChildren': []
        },
        'position': {
          'start': {
            'line': 2,
            'column': 2,
            'offset': 25
          },
          'end': {
            'line': 2,
            'column': 7,
            'offset': 30
          },
          'indent': []
        }
      },
      {
        'type': 'text',
        'value': ' baz',
        'position': {
          'start': {
            'line': 2,
            'column': 7,
            'offset': 30
          },
          'end': {
            'line': 2,
            'column': 11,
            'offset': 34
          },
          'indent': []
        }
      }
    ])
  })
  it(`should overwrite options'`, async () => {
    const markdownAST = remark.parse(`:octocat:`)
    const options = {
      class: ['gemoji'],
      style: {},
      align: 'middle'
    }
    plugin({ markdownAST }, options)

    expect(markdownAST.children[0].children).toEqual([
      {
        'type': 'image',
        'title': ':octocat:',
        'url': 'https://github.githubassets.com/images/icons/emoji/octocat.png',
        'alt': ':octocat:',
        'data': {
          'hName': 'img',
          'hProperties': {
            'className': options.class,
            'style': options.style,
            'align': 'middle' },
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
      }
    ])
  })
  it(`compatible options.height'`, async () => {
    const markdownAST = remark.parse(`:octocat:`)
    const options = {
      height: '100px'
    }
    plugin({ markdownAST }, options)

    expect(markdownAST.children[0].children).toEqual([
      {
        'type': 'image',
        'title': ':octocat:',
        'url': 'https://github.githubassets.com/images/icons/emoji/octocat.png',
        'alt': ':octocat:',
        'data': {
          'hName': 'img',
          'hProperties': {
            'className': defaultOptions.class,
            'style': {
              ...defaultOptions.style,
              height: options.height
            }
          },
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
      }
    ])
  })
})
