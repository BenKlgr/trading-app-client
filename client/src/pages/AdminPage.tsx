import {
  Avatar,
  Badge,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  DeleteUser,
  GetUsers,
  ToggleUserAdmin,
  ToggleUserPremium,
} from '../redux/reducer/admin';
import { RootState } from '../redux/store';

export default function AdminPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  const users = useAppSelector((state: RootState) => state.admin.users);
  const currentUser = useAppSelector((state: RootState) => state.auth.user);

  const toast = useToast();

  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    dispatch(GetUsers());
  }, [dispatch]);

  const togglePremium = (userId: string) => {
    dispatch(ToggleUserPremium(userId));
    const user = users.find((u) => u.id == userId)!;
    toast({
      title: 'Updated',
      description: `User (${user.name}) is ${
        user.premium ? 'no longer' : 'now'
      } an premium user.`,
      status: 'success',
    });
  };

  const toggleAdmin = (userId: string) => {
    dispatch(ToggleUserAdmin(userId));
    const user = users.find((u) => u.id == userId)!;
    toast({
      title: 'Updated',
      description: `User (${user.name}) is ${user.admin ? 'no longer' : 'now'} an admin.`,
      status: 'success',
    });
  };

  const deleteUser = (userId: string) => {
    setIsOpen(true);
    setSelectedUser(userId);
  };
  const confirmDelete = () => {
    dispatch(DeleteUser(selectedUser));
    const user = users.find((u) => u.id == selectedUser)!;
    toast({
      title: 'Updated',
      description: `Deleted (${user.name}) and all his notifications and placements.`,
      status: 'success',
    });
    setIsOpen(false);
  };

  return (
    <>
      <PageHeader
        title={'Admin Control'}
        description={
          'Dear Manuel, as you know, this is all still a work in progress. In that sense, do not overdo it.'
        }
      />
      <TableContainer>
        <Table variant={'simple'}>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>User</Th>
              <Th>Badges</Th>
              <Th>Provider-ID</Th>
              <Th>Creation-Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user: any, index: number) => (
              <Tr key={index}>
                <Td>
                  <Tooltip label={user.id}>{user.id.slice(0, 8)}</Tooltip>
                </Td>
                <Td>
                  <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <Avatar name={user.name} src={user.avatar} height={8} width={8} />
                    <Text>{user.name}</Text>
                  </Stack>
                </Td>
                <Td>
                  <Stack direction={'row'} spacing={2}>
                    {user.admin && <Badge colorScheme={'red'}>Admin</Badge>}
                    {user.premium && <Badge colorScheme={'yellow'}>Premium</Badge>}
                  </Stack>
                </Td>
                <Td>{user.provider_id}</Td>
                <Td>{moment(user.createdAt).format('DD.MM.YYYY')}</Td>
                <Td>
                  <Stack direction={'row'} spacing={2}>
                    <Tooltip
                      label={
                        user.premium ? 'Remove premium status' : 'Give premium status'
                      }>
                      <IconButton
                        aria-label={'premium'}
                        onClick={() => togglePremium(user.id)}>
                        <Icon icon={'fa-solid:star'} />
                      </IconButton>
                    </Tooltip>
                    {currentUser?.id != user.id && (
                      <Tooltip
                        label={user.admin ? 'Remove admin status' : 'Give admin status'}>
                        <IconButton
                          aria-label={'admin'}
                          onClick={() => toggleAdmin(user.id)}>
                          <Icon icon={'fa-solid:shield-alt'} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {currentUser?.id != user.id && (
                      <Tooltip label={'Delete account'}>
                        <IconButton
                          aria-label={'delete'}
                          onClick={() => deleteUser(user.id)}>
                          <Icon icon={'fa-solid:trash'} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Sure, you want to delete{' '}
              <Text fontWeight={'semibold'} display={'inline'}>
                {users.find((u) => u!.id == selectedUser)?.name || ''}'s
              </Text>{' '}
              account?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Abort
            </Button>
            <Button colorScheme={'red'} onClick={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
