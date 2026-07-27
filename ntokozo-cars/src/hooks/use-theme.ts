import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  // Default to light (white background)
  const theme = scheme === 'dark' ? 'dark' : 'light';

  return Colors[theme];
}
