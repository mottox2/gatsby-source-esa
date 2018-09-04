import Frisbee from 'frisbee'
import crypto from 'crypto'

exports.sourceNodes = async ({ boundActionCreators }, { accessToken, teamName, q = '' }) => {
  const createNodeFromPost = post => {
    const hashId = crypto
      .createHash(`md5`)
      .update(post.number.toString())
      .digest('hex')
    const baseNode = {
      id: hashId,
      children: [],
      parent: `__SOURCE__`,
      internal: {
        type: 'EsaPost',
        contentDigest: hashId
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
    const { body } = await api.jwt(accessToken).get(`/v1/teams/${teamName}/posts`, {
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
