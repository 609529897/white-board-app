// HTTP
const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')

const server = http.createServer(handleRequest)

const port = process.env.PORT || 8007
server.listen(8007, () => console.log(`server running port ${port}...`))

function handleRequest(req, res) {
    let pathname = req.url
    if (pathname === '/') {
        pathname = '/index.html'
    }

    // handle content type
    let ext = path.extname(pathname)
    let typrExt = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
    }
    let contentType = typrExt[ext] || "text/plain"

    //Read files
    fs.readFile(__dirname + pathname, (err, data) => {
        if (err) {
            res.writeHead(500)
            return res.end('Error loading' + pathname)
        }
        // Set header and response data
        res.writeHead(200, { "Content-Type": contentType })
        res.end(data)
    })
}

// WebSocket
const io = require('socket.io').listen(server)

io.sockets.on('connection', socket => {
    console.log("We have a new client:" + socket.id)
    // When user emits
    socket.on('mouse', data => {
        // Send it to other clients
        socket.broadcast.emit("drawing", data)
    })
    socket.on('disconnect', () => {
        console.log( socket.id + `:disconnect`)
    })
})