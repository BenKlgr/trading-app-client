import {
  Badge,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  Td,
  Tr,
  Text,
  Select,
  Divider,
  SimpleGrid,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  useToast,
  Checkbox,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { ChangeEvent, useState } from 'react';
import Dropdown from '../../components/Dropdown';
import ItemIcon from '../../components/ItemIcon';
import { BLOCK_DATA } from '../../data/blocks';
import { ITEM_DATA } from '../../data/items';
import { ITEM_INFO } from '../../data/offset/item_info';
import { ITEM_OFFSET } from '../../data/offset/item_offset';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { GetAllPlacements } from '../../redux/reducer/placements';
import { RootState } from '../../redux/store';

export default function PlacementsActionBar() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };
  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const toast = useToast();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);

  // Form data
  const [buySellSelect, setBuySellSelect] = useState('buy');
  const [selectedItem, setSelectedItem] = useState('');
  const [itemCompressed, setItemCompressed] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const [selectedUnit, setSelectedUnit] = useState('');
  const [unitCompressed, setUnitCompressed] = useState(false);
  const [price, setPrice] = useState(0);

  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const [promoted, setPromoted] = useState(false);
  const [stock, setStock] = useState(0);

  const submit = async () => {
    const response = await axios.post('/api/placements/new', {
      type: buySellSelect,
      item: ITEM_DATA.find((p) => p.displayName == selectedItem)?.name,
      quantity,
      unit: ITEM_DATA.find((p) => p.displayName == selectedUnit)?.name,
      price,
      location,
      description,
      itemCompressed,
      unitCompressed,
      promoted,
      stock,
    });

    if (response.status == 200) {
      if (response.data.ok == true) {
        toast({
          status: 'success',
          title: 'Your placement has been created',
        });
        dispatch(GetAllPlacements());
        toast({
          status: 'info',
          title: 'Placements have been reloaded',
        });
        closeCreateModal();
      } else {
        const errorMessage = response.data.errorMessage;

        if (errorMessage == 'invalid_type') {
          toast({
            status: 'error',
            title: 'The chosen type is invalid',
          });
        }
        if (errorMessage == 'invalid_item') {
          toast({
            status: 'error',
            title: 'You have to choose an item',
          });
        }
        if (errorMessage == 'invalid_unit') {
          toast({
            status: 'error',
            title: 'You have to choose an unit',
          });
        }
        if (errorMessage == 'invalid_price') {
          toast({
            status: 'error',
            title: 'The chosen price is invalid',
          });
        }
        if (errorMessage == 'invalid_stock') {
          toast({
            status: 'error',
            title: 'The chosen stock is invalid',
          });
        }
        if (errorMessage == 'invalid_quantity') {
          toast({
            status: 'error',
            title: 'The chosen price is invalid',
          });
        }
        if (errorMessage == 'invalid_user') {
          toast({
            status: 'error',
            title: 'Your user account is invalid',
            description:
              'Please contact an administrator if this error keeps showing up after a page reload.',
          });
        }
        if (errorMessage == 'invalid_placements_amount') {
          toast({
            status: 'error',
            title: 'Limit reached',
            description:
              'You have reached your placements limit. You should consider an premium account. Contact the administration.',
          });
        }
        if (errorMessage == 'invalid_promoted') {
          toast({
            status: 'error',
            title: 'Promoted placements limit reached',
          });
        }
      }
    }
  };

  const placementsLoading = useAppSelector(
    (state: RootState) => state.placements.loading
  );

  const reload = () => {
    dispatch(GetAllPlacements());
  };

  return (
    <>
      <Stack direction={'row'} justifyContent={'end'}>
        <Button
          variant={Boolean(user) ? 'ghost' : 'solid'}
          colorScheme={'blue'}
          onClick={() => reload()}
          isLoading={placementsLoading == 'loading'}>
          Reload
        </Button>
        {Boolean(user) && (
          <Button colorScheme={'blue'} onClick={() => openCreateModal()}>
            Create placement
          </Button>
        )}
      </Stack>

      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <ModalOverlay />
        <ModalContent width={700} maxWidth={700}>
          <ModalHeader>Create new placement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={5}>
              <Stack spacing={2}>
                <Text>Do you want to buy or sell?</Text>
                <Select
                  value={buySellSelect}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    setBuySellSelect(event.currentTarget.value)
                  }>
                  <option value={'buy'}>Buy</option>
                  <option value={'sell'}>Sell</option>
                </Select>
              </Stack>
              <Divider />
              <SimpleGrid columns={2} gap={5}>
                <Stack spacing={2}>
                  <Text>What item do you want to {buySellSelect}?</Text>
                  <Dropdown
                    list={ITEM_DATA.map((item) => item.displayName)}
                    value={selectedItem}
                    onChange={(item: string) => setSelectedItem(item)}
                    previewValue={(item: string) => {
                      const completeItem = ITEM_DATA.find((p) => p.displayName == item);

                      return (
                        <Stack direction={'row'} minHeight={6}>
                          <ItemIcon item={completeItem?.name || ''} />
                          <Text>{item}</Text>
                        </Stack>
                      );
                    }}
                  />
                  <Checkbox
                    isChecked={itemCompressed}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setItemCompressed(event.currentTarget.checked)
                    }>
                    Compacted item
                  </Checkbox>
                </Stack>
                <Stack spacing={2}>
                  <Text>How much do you want to {buySellSelect}?</Text>
                  <InputGroup>
                    <Input
                      type={'number'}
                      value={quantity}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setQuantity(parseInt(event.currentTarget.value))
                      }
                    />
                    <InputRightElement
                      mr={2}
                      color={'whiteAlpha.400'}
                      children={<Text>Items</Text>}
                    />
                  </InputGroup>
                </Stack>
              </SimpleGrid>
              <Divider />
              <SimpleGrid columns={2} gap={5}>
                <Stack spacing={2}>
                  <Text>
                    {buySellSelect != 'buy'
                      ? 'What do you want for that?'
                      : 'What whould you give for that?'}
                  </Text>
                  <Dropdown
                    list={ITEM_DATA.map((item) => item.displayName)}
                    value={selectedUnit}
                    onChange={(item: string) => setSelectedUnit(item)}
                    previewValue={(item: string) => {
                      const completeItem = ITEM_DATA.find((p) => p.displayName == item);

                      return (
                        <Stack direction={'row'} minHeight={6}>
                          <ItemIcon item={completeItem?.name || ''} />
                          <Text>{item}</Text>
                        </Stack>
                      );
                    }}
                  />
                  <Checkbox
                    checked={unitCompressed}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setUnitCompressed(event.currentTarget.checked)
                    }>
                    Compacted item
                  </Checkbox>
                </Stack>
                <Stack spacing={2}>
                  <Text>
                    {buySellSelect != 'buy'
                      ? 'How much do you want?'
                      : 'How much would you give?'}
                  </Text>
                  <InputGroup>
                    <Input
                      type={'number'}
                      value={price}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setPrice(parseInt(event.currentTarget.value))
                      }
                    />
                    <InputRightElement
                      mr={2}
                      color={'whiteAlpha.400'}
                      children={<Text>Items</Text>}
                    />
                  </InputGroup>
                </Stack>
              </SimpleGrid>
              <Divider />
              <SimpleGrid columns={2} gap={5}>
                <Box>
                  <Text>What is your current stock?</Text>
                  <InputGroup>
                    <Input
                      mt={2}
                      type={'number'}
                      value={stock}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setStock(parseInt(event.currentTarget.value))
                      }
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <Text>Do you want to promote this placement?</Text>
                  <Checkbox
                    mt={4}
                    checked={promoted}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setPromoted(event.currentTarget.checked)
                    }>
                    Yes, promote.
                  </Checkbox>
                </Box>
              </SimpleGrid>
              <Divider />
              <SimpleGrid columns={2} gap={5}>
                <Box>
                  <Textarea
                    placeholder={
                      'You can give here some information about the location of you store.'
                    }
                    value={location}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                      setLocation(event.currentTarget.value)
                    }
                  />
                </Box>
                <Box>
                  <Textarea
                    placeholder={'Here you can give some other information'}
                    value={description}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                      setDescription(event.currentTarget.value)
                    }
                  />
                </Box>
              </SimpleGrid>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack direction={'row'} spacing={5}>
              <Button colorScheme={'blue'} onClick={() => submit()}>
                Submit
              </Button>
              <Button onClick={() => closeCreateModal()}>Close</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
