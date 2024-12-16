import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useSocket } from './store/useSocketStore'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function App() {
	const initConnection = useSocket(state => state.initConnection)
	const socket = useSocket(state => state.socket)
	const navigate = useNavigate()

	useEffect(() => {
		initConnection()

		socket?.on('user:joined-self', async data => {
			console.log(data)
			if (location.pathname !== '/chat') {
				await navigate('/chat', { state: { isRedirected: true } })
			}
			Cookies.set('username', data.username)
			toast.success('You have successfully joined the chat!')
		})
	}, [initConnection])

	return <Outlet />
}
