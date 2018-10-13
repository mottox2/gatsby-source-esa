import Frisbee from 'frisbee'
import crypto from 'crypto'

exports.sourceNodes = async ({
  boundActionCreators,
  createNodeId
}, {
  accessToken,
  teamName,
  q = ''
}) => {
  const createNodeFromPost = post => {
    const contentDigest = crypto
      .createHash(`md5`)
      .update(JSON.stringify(post))
      .digest('hex')
    const baseNode = {
      id: createNodeId(post.number),
      children: [],
      parent: `__SOURCE__`,
      internal: {
        type: 'EsaPost',
        contentDigest,
      }
    }

    boundActionCreators.createNode(Object.assign({}, baseNode, post))
  }

  if (!accessToken) {
    throw 'You need to set an accessToken.'
  }

  if (!teamName) {
    throw 'You need to set an teamName.'
  }

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

    body.posts.forEach(post => createNodeFromPost(post))
    next_page = body.next_page
  }

  return
}