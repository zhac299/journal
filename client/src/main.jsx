import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import Task from './components/Task'

import './index.css'
import App from './App.jsx'
import CurrentDate from './components/CurrentDate.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // children: [
    //   {
    //     path: '/',
    //     element: <CurrentDate />,
    //   },
    // ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)