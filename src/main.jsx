import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode removed — webcam/media APIs double-invoke se issue hota hai
createRoot(document.getElementById('root')).render(<App />)
