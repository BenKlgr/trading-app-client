import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  GetUserNotifications,
  MarkNotificationsAsRead,
} from '../redux/reducer/notifications';
import { RootState } from '../redux/store';
import { Notification } from '../types/notification';
import moment from 'moment';

export default function NotificationBell() {
  const dispatch = useAppDispatch();

  const notifications = useAppSelector(
    (state: RootState) => state.notifications.notifications
  );
  const notificationsLoading = useAppSelector(
    (state: RootState) => state.notifications.loading
  );

  const unreadNotifications =
    notifications && notifications.filter((n) => !n.read).length > 0;

  const refresh = () => {
    dispatch(GetUserNotifications());
  };

  const markAsRead = () => {
    if (unreadNotifications) dispatch(MarkNotificationsAsRead());
  };

  useEffect(() => {
    dispatch(GetUserNotifications());

    const interval = setInterval(() => {
      dispatch(GetUserNotifications());
    }, 1000 * 15);

    return () => clearInterval(interval);
  }, []);

  return (
    <Popover placement='top'>
      <PopoverTrigger>
        <IconButton
          aria-label={'bell'}
          onClick={markAsRead}
          icon={
            <>
              <Icon icon={'fa-solid:bell'} />
              {unreadNotifications && (
                <Box
                  as={'span'}
                  color={'white'}
                  position={'absolute'}
                  top={'4px'}
                  right={'2px'}
                  fontSize={'0.7rem'}
                  bgColor={'red'}
                  rounded={'xl'}
                  width={4}
                  zIndex={9999}
                  p={'1px'}>
                  {notifications.filter((n) => !n.read).length}
                </Box>
              )}
            </>
          }></IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontWeight='semibold'>
          <Stack spacing={2} direction={'row'} alignItems={'center'}>
            <Text>Notifications</Text>
            <IconButton
              aria-label={'refresh'}
              size={'sm'}
              isLoading={notificationsLoading == 'loading'}
              onClick={refresh}>
              <Icon icon={'fa-solid:cloud-download-alt'} />
            </IconButton>
          </Stack>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody maxHeight={400} overflowY={'auto'}>
          {notificationsLoading == 'loading' ? (
            <Spinner />
          ) : (
            <Stack spacing={4}>
              {notifications.map((notification, index) => (
                <NotificationItem {...notification} key={index} />
              ))}
            </Stack>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({ message, type, createdAt }: Notification) {
  return (
    <Box>
      <Alert status={type as any}>
        <AlertIcon />
        <AlertTitle mr={2}>{message}</AlertTitle>
      </Alert>
      <Text textAlign={'right'} color={'whiteAlpha.500'} fontSize={'sm'}>
        {moment(createdAt).fromNow()}
      </Text>
    </Box>
  );
}
