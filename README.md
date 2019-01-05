# gatsby-source-esa

[![npm version](https://badge.fury.io/js/gatsby-source-esa.svg)](https://badge.fury.io/js/gatsby-source-esa)

Source plugin for pulling data into Gatsby from [esa.io](https://esa.io) using the [esa.io API](https://docs.esa.io/posts/102).

## Install

`npm install --save gatsby-source-esa`

## How to use

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-esa`,
      options: {
        // You can get an access token from https://[YOUR_TEAM_NAME].esa.io/user/applications.
        // You must be owner role.
        accessToken: `YOUR_PERSONAL_ACCESS_TOKEN`,
        teamName: `YOUR_TEAM_NAME`,
        // Search queary (optional)
        // See docs: https://docs.esa.io/posts/104
        // Example : 'in:public'  or 'wip:false in:public'
        q: '',
        // Relative Category (optional)
        // Example: 'public'
        // {
        //   category: 'public/gatsby',
        //   relative_category: 'gatsby',
        // }
        baseCategory: ''
      }
    }
  ]
}
```

## How to query

```graphql
{
  allEsaPost {
    edges {
      node {
        number
        name
        body_md
        body_html
        category
        relative_category
        tags
      }
    }
  }
}
```
