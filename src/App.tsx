import { NotificationProvider } from './components/Notifications/NotificationProvider';
import TodoListPage from './pages/TodoListPage';

export default function App() {
  return (
    <div className="App">
      <NotificationProvider>
        <TodoListPage />
      </NotificationProvider>
    </div>
  );
}
