import Frisbee from 'frisbee'
import crypto from 'crypto'

const createContentDigest = obj =>
  crypto
    .createHash(`md5`)
    .update(JSON.stringify(obj))
    .digest(`hex`)

exports.sourceNodes = async ({
  boundActionCreators,
  createNodeId
}, {
  accessToken,
  teamName,
  baseCategory = '',
  q = ''
}) => {
  if (!accessToken) {
    throw 'You need to set an accessToken.'
  }

  if (!teamName) {
    throw 'You need to set an teamName.'
  }

  const { createNode } = boundActionCreators

  const api = new Frisbee({
    baseURI: 'https://api.esa.io'
  })

  let next_page = 1
  while (next_page) {
    const {
      body
    } = await api.jwt(accessToken).get(`/v1/teams/${teamName}/posts`, {
      body: {
        q,
        page: next_page
      }
    })

    body.posts.forEach(post => {
      const contentDigest = createContentDigest(post)

      const nodeId = createNodeId(`EsaPost${post.number}`)

      const bodyNode = {
        id: createNodeId(`EsaPost${post.number}Body`),
        parent: nodeId,
        children: [],
        internal: {
          type: 'EsaPostBody',
          mediaType: 'text/markdown',
          content: post.body_md,
          contentDigest: createContentDigest(post.body_md),
        },
      }

      createNode({
        ...post,
        body___NODE: bodyNode.id,
        relative_category: post.category.replace(new RegExp(`${baseCategory}/?`), ''),
        id: nodeId,
        children: [],
        parent: null,
        internal: {
          type: 'EsaPost',
          contentDigest,
        }
      })
      createNode(bodyNode)
    })

    next_page = body.next_page
  }

  return
}