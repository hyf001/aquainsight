import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import 'dayjs/locale/zh-cn'

function App() {
  return <RouterProvider router={router} />
}

export default App
