import { Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Navigate } from 'react-router-dom'

export default function AuthLayout() {
	const username = Cookies.get('username')

	if (username) {
		return <Navigate to={`/chat`} />
	}

	return (
		<main className='min-h-screen'>
			<Outlet />
		</main>
	)
}
