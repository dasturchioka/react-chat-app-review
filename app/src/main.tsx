import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from './components/ui/sonner'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import App from './app'

const AuthLayout = React.lazy(() => import('./layouts/auth-layout'))
const DefaultLayout = React.lazy(() => import('./layouts/default-layout'))

const GlobalChatPage = React.lazy(() => import('./pages/global-chat-page'))
const LoginPage = React.lazy(() => import('./pages/login-page'))

const routes = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <Navigate to='/auth' />,
			},
			{
				path: 'auth',
				element: <AuthLayout />,
				children: [
					{
						path: '',
						element: <LoginPage />,
					},
				],
			},
			{
				path: 'chat',
				element: <DefaultLayout />,
				children: [
					{
						path: '',
						element: <GlobalChatPage />,
					},
				],
			},
		],
	},
])

createRoot(document.getElementById('root')!).render(
	<>
		<Toaster position='top-center' />
		<RouterProvider router={routes} />
	</>
)
