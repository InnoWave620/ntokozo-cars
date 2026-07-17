import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterChipsProps {
  label?: string;
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
  allLabel?: string;
}

export function FilterChips({
  label,
  options,
  selected,
  onSelect,
  allLabel = 'All',
}: FilterChipsProps) {
  const theme = useTheme();
  const allOptions: FilterOption[] = [{ label: allLabel, value: '' }, ...options];

  return (
    <View style={styles.wrapper}>
      {label && (
        <ThemedText themeColor="textSecondary" style={styles.label}>
          {label}
        </ThemedText>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {allOptions.map((opt) => {
          const isActive = selected === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onSelect(opt.value)}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? Brand.gold : theme.backgroundElement,
                  borderColor: isActive ? Brand.gold : theme.border,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Filter by ${opt.label}`}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  { color: isActive ? '#111' : theme.textSecondary },
                ]}
              >
                {opt.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.three,
  },
  row: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
