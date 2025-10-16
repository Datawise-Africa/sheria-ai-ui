import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Chatbot from './pages/Chatbot';
import Landing from './pages/Landing';
import SearchTool from './pages/SearchTool';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/chat',
    element: <Chatbot />,
  },
  {
    path: '/search',
    element: <SearchTool />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
