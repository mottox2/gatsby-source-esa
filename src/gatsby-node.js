import axios from 'axios'
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

  const client = axios.create({
    baseURL: 'https://api.esa.io/v1',
  })
  client.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
  })

  let next_page = 1
  while (next_page) {
    const { data } = await client.request({
      method: 'get',
      url: `/teams/${teamName}/posts`,
      params: {
        q,
        page: next_page
      }
    })

    data.posts.forEach(post => {
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
        relative_category: (post.category || '').replace(new RegExp(`${baseCategory}/?`), ''),
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

    next_page = data.next_page
  }

  return
}