import { Card, Flex } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import brandMarkIcon from '../assets/icons/Group 1686550876.svg';
import authIllustration from '../assets/icons/illustration auth.svg';
import { useAppSelector } from '../store/hooks';
import './AuthLayout.css';

export default function AuthLayout() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/todos" replace />;
  }

  return (
    <div className="authShell">
      <Flex align="center" justify="center" style={{ minHeight: '100%' }}>
        <Card className="authCard" bodyStyle={{ padding: 0 }}>
          <Flex className="authSplit">
            <div className="authVisual">
              <div className="authArtwork">
                <img className="authIllustration" src={authIllustration} alt="" aria-hidden="true" />
              </div>
            </div>

            <div className="authPanel">
              <div className="authPanelInner">
                <img className="authBrandMark" src={brandMarkIcon} alt="" aria-hidden="true" />
                <Outlet />
              </div>
            </div>
          </Flex>
        </Card>
      </Flex>
    </div>
  );
}
