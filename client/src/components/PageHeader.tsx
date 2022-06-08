import { Stack, Heading, Divider, Text } from '@chakra-ui/react';

type PageHeaderProps = {
  title: string;
  description?: string;
};
export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <Stack mb={8} spacing={2}>
      <Heading>{title}</Heading>
      {description && (
        <Text color={'whiteAlpha.500'} maxWidth={800}>
          {description}
        </Text>
      )}
      <Divider />
    </Stack>
  );
}
