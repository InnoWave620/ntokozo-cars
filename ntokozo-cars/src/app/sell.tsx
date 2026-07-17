import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoldButton } from '@/components/gold-button';
import { NavigationLayout } from '@/components/navigation-layout';
import { ThemedText } from '@/components/themed-text';
import { Brand, MaxContentWidth, Radius, Shadow, Spacing } from '@/constants/theme';
import { useVehicleRegistry } from '@/hooks/use-vehicle-registry';
import { useTheme } from '@/hooks/use-theme';

export default function SellScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { submitVehicle } = useVehicleRegistry();
  const isWeb = Platform.OS === 'web';
  const paddingTop = isWeb ? 40 : insets.top + Spacing.three;

  // Form states
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [mileage, setMileage] = useState('');
  const [listingType, setListingType] = useState<'Standard Sale' | 'Installment Takeover'>('Standard Sale');
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual' | 'Semi-Automatic'>('Automatic');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'>('Petrol');
  const [colour, setColour] = useState('');
  const [province, setProvince] = useState('Gauteng');
  const [photoUrl, setPhotoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!brand || !model || !year || !price || !mileage || !description) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    const defaultPhoto = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80';
    const photos = photoUrl ? [photoUrl] : [defaultPhoto];
    const features = featuresText
      ? featuresText.split(',').map((f) => f.trim()).filter(Boolean)
      : ['FSH', 'Leather Interior', 'Aircon'];

    submitVehicle({
      brand,
      model,
      year: parseInt(year) || 2024,
      price: parseFloat(price) || 0,
      listingType,
      mileage: parseInt(mileage) || 0,
      transmission,
      fuelType,
      engine: '2.0L',
      colour: colour || 'Black',
      province,
      photos,
      description,
      features,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <NavigationLayout>
        <View style={[styles.successContainer, { backgroundColor: theme.background }]}>
          <ThemedText style={styles.successIcon}>🎉</ThemedText>
          <ThemedText style={styles.successTitle}>Listing Submitted!</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.successText}>
            Thank you for uploading your car to Ntokozo Cars.{'\n\n'}
            Our verification agents will contact you shortly to perform a physical vehicle inspection and verify the market evaluation before publishing it live.
          </ThemedText>
          <GoldButton
            label="Go to Catalog"
            onPress={() => {
              setSubmitted(false);
              // Clear form
              setBrand('');
              setModel('');
              setYear('');
              setPrice('');
              setMileage('');
              setColour('');
              setDescription('');
              setFeaturesText('');
              setPhotoUrl('');
              router.push('/browse');
            }}
          />
        </View>
      </NavigationLayout>
    );
  }

  return (
    <NavigationLayout>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop, paddingBottom: insets.bottom + 120 }}
      >
        <View style={[styles.inner, { maxWidth: MaxContentWidth }]}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Sell Your Car</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              List your vehicle on Ntokozo Cars for direct sale or installment takeover
            </ThemedText>
          </View>

          {/* Form */}
          <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <ThemedText style={styles.cardTitle}>Vehicle Details</ThemedText>

            <View style={styles.formGrid}>
              <View style={styles.formItem}>
                <ThemedText style={styles.inputLabel}>Brand (e.g. BMW)</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                  value={brand}
                  onChangeText={setBrand}
                  placeholder="Enter brand name"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.formItem}>
                <ThemedText style={styles.inputLabel}>Model (e.g. 3 Series)</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                  value={model}
                  onChangeText={setModel}
                  placeholder="Enter model name"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            <View style={styles.formGrid}>
              <View style={styles.formItem}>
                <ThemedText style={styles.inputLabel}>Year</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                  value={year}
                  onChangeText={setYear}
                  placeholder="e.g. 2021"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formItem}>
                <ThemedText style={styles.inputLabel}>Mileage (km)</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                  value={mileage}
                  onChangeText={setMileage}
                  placeholder="e.g. 45000"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGrid}>
              <View style={styles.formItem}>
                <ThemedText style={styles.inputLabel}>Listing Type</ThemedText>
                <View style={styles.selectorRow}>
                  {['Standard Sale', 'Installment Takeover'].map((type) => {
                    const isSelected = listingType === type;
                    return (
                      <Pressable
                        key={type}
                        onPress={() => setListingType(type as any)}
                        style={[
                          styles.selectorBtn,
                          { borderColor: theme.border },
                          isSelected && { backgroundColor: Brand.gold, borderColor: Brand.gold },
                        ]}
                      >
                        <ThemedText style={[styles.selectorBtnText, { color: isSelected ? '#111' : theme.textSecondary }]}>
                          {type}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={styles.formGrid}>
              <View style={styles.formItem}>
                <ThemedText style={styles.inputLabel}>Asking Price (ZAR)</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="e.g. 320000"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGrid}>
              <View style={styles.formItem}>
                <ThemedText style={styles.inputLabel}>Transmission</ThemedText>
                <View style={styles.selectorRow}>
                  {['Automatic', 'Manual'].map((type) => {
                    const isSelected = transmission === type;
                    return (
                      <Pressable
                        key={type}
                        onPress={() => setTransmission(type as any)}
                        style={[
                          styles.selectorBtn,
                          { borderColor: theme.border },
                          isSelected && { backgroundColor: Brand.gold, borderColor: Brand.gold },
                        ]}
                      >
                        <ThemedText style={[styles.selectorBtnText, { color: isSelected ? '#111' : theme.textSecondary }]}>
                          {type}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.formItem}>
                <ThemedText style={styles.inputLabel}>Fuel Type</ThemedText>
                <View style={styles.selectorRow}>
                  {['Petrol', 'Diesel', 'Electric'].map((type) => {
                    const isSelected = fuelType === type;
                    return (
                      <Pressable
                        key={type}
                        onPress={() => setFuelType(type as any)}
                        style={[
                          styles.selectorBtn,
                          { borderColor: theme.border },
                          isSelected && { backgroundColor: Brand.gold, borderColor: Brand.gold },
                        ]}
                      >
                        <ThemedText style={[styles.selectorBtnText, { color: isSelected ? '#111' : theme.textSecondary }]}>
                          {type}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={styles.formGrid}>
              <View style={styles.formItem}>
                <ThemedText style={styles.inputLabel}>Colour</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                  value={colour}
                  onChangeText={setColour}
                  placeholder="e.g. Grey"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.formItem}>
                <ThemedText style={styles.inputLabel}>Location (Province)</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                  value={province}
                  onChangeText={setProvince}
                  placeholder="e.g. Gauteng"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            <View style={styles.formItem}>
              <ThemedText style={styles.inputLabel}>Photo URL (Optional)</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                value={photoUrl}
                onChangeText={setPhotoUrl}
                placeholder="Paste an image URL"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formItem}>
              <ThemedText style={styles.inputLabel}>Vehicle Description</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your car's history, condition, and specs..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formItem}>
              <ThemedText style={styles.inputLabel}>Features & Extras (Comma-separated)</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                value={featuresText}
                onChangeText={setFeaturesText}
                placeholder="e.g. Sunroof, LED Headlights, Leather Seats"
                placeholderTextColor="#666"
              />
            </View>

            <View style={{ marginTop: Spacing.two }}>
              <GoldButton
                label="Submit For Evaluation"
                onPress={handleSubmit}
                fullWidth
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </NavigationLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  inner: {
    alignSelf: 'center',
    width: '100%',
    padding: Spacing.three,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: Radius.large,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    ...Shadow.card,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  formGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  formItem: {
    flex: 1,
    minWidth: 200,
    gap: Spacing.one,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Brand.gold,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.medium,
    padding: Spacing.two + 2,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectorRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  selectorBtn: {
    flex: 1,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    borderRadius: Radius.medium,
    borderWidth: 1,
  },
  selectorBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.six,
    gap: Spacing.three,
  },
  successIcon: {
    fontSize: 60,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.two,
  },
});
