# gatsby-source-esa

Source plugin for pulling data into Gatsby from [esa.io](esa.io) using the [esa.io API](https://docs.esa.io/posts/102).

## Install

`npm intsall --save gatsby-source-esa`

## How to use

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-esa`,
      options: {
        accessToken: `your_personal_access_token`,
        teamName: `your_team_name`,
        targetCategory: ``
      }
    }
  ]
}
```

## How to Query

```graphql
{
  allEsaPost {
    edges {
      node {
        number
        name
        body_md
      }
    }
  }
}
```
