import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ensureDatabaseSetup } from './lib/dbInitializer'

// Initialize the database when the app starts
ensureDatabaseSetup()
  .then(success => {
    if (success) {
      console.log('Database setup successful')
    } else {
      console.warn('Database setup may not have completed successfully. Check logs for details.')
    }
  })
  .catch(error => {
    console.error('Error during database setup:', error)
  })

createRoot(document.getElementById('root')!).render(<App />)
