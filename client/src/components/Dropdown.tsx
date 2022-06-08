import { Box, ControlBox, Fade, Input, Stack, Text } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import Fuse from 'fuse.js';
import { ChangeEvent, useRef, useState } from 'react';

type DropdownProps = {
  list: string[];
  onChange?: Function;
  value: string;
  previewValue?: Function;
  previewList?: Function;
};
export default function Dropdown({
  list,
  onChange,
  value,
  previewValue,
  previewList,
}: DropdownProps) {
  const [isOpen, setOpen] = useState(false);
  const close = () => setOpen(false);
  const open = () => {
    setOpen(true);
    if (searchInput.current) (searchInput.current as any).focus();
  };

  const [search, setSearch] = useState('');
  const searchInput = useRef();

  const fuse = new Fuse(list, {});

  return (
    <Box position={'relative'}>
      <Box
        border={'1px'}
        borderColor={'whiteAlpha.300'}
        rounded={'md'}
        paddingX={3}
        paddingY={2}
        cursor={'pointer'}
        onClick={open}>
        {previewValue ? previewValue(value) : defaultValuePreview(value)}
        <Box
          as={Icon}
          icon={!isOpen ? 'fa-solid:angle-down' : 'fa-solid:angle-up'}
          position={'absolute'}
          right={4}
          top={'35%'}
          fontSize={'md'}
        />
      </Box>
      <Fade in={isOpen}>
        <Box
          position={'absolute'}
          top={'100%'}
          left={0}
          width={'100%'}
          backgroundColor={'gray.700'}
          zIndex={'100'}
          pointerEvents={isOpen ? 'all' : 'none'}
          rounded={'md'}
          shadow={'2xl'}
          padding={5}>
          <Stack spacing={5}>
            <Input
              placeholder={'Search for an item/block...'}
              value={search}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setSearch(event.currentTarget.value)
              }
              ref={searchInput as any}
            />
            <Stack maxHeight={200} overflowY={'auto'}>
              <Box
                onClick={() => {
                  if (onChange) {
                    onChange('');
                    close();
                  }
                }}
                cursor={'pointer'}
                _hover={{ backgroundColor: 'whiteAlpha.200' }}
                paddingX={2}
                paddingY={1}
                rounded={'md'}
                me={2}>
                <Stack direction={'row'} spacing={2} alignItems={'center'} minHeight={7}>
                  <Text>Clear Selection</Text>
                  <Icon icon={'fa-solid:times'} />
                </Stack>
              </Box>
              {(search ? fuse.search(search) : list)
                .slice(0, 40)
                .sort()
                .map((item, index) => {
                  const text =
                    (item as any).item != undefined ? (item as any).item : item;
                  return (
                    <Box
                      key={index}
                      onClick={() => {
                        if (onChange) {
                          onChange(text);
                          close();
                        }
                      }}
                      cursor={'pointer'}
                      _hover={{ backgroundColor: 'whiteAlpha.200' }}
                      paddingX={2}
                      paddingY={1}
                      rounded={'md'}
                      me={2}>
                      {previewList ? previewList(text) : defaultListPreview(text)}
                    </Box>
                  );
                })}
            </Stack>
          </Stack>
        </Box>
        <Box
          position={'fixed'}
          top={0}
          left={0}
          height={'100vh'}
          width={'100%'}
          backgroundColor={'blackAlpha.500'}
          zIndex={'50'}
          onClick={() => close()}
          pointerEvents={isOpen ? 'all' : 'none'}></Box>
      </Fade>
    </Box>
  );
}
function defaultValuePreview(value: string) {
  return <Text minHeight={7}>{value}</Text>;
}
function defaultListPreview(value: string) {
  return <Text minHeight={7}>{value}</Text>;
}
