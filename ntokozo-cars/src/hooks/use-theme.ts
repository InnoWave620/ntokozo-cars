import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  // Strictly enforce only 'light' or 'dark' to prevent undefined theme lookup crashes
  const theme = scheme === 'light' ? 'light' : 'dark';

  return Colors[theme];
}
