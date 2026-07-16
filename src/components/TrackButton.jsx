import { IconButton, Tooltip } from '@chakra-ui/react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useFavorites } from '../hooks/useFavorites';

/**
 * Star toggle that adds/removes a launch from the tracked list.
 * Tracked launches appear under the feed's Tracked filter and fire
 * countdown notifications when alerts are enabled.
 */
export default function TrackButton({ launch, size = 'sm' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const tracked = isFavorite(launch.id);

  return (
    <Tooltip
      label={tracked ? 'Stop tracking this launch' : 'Track this launch'}
      hasArrow
    >
      <IconButton
        aria-label={tracked ? 'Stop tracking this launch' : 'Track this launch'}
        icon={tracked ? <FaStar /> : <FaRegStar />}
        size={size}
        variant="ghost"
        color={tracked ? 'orange.400' : 'text.secondary'}
        _hover={{ color: 'orange.300', bg: 'whiteAlpha.100' }}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(launch.id);
        }}
      />
    </Tooltip>
  );
}
