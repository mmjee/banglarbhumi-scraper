const Fastify = require('fastify')
const initialize = require('bbs/app')

// require("greenlock-express")
require('@root/greenlock-express')
  .init({
    packageRoot: __dirname,
    configDir: './greenlock.d',
    maintainerEmail: process.env.LE_MAINTAINER_EMAIL,

    cluster: false
  })
  .ready(httpsWorker)

// One of the worst and the unholiest marriages of all time
// This is so bad that I cried for 24 hours straight after I witnessed this crime happen
async function httpsWorker (glx) {
  const fastify = Fastify({
    logger: true,
    serverFactory (handler) {
      const tlsOptions = null
      return glx.http2Server(tlsOptions, handler)
    }
  })

  await initialize(fastify)

  const port = Number(process.env.BBS_HTTP_PORT)
  await fastify.listen(Number.isFinite(port) ? port : 443, '::').catch(e => console.error(e))

  // Listening to 80 to solve HTTP-01 challenges and redirecting clueless people to HTTPS
  const httpServer = glx.httpServer()

  httpServer.listen(80, '::', function () {
    console.info('Listening on ', httpServer.address())
  })
}
