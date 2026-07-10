import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, Button } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';

/**
 * Shared error display with an optional in-place retry, so failures look
 * the same everywhere and never resort to a full page reload.
 */
export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Retry',
  status = 'error',
  isRetrying = false,
  ...rest
}) {
  return (
    <Alert status={status} borderRadius="lg" {...rest}>
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>{title}</AlertTitle>
        {message && <AlertDescription>{message}</AlertDescription>}
      </Box>
      {onRetry && (
        <Button
          leftIcon={<RepeatIcon />}
          size="sm"
          onClick={onRetry}
          isLoading={isRetrying}
          colorScheme="brand"
          variant="outline"
          ml={3}
          flexShrink={0}
        >
          {retryLabel}
        </Button>
      )}
    </Alert>
  );
}
