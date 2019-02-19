const express = require('express')
const http = require('http')
const path = require('path')

const ytdl = require('ytdl-core')



const app = express()
const server = http.Server(app)

app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')))
app.use('/client', express.static(path.join(__dirname, '/client')))


app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'client/index.html'))
})

// app.get('*', (request, response) => {
//   console.log(request);
//   response.sendFile(path.join(__dirname, 'client/index.html'))
// })


app.post('/stream/:videoId', (request, response) => {
  const videoId = request.params.videoId

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
  if (!ytdl.validateURL(videoUrl)) {
    response.send({ success: false })
  } else {
    ytdl(videoUrl, { filter: format => format.container === 'mp4' })
      .pipe(response)
  }
})

// app.use((request, response) => {
//   response.redirect('/')
// })



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});