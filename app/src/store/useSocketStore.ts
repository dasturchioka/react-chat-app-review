import { io, Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { create } from 'zustand'

type State = {
	messages: any[]
	socket: Socket | null
	username: string
	usersOnline: string[]
	setSocket: (socket: Socket) => void
	addMessage: (message: { from: string; content: string; timestamp: Date }) => void
	setUsername: (username: string) => void
	joinChat: (username: string) => Promise<void>
	attachListeners: () => void
	initConnection: () => void
}

export const useSocket = create<State>((set, get) => ({
	messages: [],
	socket: null,
	username: '',
	usersOnline: [],
	setSocket: socket => set({ socket }),
	addMessage: message => set(state => ({ messages: [...state.messages, message] })),
	setUsername: username => set({ username }),
	initConnection: async () => {
		const socket = get().socket
		if (socket === null || !socket.connected) {
			const socket = io('http://localhost:3000', { reconnection: true, reconnectionAttempts: 10 })

			socket?.on('connect', () => {
				console.log('Connected to socket server')
			})

			socket?.on('error', error => {
				console.error('Socket error:', error)
				toast.error(error)
			})

			set(state => ({ ...state, socket }))
		}
	},
	joinChat: async (username: string) => {
		const socket = get().socket
		if (socket === null || !socket.connected) {
			const socketNew = io('http://localhost:3000', {
				reconnection: true,
				reconnectionAttempts: 10,
			})
			socketNew.emit('user:join', { username })
			set(state => ({ ...state, socket: socketNew }))
		} else {
			socket.emit('user:join', { username })
		}
	},

	attachListeners: async () => {
		const socket = get().socket

		socket?.on('chat:message', message => {
			set(state => ({ ...state, messages: [...state.messages, message] }))
		})
	},
}))
