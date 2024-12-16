import { useEffect } from 'react'
import { useSocket } from '../store/useSocketStore'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { toast } from 'sonner'

export default function GlobalChatPage() {
	const joinChat = useSocket(state => state.joinChat)
	const socket = useSocket(state => state.socket)
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		if (!location.state || !location.state.isRedirected) {
			joinChat(Cookies.get('username') as string)
		}
	}, [])

	useEffect(() => {
		window.addEventListener('beforeunload', () => {
			window.history.replaceState({}, '')
		})
		return () => {
			window.removeEventListener('beforeunload', () => {
				window.history.replaceState({}, '')
			})
		}
	}, [])

	return <div></div>
}
