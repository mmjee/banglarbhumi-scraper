const fastify = require('fastify')({ logger: true })
const initialize = require('bbs/app')

async function start () {
  await initialize(fastify)
  await fastify.listen(3000)
}

start().catch(e => console.error(e))
