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
        // You can get an acess token from https://[YOUR_TEAM_NAME].esa.io/user/applications.
        // You must be owner role.
        accessToken: `YOUR_PERSONAL_ACCESS_TOKEN`,
        teamName: `YOUR_TEAM_NAME`,
        // Search queary (optional)
        // See :y https://docs.esa.io/posts/104
        // Example : 'in:public'  or 'wip:false in:public'
        q: ``
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
      }
    }
  }
}
```
