module.exports = logger = (options) => {
  return logger = (req, res, next) => {
    const start = new Date()
    const startTime = process.hrtime();
    res.on('finish', () => {
      const elapsedTime = process.hrtime(startTime)
      const elapsedTimeInMs = elapsedTime[0] * 1000 + elapsedTime[1] / 1e6
      const totalTime = Math.round(elapsedTimeInMs)
      console.log(start.toLocaleString(), '|', req.method, 'from', req.url, '| Total time: ', totalTime + 'ms')
    })
    next()
  }
}
