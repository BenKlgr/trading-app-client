import { Box, Image } from '@chakra-ui/react';
import { BLOCK_DATA } from '../data/blocks';
import { ITEM_DATA } from '../data/items';
import { ITEM_INFO } from '../data/offset/item_info';
import { ITEM_OFFSET } from '../data/offset/item_offset';

type ItemIconProps = {
  item: string;
};
export default function ItemIcon({ item }: ItemIconProps) {
  if (item.length == 0) return <></>;
  if (ITEM_DATA.find((p) => p.name == item) == null) return <></>;

  return BLOCK_DATA.find((p) => p.name == item) != null ? (
    <Image
      src={`https://mc-icons.netlify.app/icons/${item}.png`}
      sx={{ width: '24px', height: '24px' }}
    />
  ) : (
    <Box
      sx={{
        width: '16px',
        height: '16px',
        backgroundImage: 'https://mc-icons.netlify.app/items_atlas.png',
        backgroundPosition: (ITEM_OFFSET as any)[(ITEM_INFO as any)[item].name],
        transform: 'scale(1.5)',
        imageRendering: 'pixelated',
      }}
    />
  );
}
