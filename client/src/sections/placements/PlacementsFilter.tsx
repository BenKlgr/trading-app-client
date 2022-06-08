import { Box, Input, Stack, Text } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useState } from 'react';
import Dropdown from '../../components/Dropdown';
import ItemIcon from '../../components/ItemIcon';
import { ITEM_DATA } from '../../data/items';
import { useAppDispatch } from '../../hooks/redux';
import { SetPlacementFilter } from '../../redux/reducer/placements';

export default function PlacementsFilter() {
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [search, setSearch] = useState('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      SetPlacementFilter({
        search,
        item: selectedItem,
        unit: selectedUnit,
      })
    );
  }, [search, selectedItem, selectedUnit]);

  return (
    <Stack direction={'row'} spacing={5}>
      <Box>
        <Text color={'whiteAlpha.600'} mb={2}>
          Search for anything
        </Text>
        <Input
          placeholder={'Search...'}
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setSearch(event.currentTarget.value)
          }
        />
      </Box>
      <Box width={300}>
        <Text color={'whiteAlpha.600'} mb={2}>
          Filter for an item
        </Text>
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
      </Box>
      <Box width={300}>
        <Text color={'whiteAlpha.600'} mb={2}>
          Filter for an unit-item
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
      </Box>
    </Stack>
  );
}
