import { Card, Flex } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import brandMarkIcon from '../assets/icons/auth-brand-mark.svg';
import authIllustration from '../assets/icons/login-page-illustration.svg';
import { useAppSelector } from '../store/hooks';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/todos" replace />;
  }

  return (
    <div className={styles.authShell}>
      <Flex align="center" justify="center" style={{ minHeight: '100%' }}>
        <Card className={styles.authCard} bodyStyle={{ padding: 0 }}>
          <Flex className={styles.authSplit}>
            <div className={styles.authVisual}>
              <div className={styles.authArtwork}>
                <img
                  className={styles.authIllustration}
                  src={authIllustration}
                  alt=""
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className={styles.authPanel}>
              <Flex
                vertical
                style={{
                  width: '100%',
                  maxWidth: 811,
                  minHeight: 596,
                }}
              >
                <img className={styles.authBrandMark} src={brandMarkIcon} alt="" aria-hidden="true" />
                <Outlet />
              </Flex>
            </div>
          </Flex>
        </Card>
      </Flex>
    </div>
  );
}
