import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import HomeLayout from '../layouts/HomeLayout';
import AdminPage from '../pages/AdminPage';
import HomePage from '../pages/HomePage';
import InfoPage from '../pages/InfoPage';
import NotFoundPage from '../pages/NotFoundPage';
import { RootState } from '../redux/store';

export default function Router() {
  const user = useAppSelector((state: RootState) => state.auth.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path={'/'} element={<HomePage />} />
          <Route path={'info'} element={<InfoPage />} />

          {user && user.admin ? <Route path={'/admin'} element={<AdminPage />} /> : <></>}

          <Route path={'*'} element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
