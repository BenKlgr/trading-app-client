import {
  Avatar,
  Box,
  Button,
  Stack,
  Text,
  Link as ExternalLink,
  Tooltip,
  Badge,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { SignOutCurrentUser } from '../redux/reducer/auth';
import { RootState } from '../redux/store';
import Content from './Content';
import NotificationBell from './NotificationsBell';

export default function Navigation() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state: RootState) => state.auth.user);
  const isAuthenticated = Boolean(user);

  const signout = () => {
    dispatch(SignOutCurrentUser());
  };

  return (
    <Box paddingY={4} paddingX={8} backgroundColor={'blackAlpha.300'} rounded={'xl'}>
      <Stack direction={'row'}>
        <Stack direction={'row'} flex={1} spacing={4}>
          <NavigationItem label={'Placements'} link={'/'} icon={'fa-solid:list'} />
          <NavigationItem
            label={'Information'}
            link={'/info'}
            icon={'fa-solid:info-circle'}
          />
          {user && user.admin && (
            <NavigationItem
              label={'Admin Control'}
              link={'/admin'}
              icon={'fa-solid:shield-alt'}
            />
          )}
        </Stack>
        <Stack direction={'row'} alignItems={'center'} spacing={4}>
          {isAuthenticated ? (
            <>
              {user?.premium && <Badge colorScheme={'yellow'}>Premium</Badge>}
              <Tooltip label={`Signed in as ${user?.name}`}>
                <Avatar name={user!.name} src={user!.avatar} height={8} width={8} />
              </Tooltip>
              <NotificationBell />
              <Button onClick={signout}>Sign out</Button>
            </>
          ) : (
            <>
              <Button colorScheme={'blue'} as={ExternalLink} href={'/api/auth/discord'}>
                Sign in with Discord
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

type NavigationItemProps = {
  label: string;
  link: string;
  icon: string;
};
function NavigationItem({ label, link, icon }: NavigationItemProps) {
  return (
    <Link to={link}>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        height={'100%'}
        paddingX={2}
        _hover={{
          backgroundColor: 'whiteAlpha.100',
        }}
        rounded={'md'}>
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Icon icon={icon} />
          <Text>{label}</Text>
        </Stack>
      </Box>
    </Link>
  );
}
