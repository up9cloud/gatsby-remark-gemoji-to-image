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
              base: 'https://github.githubassets.com/images/icons/emoji/',
              ext: '.png',
              height: '1.2em'
            }
          }
        ]
      }
    }
  ]
}
```

## How?

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
      align: 'absmiddle',
      alt: ':octocat:',
      className: ['emoji'],
      style: `height: 1.2em`
    },
  }
}
```
