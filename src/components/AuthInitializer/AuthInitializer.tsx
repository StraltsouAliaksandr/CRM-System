import { Spin } from 'antd';
import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';
import { clearAuthState, initializeAuth } from '../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export default function AuthInitializer({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const isInitializing = useAppSelector((state) => state.auth.isInitializing);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;

    dispatch(initializeAuth())
      .unwrap()
      .catch(() => {
        dispatch(clearAuthState());
      });
  }, [dispatch]);

  if (isInitializing) {
    return <Spin fullscreen size="large" />;
  }

  return <>{children}</>;
}
