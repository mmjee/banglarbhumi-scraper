const { getPlotInfo } = require('bbs/getPlotInfo')

module.exports = async (fastify) => {
  // Declare a route
  fastify.route({
    method: 'POST',
    url: '/api/v1/get-plot-info',
    schema: {
      body: {
        type: 'object',
        properties: {
          district: { type: 'string' },
          block: { type: 'string' },
          mouza: { type: 'string' },

          part1: { type: 'string' },
          part2: { type: 'string' }
        },
        required: ['district', 'block', 'mouza', 'part1']
      }
    },
    handler: getPlotInfo
  })
}
