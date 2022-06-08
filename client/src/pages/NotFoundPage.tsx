import { Box, Text, Heading, Button } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { SignOutCurrentUser } from '../redux/reducer/auth';
import { RootState } from '../redux/store';

export default function NotFoundPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const signout = () => {
    dispatch(SignOutCurrentUser());
  };

  return (
    <Box textAlign='center' py={10} px={6}>
      <Heading display='inline-block' as='h2' size={'2xl'}>
        404
      </Heading>
      <Text fontSize='18px' mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={'gray.500'} mb={6}>
        The page you're looking for does not seem to exist
      </Text>

      <Button colorScheme='blue' variant='solid' as={Link} to={'/'}>
        Go to Home
      </Button>
    </Box>
  );
}
