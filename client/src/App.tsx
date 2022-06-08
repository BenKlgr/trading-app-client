import { ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react';
import { Provider } from 'react-redux';
import AuthProvider from './provider/AuthProvider';
import { store } from './redux/store';
import Router from './router/Router';
import { theme } from './theme/theme';

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
