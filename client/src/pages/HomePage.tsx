import { Breadcrumb, Divider, Heading, Stack, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useAppDispatch } from '../hooks/redux';
import { SignOutCurrentUser } from '../redux/reducer/auth';
import { RootState } from '../redux/store';
import PlacementsActionBar from '../sections/placements/PlacementsActionBar';
import PlacementsFilter from '../sections/placements/PlacementsFilter';
import PlacementsTable from '../sections/placements/PlacementsTable';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const signout = () => {
    dispatch(SignOutCurrentUser());
  };

  return (
    <>
      <PageHeader
        title={'Placements overview'}
        description={
          'Here you can see all current offers. We assume no liability for any misrepresentations, but are willing to sanction them. Please report them to an administrator.'
        }
      />
      <Stack spacing={5}>
        <PlacementsActionBar />
        <PlacementsFilter />
        <PlacementsTable />
      </Stack>
    </>
  );
}
