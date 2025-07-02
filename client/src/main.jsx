import { StrictMode } from 'react'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import * as ReactDOM from "react-dom/client"

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import RoutineItem from './components/RoutineItem'
import RoutineItemList from './components/RoutineItemList'

import './index.css'
import App from './App.jsx'

const router = createBrowserRouter([
  {
    path:'/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <RoutineItemList />,
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
