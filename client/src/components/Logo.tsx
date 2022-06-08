import { Box, Image, Link } from '@chakra-ui/react';
import logo from '../data/logo.png';

export default function Logo() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Link href={'/'}>
        <Box cursor={'pointer'}>
          <Image src={logo as any} maxWidth={'100%'} />
        </Box>
      </Link>
    </Box>
  );
}
