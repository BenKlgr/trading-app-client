import { Box } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export default function Content({ children }: PropsWithChildren<{}>) {
  return (
    <Box paddingY={8} paddingX={8} backgroundColor={'blackAlpha.300'} rounded={'xl'}>
      {children}
    </Box>
  );
}
