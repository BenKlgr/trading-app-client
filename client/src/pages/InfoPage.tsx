import {
  Avatar,
  Badge,
  Box,
  Breadcrumb,
  Divider,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useAppDispatch } from '../hooks/redux';
import { SignOutCurrentUser } from '../redux/reducer/auth';
import { RootState } from '../redux/store';
import PlacementsActionBar from '../sections/placements/PlacementsActionBar';
import PlacementsFilter from '../sections/placements/PlacementsFilter';
import PlacementsTable from '../sections/placements/PlacementsTable';
import { User } from '../types/user';

export default function HomePage() {
  const [admins, setAdmins] = useState<User[]>([]);

  useEffect(() => {
    getAdmins();
  }, []);

  const getAdmins = async () => {
    const response = await axios('/api/info/admins');

    setAdmins(response.data.payload);
  };

  return (
    <>
      <PageHeader
        title={'Information'}
        description={
          'If you have any other questions that have not been answered here, please contact the administration (Jaydon) directly.'
        }
      />
      <Stack spacing={8}>
        <Stack spacing={4}>
          <Heading size={'md'}>Administration</Heading>
          <Stack direction={'row'}>
            <Stack spacing={4} flex={1}>
              {admins.map((admin, index) => {
                return (
                  <Stack direction={'row'} alignItems={'center'} spacing={4} key={index}>
                    <Avatar name={admin.name} src={admin.avatar} />
                    <Text fontSize={'large'} fontWeight={'medium'}>
                      {admin.name}
                    </Text>
                    <Badge colorScheme={'red'}>
                      <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        <Icon icon={'fa-solid:shield-alt'} />
                        <Text>Admin</Text>
                      </Stack>
                    </Badge>
                  </Stack>
                );
              })}
            </Stack>
            <Text flex={1} color={'whiteAlpha.700'}>
              Behind the team of MC-Terminal the organization are some of the more
              recognizable faces in the community. They pledge to be politcially neutral
              and run the City to the best possible economic outcome for all participants.
            </Text>
          </Stack>
        </Stack>
        <Divider />
        <Stack spacing={4}>
          <Heading size={'md'}>Our Services</Heading>
          <Text maxW={'50%'} color={'whiteAlpha.700'}>
            As the largest trading platform, we offer you the opportunity to sell your
            goods and discover exciting offers with the help of our clear table.
          </Text>
        </Stack>
      </Stack>
    </>
  );
}
