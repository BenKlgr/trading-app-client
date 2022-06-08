import { Box, Spinner } from '@chakra-ui/react';
import { PropsWithChildren, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { GetCurrentUser } from '../redux/reducer/auth';
import { RootState } from '../redux/store';

export default function AuthProvider({ children }: PropsWithChildren<{}>) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    dispatch(GetCurrentUser());
  }, []);

  if (loading == 'loading' || loading == 'idle') {
    return (
      <Spinner
        size={'xl'}
        colorScheme={'blue'}
        position={'fixed'}
        left={'50%'}
        top={'50%'}
        translateX={'-50%'}
        translateY={'-50%'}
      />
    );
  }

  return <>{children}</>;
}
