import React, { useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { toast } from 'sonner'
import { useSocket } from '../store/useSocketStore'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function LoginPage() {
	const [username, setUsername] = React.useState('')
	const [error, setError] = React.useState('')

	const navigate = useNavigate()

	const joinChat = useSocket(state => state.joinChat)
	const socket = useSocket(state => state.socket)

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()

		if (!username) {
			setError('Username is required')
			return
		}

		try {
			await joinChat(username.trim())
		} catch (error: any) {
			toast.error(error.message)
			console.error(error)
		}
	}

	useEffect(() => {
		socket?.on('user:joined-self', async data => {
			console.log(data)
			if (location.pathname !== '/chat') {
				await navigate('/chat', { state: { isRedirected: true } })
			}
			Cookies.set('username', data.username)
			toast.success('You have successfully joined the chat!')
		})
	}, [socket])

	function isButtonDisabled() {
		return username.length < 3
	}

	return (
		<div className='login-page h-screen flex items-center justify-center bg-zinc-100'>
			<div className='login-card sm:w-96 w-full space-y-4 text-center'>
				<h1 className='text-2xl font-bold'>Login.</h1>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<Input
						style={{ borderColor: error ? 'red' : '' }}
						placeholder='Username'
						value={username}
						autoFocus
						pattern='[a-zA-Z0-9]*'
						title='Only Latin letters, numbers are allowed'
						onChange={e => setUsername(e.target.value.trim())}
					/>
					{error && <p className='text-red-500'>{error}</p>}
					<Button disabled={isButtonDisabled()} className='w-full'>
						Submit
					</Button>
				</form>
				<footer className='font-mono text-sm opacity-60 font-bold mt-20'>
					built with ❤️ by{' '}
					<a href='https://dasturchioka.uz' target='_blank' className='underline'>
						@dasturchioka
					</a>
				</footer>
			</div>
		</div>
	)
}
