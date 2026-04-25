import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import styles from './NotificationProvider.module.css';

interface NotificationItem {
  id: number;
  message: string;
}

interface NotificationContextValue {
  showNotification: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const contextValue = useMemo<NotificationContextValue>(
    () => ({
      showNotification: (message: string) => {
        const notificationId = Date.now();

        setNotifications((currentNotifications) => [
          ...currentNotifications,
          { id: notificationId, message },
        ]);

        window.setTimeout(() => {
          setNotifications((currentNotifications) =>
            currentNotifications.filter(
              (notification) => notification.id !== notificationId
            )
          );
        }, 3000);
      },
    }),
    []
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div className={styles.notificationList}>
        {notifications.map((notification) => (
          <div key={notification.id} className={styles.notificationItem}>
            {notification.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextValue {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }

  return context;
}
