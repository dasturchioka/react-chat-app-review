require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')

const PORT = process.env.PORT || 3000

const io = new Server(server, {
	cors: {
		origin: '*',
	},
})

// Store connected users
const users = new Map()

io.on('connection', async socket => {
	console.log('User connected:', socket.id)

	// Handle user join
	socket.on('user:join', ({ username }) => {
		if (Array.from(users.values()).includes(username)) {
			socket.emit('error', 'Username already exists')
			return
		} else {
			users.set(socket.id, username)
			socket.emit('user:joined-self', { username })
			io.emit('user:list', Array.from(users.values()))
			socket.broadcast.emit('user:joined', { username })
		}
		console.log(Array.from(users.values()))
	})

	// Handle chat message
	socket.on('chat:message', message => {
		io.emit('chat:message', {
			content: message.content,
			username: message.username,
			timestamp: new Date().toISOString(),
		})
	})

	// Handle typing status
	socket.on('user:typing', username => {
		socket.broadcast.emit('user:typing', username)
	})

	// Handle user disconnect
	socket.on('disconnect', () => {
		const username = users.get(socket.id)
		if (username) {
			users.delete(socket.id)
			io.emit('user:list', Array.from(users.values()))
			socket.broadcast.emit('user:left', username)
		}
		console.log('User disconnected:', socket.id)
		console.log(users)
	})
})

server.listen(PORT, () => console.log(`listening on *:${PORT}`))
