import {
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { current } from '@reduxjs/toolkit';
import axios from 'axios';
import Fuse from 'fuse.js';
import { ChangeEvent, MouseEventHandler, useEffect, useMemo, useState } from 'react';
import Dropdown from '../../components/Dropdown';
import ItemIcon from '../../components/ItemIcon';
import { ITEM_DATA } from '../../data/items';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { GetAllPlacements } from '../../redux/reducer/placements';
import { RootState } from '../../redux/store';
import { Placement } from '../../types/placement';

type SortingState = {
  index: string;
  method: 'asc' | 'desc';
};
export default function PlacementsTable() {
  const placements: Placement[] = useAppSelector(
    (state: RootState) => state.placements.placements
  );
  const filter: any = useAppSelector(
    (state: RootState) => state.placements.currentFilter
  );

  const placementsLoading: string = useAppSelector(
    (state: RootState) => state.placements.loading
  );
  const dispatch = useAppDispatch();
  const toast = useToast();
  const user = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    dispatch(GetAllPlacements());
  }, []);

  const filteredPlacements: Placement[] = useMemo(() => {
    const fuse = new Fuse(placements, {
      keys: ['name', 'user.name', 'item', 'unit', 'type'],
    });
    const results =
      filter.search.length > 0
        ? fuse.search(filter.search).map((result) => result.item)
        : placements;

    return results.filter((placement) => {
      const item = ITEM_DATA.find((p) => p.displayName == filter.item)?.name || null;
      const unit = ITEM_DATA.find((p) => p.displayName == filter.unit)?.name || null;
      return !((item && placement.item != item) || (unit && placement.unit != unit));
    });
  }, [filter, placements]);

  const [isDetailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<null | Placement>(null);

  const openDetailsDialog = (placement: Placement) => {
    setSelectedPlacement(placement);
    setDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };
  const [isChangeDialogOpen, setChangeDialogOpen] = useState(false);
  const [newStock, setNewStock] = useState(0);
  const [newPromoted, setNewPromoted] = useState(false);
  const [askedDeleteion, setAskedDeletion] = useState(false);

  const openChangeDialog = (placement: Placement) => {
    setAskedDeletion(false);
    setSelectedPlacement(placement);
    setNewStock(placement.stock);
    setNewPromoted(placement.promoted);
    setChangeDialogOpen(true);
  };

  const closeChangeDialog = () => {
    setChangeDialogOpen(false);
  };

  const deletePlacement = async () => {
    const response = await axios.post(`/api/placements/delete/${selectedPlacement!.id}`);
    if (response.data.ok) {
      closeChangeDialog();
      dispatch(GetAllPlacements());
      toast({
        title: 'Deleted placement',
        status: 'success',
      });
    } else {
      const errorMessage = response.data.errorMessage;

      toast({
        status: 'error',
        title: 'An error ecoured',
        description: errorMessage,
      });
    }
  };

  const submitChanges = async () => {
    const response = await axios.post(`/api/placements/update/${selectedPlacement!.id}`, {
      stock: newStock,
      promoted: newPromoted,
    });
    if (response.data.ok) {
      closeChangeDialog();
      dispatch(GetAllPlacements());
      toast({
        title: 'Saved changes successfully',
        status: 'success',
      });
    } else {
      const errorMessage = response.data.errorMessage;

      if (errorMessage == 'invalid_stock') {
        toast({
          status: 'error',
          title: 'The chosen stock is invalid',
        });
      }
      if (errorMessage == 'invalid_promoted') {
        toast({
          status: 'error',
          title: 'Promoted placements limit reached',
        });
      }
    }
  };

  const [currentSortingState, setCurrentSortingState] = useState<SortingState | null>(
    null
  );

  const tableHeaderClick = (index: string) => {
    if (!currentSortingState || currentSortingState.index != index) {
      setCurrentSortingState({
        index,
        method: 'asc',
      });
    } else {
      if (currentSortingState.method == 'asc') {
        setCurrentSortingState({
          index,
          method: 'desc',
        });
      } else {
        setCurrentSortingState(null);
      }
    }
  };

  const sortingMethods = {
    user: (p: Placement) => p.user!.name,
    type: (p: Placement) => p.type,
    stock: (p: Placement) => p.stock,
    quantity: (p: Placement) => p.quantity,
    item: (p: Placement) => p.item,
    price: (p: Placement) => p.price,
    unit: (p: Placement) => p.unit,
    promoted: (p: Placement) => p.promoted,
  };

  const ascMethod = (method: Function) => (a: any, b: any) =>
    method(a) < method(b) ? -1 : method(a) > method(b) ? 1 : 0;
  const descMethod = (method: Function) => (a: any, b: any) =>
    method(a) < method(b) ? 1 : method(a) > method(b) ? -1 : 0;

  const sortedPlacements = useMemo(() => {
    if (currentSortingState == null)
      return filteredPlacements.sort(descMethod((sortingMethods as any)['promoted']));
    const { index, method } = currentSortingState;
    const sorted = [
      ...filteredPlacements.filter((p) => p.promoted),
      ...filteredPlacements
        .filter((p) => !p.promoted)
        .sort(
          method == 'asc'
            ? ascMethod((sortingMethods as any)[index])
            : descMethod((sortingMethods as any)[index])
        ),
    ];
    return sorted;
  }, [currentSortingState, filteredPlacements]);

  if (placementsLoading == 'loading' || placementsLoading == 'idle') {
    return (
      <Box textAlign={'center'}>
        <Spinner />
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table variant={'simple'}>
          <Thead>
            <Tr>
              <Th></Th>
              <TableHeader
                index={'user'}
                currentSortingState={currentSortingState}
                clickFunction={() => tableHeaderClick('user')}>
                User
              </TableHeader>
              <TableHeader
                index={'type'}
                currentSortingState={currentSortingState}
                clickFunction={() => tableHeaderClick('type')}>
                Type
              </TableHeader>
              <TableHeader
                index={'stock'}
                currentSortingState={currentSortingState}
                clickFunction={() => tableHeaderClick('stock')}>
                Stock
              </TableHeader>
              <TableHeader
                index={'quantity'}
                currentSortingState={currentSortingState}
                clickFunction={() => tableHeaderClick('quantity')}>
                Quantity
              </TableHeader>
              <TableHeader
                index={'item'}
                currentSortingState={currentSortingState}
                clickFunction={() => tableHeaderClick('item')}>
                Item
              </TableHeader>
              <TableHeader
                index={'price'}
                currentSortingState={currentSortingState}
                clickFunction={() => tableHeaderClick('price')}>
                Price
              </TableHeader>
              <TableHeader
                index={'unit'}
                currentSortingState={currentSortingState}
                clickFunction={() => tableHeaderClick('unit')}>
                For
              </TableHeader>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          {placements && filteredPlacements && (
            <Tbody>
              {sortedPlacements.map((placement: Placement, index: number) => {
                const placementUser = placement.user!;

                const isFromUser = user && user.id == placementUser.id;

                return (
                  <Tr key={index}>
                    <Td>
                      {placement.promoted && (
                        <Tooltip label={'Promoted placement'}>
                          <Badge colorScheme={'yellow'} padding={1} rounded={'xl'}>
                            <Icon icon={'fa-solid:star'} />
                          </Badge>
                        </Tooltip>
                      )}
                    </Td>
                    <Td>
                      <Tooltip
                        label={
                          placementUser &&
                          `${placementUser.name}#${placementUser.discriminator}`
                        }>
                        <Avatar
                          name={placementUser && placementUser.name}
                          src={placementUser && placementUser.avatar}
                          height={'32px'}
                          width={'32px'}
                        />
                      </Tooltip>
                    </Td>
                    <Td>
                      {placement.type == 'buy' ? (
                        <Badge colorScheme='green'>Buying</Badge>
                      ) : (
                        <Badge colorScheme='red'>Selling</Badge>
                      )}
                    </Td>
                    <Td textAlign={'center'}>
                      {placement.stock == 0 ? (
                        <Badge>Out of stock</Badge>
                      ) : (
                        <Text textAlign={'center'}>{placement.stock}</Text>
                      )}
                    </Td>
                    <Td textAlign={'center'}>
                      <Text textAlign={'center'}>{placement.quantity}</Text>
                    </Td>
                    <Td>
                      <Stack direction={'row'} spacing={2}>
                        <ItemIcon item={placement.item} />
                        <Text>
                          {ITEM_DATA.find((p) => p.name == placement.item)?.displayName}
                        </Text>
                        {placement.itemCompressed && <Badge>compacted</Badge>}
                      </Stack>
                    </Td>
                    <Td textAlign={'center'}>
                      <Text textAlign={'center'}>{placement.price}</Text>
                    </Td>
                    <Td>
                      <Stack direction={'row'} spacing={2}>
                        <ItemIcon item={placement.unit} />
                        <Text>
                          {ITEM_DATA.find((p) => p.name == placement.unit)?.displayName}
                        </Text>
                        {placement.unitCompressed && <Badge>compacted</Badge>}
                      </Stack>
                    </Td>
                    <Td>
                      <Stack direction={'row'} spacing={2}>
                        <Tooltip label='Show details'>
                          <IconButton
                            aria-label='Show details'
                            icon={<Icon icon={'fa-solid:info'} />}
                            size={'sm'}
                            onClick={() => openDetailsDialog(placement)}
                          />
                        </Tooltip>
                        {isFromUser && (
                          <Tooltip label='Edit placement'>
                            <IconButton
                              colorScheme={'blue'}
                              aria-label='Edit placement'
                              icon={<Icon icon={'fa-solid:edit'} />}
                              size={'sm'}
                              onClick={() => openChangeDialog(placement)}
                            />
                          </Tooltip>
                        )}
                      </Stack>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          )}
        </Table>
      </TableContainer>

      {placements.length == 0 && (
        <Text mt={5} textAlign={'center'} color={'whiteAlpha.500'}>
          There are no placements at the moment.
        </Text>
      )}

      <Modal isOpen={isDetailsDialogOpen} onClose={closeDetailsDialog}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Stack direction={'row'} spacing={3} alignItems={'center'}>
              <Text>Placement: #{selectedPlacement?.id.slice(0, 8)}</Text>
              {selectedPlacement?.type == 'buy' ? (
                <Badge colorScheme='green'>Buying</Badge>
              ) : (
                <Badge colorScheme='red'>Selling</Badge>
              )}
            </Stack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant={'simple'}>
              <Tr>
                <Td>User</Td>
                <Td>
                  <Stack direction={'row'} alignItems={'center'}>
                    <Avatar
                      name={(selectedPlacement && selectedPlacement.user?.name) || ''}
                      src={(selectedPlacement && selectedPlacement.user?.avatar) || ''}
                      height={'24px'}
                      width={'24px'}
                    />
                    <Text>
                      {selectedPlacement &&
                        selectedPlacement.user &&
                        selectedPlacement.user.name}
                    </Text>
                  </Stack>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text>Selling</Text>
                </Td>
                <Td>
                  <Stack direction={'row'} spacing={2}>
                    <Text>{selectedPlacement?.quantity}</Text>
                    <Text>x</Text>

                    <ItemIcon item={selectedPlacement?.item || ''} />
                    <Text>
                      {
                        ITEM_DATA.find((p) => p.name == selectedPlacement?.item)
                          ?.displayName
                      }
                    </Text>
                  </Stack>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text>Price</Text>
                </Td>
                <Td>
                  <Stack direction={'row'} spacing={2}>
                    <Text>{selectedPlacement?.price}</Text>
                    <Text>x</Text>
                    <ItemIcon item={selectedPlacement?.unit || ''} />
                    <Text>
                      {
                        ITEM_DATA.find((p) => p.name == selectedPlacement?.unit)
                          ?.displayName
                      }
                    </Text>
                  </Stack>
                </Td>
              </Tr>
              <Tr>
                <Td>Location</Td>
                <Td>
                  {selectedPlacement?.location.length == 0 && 'No information'}
                  {selectedPlacement?.location}
                </Td>
              </Tr>
              <Tr>
                <Td>Description</Td>
                <Td>
                  {selectedPlacement?.description!.length == 0 && 'No information'}
                  {selectedPlacement?.description || ''}
                </Td>
              </Tr>
            </Table>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isChangeDialogOpen} onClose={closeChangeDialog}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit placement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Stack spacing={2}>
                <Text>What is your new Stock?</Text>
                <InputGroup>
                  <Input
                    type={'number'}
                    value={newStock}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setNewStock(parseInt(event.currentTarget.value))
                    }
                  />
                </InputGroup>
              </Stack>
              <Stack spacing={2}>
                <Text>Do you want to promote this placement?</Text>
                <Checkbox
                  mt={4}
                  checked={newPromoted}
                  isChecked={newPromoted}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setNewPromoted(event.currentTarget.checked)
                  }>
                  Yes, promote.
                </Checkbox>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack direction={'row'} spacing={5}>
              {!askedDeleteion && (
                <Button colorScheme={'red'} onClick={() => setAskedDeletion(true)}>
                  Delete Placement
                </Button>
              )}
              {askedDeleteion && (
                <Button colorScheme={'red'} onClick={() => deletePlacement()}>
                  Confirm
                </Button>
              )}
              <Button colorScheme={'blue'} onClick={() => submitChanges()}>
                Save changes
              </Button>
              <Button onClick={() => closeChangeDialog()}>Close</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

type TableHeaderProps = {
  clickFunction: any;
  index: string;
  currentSortingState: SortingState | null;
  children: any;
};
const TableHeader = function ({
  clickFunction,
  index,
  currentSortingState,
  children,
}: TableHeaderProps) {
  return (
    <Th cursor={'pointer'} onClick={clickFunction}>
      <Stack direction={'row'} spacing={2} alignItems={'center'}>
        <Text>{children}</Text>
        {currentSortingState && currentSortingState.index == index && (
          <Icon
            icon={
              currentSortingState.method == 'asc'
                ? 'fa-solid:angle-double-up'
                : 'fa-solid:angle-double-down'
            }
          />
        )}
      </Stack>
    </Th>
  );
};
