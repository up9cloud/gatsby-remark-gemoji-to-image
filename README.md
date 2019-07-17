# gatsby-remark-gemoji-to-image

[![Build Status](https://travis-ci.org/up9cloud/gatsby-remark-gemoji-to-image.svg?branch=master)](https://travis-ci.org/up9cloud/gatsby-remark-gemoji-to-image)

Convert [Github offcial gemoji](https://github.com/github/gemoji) to image element.

## Installation

```bash
npm i gatsby-remark-gemoji-to-image
```

## Usage

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          'gatsby-remark-gemoji-to-image',
        ]
      }
    }
  ]
}
```

## Options

```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-gemoji-to-image',
            // default options, can be ignored
            options: {
              base = 'https://github.githubassets.com/images/icons/emoji/',
              ext = '.png',
              class: ['emoji'],
              style = {
                height: '1.2em',
                display: 'inline',
                position: 'relative',
                top: '0.15em',
                margin: 0
              }
            }
          }
        ]
      }
    }
  ]
}
```

## How it works?

```md
:octocat:
```

Basically, it convert remark node's ast from

```js
{
  type: 'text',
  value: ':octocat:',
  position: [...]
}
```

to

```js
{
  type: 'image',
  title: ':octocat:',
  url: 'https://github.githubassets.com/images/icons/emoji/octocat.png',
  alt: ':octocat:',
  data: {
    hName: 'img',
    hProperties: {
      className: ['emoji'],
      style: {
        height: '1.2em',
        display: 'inline',
        position: 'relative',
        top: '0.15em',
        margin: 0
      }
    },
  },
  position: [...]
}
```
