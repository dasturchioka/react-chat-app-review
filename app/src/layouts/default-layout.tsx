import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function DefaultLayout() {
	const username = Cookies.get('username')

	if (!username) {
		return <Navigate to={`/auth`} />
	}

	return (
		<div className='flex min-h-screen flex-col'>
			<main className='flex-1 px-8 py-4'>
				<Outlet />
			</main>
		</div>
	)
}
