import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Modal,
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
import { INITIAL_SALES, INITIAL_WORKERS, SaleRecord, Worker } from '@/data/dashboard';
import { MOCK_VEHICLES } from '@/data/vehicles';
import { useTheme } from '@/hooks/use-theme';
import { useVehicleRegistry } from '@/hooks/use-vehicle-registry';

export default function DashboardScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const paddingTop = isWeb ? 40 : insets.top + Spacing.three;

  const { pendingListings, approveVehicle, activeListings } = useVehicleRegistry();

  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'workers' | 'inventory' | 'approvals'>('overview');
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [sales, setSales] = useState<SaleRecord[]>(INITIAL_SALES);
  
  // Worker Form State
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerRole, setNewWorkerRole] = useState('');
  const [newWorkerEmail, setNewWorkerEmail] = useState('');

  // Evaluation & Approval Modal State
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [evalPrice, setEvalPrice] = useState('');
  const [engineChecked, setEngineChecked] = useState(false);
  const [brakesChecked, setBrakesChecked] = useState(false);
  const [bodyworkChecked, setBodyworkChecked] = useState(false);
  const [interiorChecked, setInteriorChecked] = useState(false);
  const [vinChecked, setVinChecked] = useState(false);

  // ── Handlers ──
  const handleApproveListing = () => {
    if (!selectedVehicle || !evalPrice) return;
    
    const finalPrice = parseFloat(evalPrice) || selectedVehicle.price;
    approveVehicle(selectedVehicle.id, finalPrice);
    
    // Reset
    setSelectedVehicle(null);
    setEvalPrice('');
    setEngineChecked(false);
    setBrakesChecked(false);
    setBodyworkChecked(false);
    setInteriorChecked(false);
    setVinChecked(false);
  };
  const handleAddWorker = () => {
    if (!newWorkerName || !newWorkerRole || !newWorkerEmail) return;

    const newWorker: Worker = {
      id: `w00${workers.length + 1}`,
      name: newWorkerName,
      role: newWorkerRole,
      email: newWorkerEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80', // Default avatar
      activeListings: 0,
      totalSales: 0,
      salesVolume: 0,
    };

    setWorkers([...workers, newWorker]);
    setIsAddWorkerOpen(false);
    // Clear form
    setNewWorkerName('');
    setNewWorkerRole('');
    setNewWorkerEmail('');
  };

  const handleUpdateSalesStatus = (saleId: string, nextStatus: SaleRecord['status']) => {
    setSales(
      sales.map((sale) => (sale.id === saleId ? { ...sale, status: nextStatus } : sale))
    );
  };

  // ── Metrics Calculators ──
  const totalRevenue = sales
    .filter((s) => s.status === 'Completed')
    .reduce((acc, curr) => acc + curr.price, 0);

  const pendingFinanceCount = sales.filter((s) => s.status === 'Finance Approval').length;

  return (
    <NavigationLayout>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop, paddingBottom: insets.bottom + 120 }}
      >
        <View style={[styles.inner, { maxWidth: MaxContentWidth }]}>
          {/* Dashboard Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <ThemedText style={styles.title}>Dealership Dashboard</ThemedText>
              <View style={[styles.badge, { backgroundColor: Brand.gold + '20', borderColor: Brand.gold }]}>
                <ThemedText style={styles.badgeText}>ADMIN PANEL</ThemedText>
              </View>
            </View>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              Monitor performance, manage sales agents, and review inventory status
            </ThemedText>
          </View>

          {/* Section Navigation Tabs */}
          <View style={[styles.tabsContainer, { borderBottomColor: theme.border }]}>
            {(['overview', 'sales', 'workers', 'inventory', 'approvals'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tabButton,
                    isActive && { borderBottomColor: Brand.gold, borderBottomWidth: 2 },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.tabButtonText,
                      { color: isActive ? Brand.gold : theme.textSecondary },
                    ]}
                  >
                    {tab.toUpperCase()}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {/* ── Content Render ── */}
          {activeTab === 'overview' && (
            <View style={styles.tabContent}>
              {/* KPI Grid */}
              <View style={styles.kpiRow}>
                <View style={[styles.kpiCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <ThemedText themeColor="textSecondary" style={styles.kpiLabel}>
                    TOTAL REVENUE
                  </ThemedText>
                  <ThemedText style={[styles.kpiValue, { color: Brand.gold }]}>
                    R {totalRevenue.toLocaleString('en-ZA')}
                  </ThemedText>
                  <ThemedText style={styles.kpiSub}>From completed deals</ThemedText>
                </View>
                <View style={[styles.kpiCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <ThemedText themeColor="textSecondary" style={styles.kpiLabel}>
                    FINANCE PENDING
                  </ThemedText>
                  <ThemedText style={[styles.kpiValue, { color: Brand.accent }]}>
                    {pendingFinanceCount}
                  </ThemedText>
                  <ThemedText style={styles.kpiSub}>Awaiting bank approval</ThemedText>
                </View>
                <View style={[styles.kpiCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                  <ThemedText themeColor="textSecondary" style={styles.kpiLabel}>
                    TOTAL AGENTS
                  </ThemedText>
                  <ThemedText style={styles.kpiValue}>{workers.length}</ThemedText>
                  <ThemedText style={styles.kpiSub}>Active sales consultants</ThemedText>
                </View>
              </View>

              {/* Performance Section */}
              <View style={[styles.sectionCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <ThemedText style={styles.sectionTitle}>Agent Performance Leaderboard</ThemedText>
                <View style={styles.leaderboardList}>
                  {workers
                    .sort((a, b) => b.salesVolume - a.salesVolume)
                    .map((agent, i) => (
                      <View
                        key={agent.id}
                        style={[
                          styles.leaderboardItem,
                          i < workers.length - 1 && { borderBottomColor: theme.border, borderBottomWidth: 1 },
                        ]}
                      >
                        <Image source={{ uri: agent.avatar }} style={styles.agentAvatar} />
                        <View style={styles.agentInfo}>
                          <ThemedText style={styles.agentName}>{agent.name}</ThemedText>
                          <ThemedText themeColor="textSecondary" style={styles.agentRole}>
                            {agent.role}
                          </ThemedText>
                        </View>
                        <View style={styles.agentStats}>
                          <ThemedText style={[styles.agentVol, { color: Brand.gold }]}>
                            R {agent.salesVolume.toLocaleString('en-ZA')}
                          </ThemedText>
                          <ThemedText themeColor="textSecondary" style={styles.agentDeals}>
                            {agent.totalSales} deals completed
                          </ThemedText>
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'sales' && (
            <View style={styles.tabContent}>
              <View style={[styles.sectionCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <ThemedText style={styles.sectionTitle}>Recent Sales Transactions</ThemedText>
                <View style={styles.tableList}>
                  {sales.map((sale) => (
                    <View key={sale.id} style={[styles.tableRow, { borderBottomColor: theme.border }]}>
                      <View style={styles.saleMain}>
                        <ThemedText style={styles.saleVehicle}>{sale.vehicleName}</ThemedText>
                        <ThemedText themeColor="textSecondary" style={styles.saleDetails}>
                          Buyer: {sale.buyerName} • Agent: {sale.agentName}
                        </ThemedText>
                        <ThemedText themeColor="textSecondary" style={styles.saleDate}>
                          Date: {sale.date}
                        </ThemedText>
                      </View>

                      <View style={styles.saleRight}>
                        <ThemedText style={styles.salePrice}>
                          R {sale.price.toLocaleString('en-ZA')}
                        </ThemedText>
                        <View
                          style={[
                            styles.statusBadge,
                            sale.status === 'Completed'
                              ? styles.badgeCompleted
                              : sale.status === 'Finance Approval'
                              ? styles.badgeFinance
                              : styles.badgePending,
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.statusBadgeText,
                              sale.status === 'Completed' && { color: '#2EC4B6' },
                              sale.status === 'Finance Approval' && { color: Brand.gold },
                              sale.status === 'Pending' && { color: '#E63946' },
                            ]}
                          >
                            {sale.status}
                          </ThemedText>
                        </View>

                        {/* Status controls */}
                        {sale.status !== 'Completed' && (
                          <View style={styles.actionRow}>
                            <Pressable
                              onPress={() => handleUpdateSalesStatus(sale.id, 'Completed')}
                              style={[styles.smallBtn, { backgroundColor: '#2EC4B620' }]}
                            >
                              <ThemedText style={[styles.smallBtnText, { color: '#2EC4B6' }]}>
                                Complete
                              </ThemedText>
                            </Pressable>
                            {sale.status === 'Pending' && (
                              <Pressable
                                onPress={() => handleUpdateSalesStatus(sale.id, 'Finance Approval')}
                                style={[styles.smallBtn, { backgroundColor: Brand.gold + '20' }]}
                              >
                                <ThemedText style={[styles.smallBtnText, { color: Brand.gold }]}>
                                  Finance
                                </ThemedText>
                              </Pressable>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'workers' && (
            <View style={styles.tabContent}>
              <View style={styles.actionHeader}>
                <GoldButton
                  label="Add Sales Agent"
                  icon="👤"
                  onPress={() => setIsAddWorkerOpen(true)}
                />
              </View>

              <View style={[styles.sectionCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <ThemedText style={styles.sectionTitle}>Sales Team Directory</ThemedText>
                <View style={styles.leaderboardList}>
                  {workers.map((agent) => (
                    <View key={agent.id} style={[styles.leaderboardItem, { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
                      <Image source={{ uri: agent.avatar }} style={styles.agentAvatar} />
                      <View style={styles.agentInfo}>
                        <ThemedText style={styles.agentName}>{agent.name}</ThemedText>
                        <ThemedText themeColor="textSecondary" style={styles.agentRole}>
                          {agent.role}
                        </ThemedText>
                        <ThemedText themeColor="textSecondary" style={styles.agentEmail}>
                          {agent.email}
                        </ThemedText>
                      </View>
                      <View style={styles.agentStats}>
                        <ThemedText style={styles.agentDeals}>
                          {agent.activeListings} Active Listings
                        </ThemedText>
                        <ThemedText themeColor="textSecondary" style={styles.agentDeals}>
                          {agent.totalSales} Lifetime Sales
                        </ThemedText>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'inventory' && (
            <View style={styles.tabContent}>
              <View style={[styles.sectionCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <ThemedText style={styles.sectionTitle}>Inventory Status Controller</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.sectionDesc}>
                  Quickly review and mark cars as Available or Sold.
                </ThemedText>
                <View style={styles.tableList}>
                  {MOCK_VEHICLES.map((vehicle) => (
                    <View key={vehicle.id} style={[styles.tableRow, { borderBottomColor: theme.border }]}>
                      <Image source={{ uri: vehicle.photos[0] }} style={styles.inventoryImage} />
                      <View style={styles.saleMain}>
                        <ThemedText style={styles.saleVehicle}>
                          {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </ThemedText>
                        <ThemedText themeColor="textSecondary" style={styles.saleDetails}>
                          R {vehicle.price.toLocaleString('en-ZA')} • {vehicle.transmission} • {vehicle.province}
                        </ThemedText>
                      </View>
                      <View style={styles.saleRight}>
                        <View style={[styles.badge, { backgroundColor: Brand.gold + '15', borderColor: Brand.gold }]}>
                          <ThemedText style={[styles.badgeText, { color: Brand.gold }]}>
                            {vehicle.listingType}
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'approvals' && (
            <View style={styles.tabContent}>
              <View style={[styles.sectionCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                <ThemedText style={styles.sectionTitle}>Pending Listings Awaiting Evaluation</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.sectionDesc}>
                  Sellers have uploaded these vehicles. They must undergo physical condition checks and pricing validation before approval.
                </ThemedText>
                
                {pendingListings.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyText}>No pending listings awaiting evaluation.</ThemedText>
                  </View>
                ) : (
                  <View style={styles.tableList}>
                    {pendingListings.map((vehicle) => (
                      <View key={vehicle.id} style={[styles.tableRow, { borderBottomColor: theme.border }]}>
                        <Image source={{ uri: vehicle.photos[0] }} style={styles.inventoryImage} />
                        <View style={styles.saleMain}>
                          <ThemedText style={styles.saleVehicle}>
                            {vehicle.brand} {vehicle.model} ({vehicle.year})
                          </ThemedText>
                          <ThemedText themeColor="textSecondary" style={styles.saleDetails}>
                            Asking Price: R {vehicle.price.toLocaleString('en-ZA')} • Mileage: {vehicle.mileage.toLocaleString('en-ZA')} km
                          </ThemedText>
                          <ThemedText themeColor="textSecondary" style={styles.saleDetails}>
                            Location: {vehicle.province} • Seller Contact Requested
                          </ThemedText>
                        </View>
                        <View style={styles.saleRight}>
                          <GoldButton
                            label="Evaluate & Approve"
                            variant="gold"
                            onPress={() => {
                              setSelectedVehicle(vehicle);
                              setEvalPrice(String(vehicle.price));
                            }}
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Add Worker Modal ── */}
      <Modal visible={isAddWorkerOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <ThemedText style={styles.modalTitle}>Add Sales Agent</ThemedText>
            
            <View style={styles.form}>
              <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                value={newWorkerName}
                onChangeText={setNewWorkerName}
                placeholder="e.g. Sipho Nkosi"
                placeholderTextColor="#666"
              />

              <ThemedText style={styles.inputLabel}>Role</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                value={newWorkerRole}
                onChangeText={setNewWorkerRole}
                placeholder="e.g. Sales Consultant"
                placeholderTextColor="#666"
              />

              <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                value={newWorkerEmail}
                onChangeText={setNewWorkerEmail}
                placeholder="sipho@ntokozocars.co.za"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalActions}>
              <GoldButton
                label="Cancel"
                variant="outline"
                onPress={() => setIsAddWorkerOpen(false)}
              />
              <GoldButton
                label="Add Agent"
                onPress={handleAddWorker}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Evaluation & Approval Modal ── */}
      <Modal visible={selectedVehicle !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <ThemedText style={styles.modalTitle}>Inspection & Valuation Checklist</ThemedText>
            
            {selectedVehicle && (
              <View style={styles.modalCarSummary}>
                <ThemedText style={styles.summaryTitle}>
                  {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.summaryDesc}>
                  Mileage: {selectedVehicle.mileage.toLocaleString('en-ZA')} km • Asking: R {selectedVehicle.price.toLocaleString('en-ZA')}
                </ThemedText>
              </View>
            )}

            <View style={styles.form}>
              <ThemedText style={styles.inputLabel}>Verified Market Valuation Price (ZAR)</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                value={evalPrice}
                onChangeText={setEvalPrice}
                placeholder="e.g. 480000"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />

              <ThemedText style={[styles.inputLabel, { marginTop: Spacing.two }]}>
                Mandatory Vehicle Health Checks:
              </ThemedText>

              {/* Checkbox Rows */}
              <ChecklistItem
                label="Engine, Gearbox & Transmission Verified"
                checked={engineChecked}
                onToggle={() => setEngineChecked(!engineChecked)}
              />
              <ChecklistItem
                label="Brakes, Tyres & Suspension Checked"
                checked={brakesChecked}
                onToggle={() => setBrakesChecked(!brakesChecked)}
              />
              <ChecklistItem
                label="Bodywork, Paint & Chassis Checked"
                checked={bodyworkChecked}
                onToggle={() => setBodyworkChecked(!bodyworkChecked)}
              />
              <ChecklistItem
                label="Electronics & Interior Checked"
                checked={interiorChecked}
                onToggle={() => setInteriorChecked(!interiorChecked)}
              />
              <ChecklistItem
                label="VIN & Service History Authenticated"
                checked={vinChecked}
                onToggle={() => setVinChecked(!vinChecked)}
              />
            </View>

            <View style={styles.modalActions}>
              <GoldButton
                label="Cancel"
                variant="outline"
                onPress={() => {
                  setSelectedVehicle(null);
                  setEngineChecked(false);
                  setBrakesChecked(false);
                  setBodyworkChecked(false);
                  setInteriorChecked(false);
                  setVinChecked(false);
                }}
              />
              <GoldButton
                label="Approve & Publish"
                disabled={!(engineChecked && brakesChecked && bodyworkChecked && interiorChecked && vinChecked && evalPrice)}
                onPress={handleApproveListing}
              />
            </View>
          </View>
        </View>
      </Modal>
    </NavigationLayout>
  );
}

function ChecklistItem({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onToggle} style={styles.checklistRow}>
      <View style={[styles.checkbox, { borderColor: theme.border, backgroundColor: checked ? Brand.gold : 'transparent' }]}>
        {checked && <ThemedText style={styles.checkboxTick}>✓</ThemedText>}
      </View>
      <ThemedText style={styles.checklistLabel}>{label}</ThemedText>
    </Pressable>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
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
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.small,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  tabButton: {
    paddingVertical: Spacing.two,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tabContent: {
    gap: Spacing.four,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  kpiCard: {
    flex: 1,
    minWidth: 200,
    padding: Spacing.four,
    borderRadius: Radius.large,
    borderWidth: 1,
    gap: Spacing.one,
    ...Shadow.card,
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  kpiSub: {
    fontSize: 11,
    color: '#666',
  },
  sectionCard: {
    borderRadius: Radius.large,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    ...Shadow.card,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionDesc: {
    fontSize: 13,
    marginTop: -Spacing.one,
  },
  leaderboardList: {
    gap: 0,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  agentInfo: {
    flex: 1,
    gap: 2,
  },
  agentName: {
    fontSize: 15,
    fontWeight: '700',
  },
  agentRole: {
    fontSize: 12,
  },
  agentEmail: {
    fontSize: 12,
  },
  agentStats: {
    alignItems: 'flex-end',
    gap: 2,
  },
  agentVol: {
    fontSize: 15,
    fontWeight: '700',
  },
  agentDeals: {
    fontSize: 12,
  },
  tableList: {
    gap: 0,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  saleMain: {
    flex: 1,
    gap: 3,
  },
  saleVehicle: {
    fontSize: 15,
    fontWeight: '700',
  },
  saleDetails: {
    fontSize: 12,
  },
  saleDate: {
    fontSize: 11,
  },
  saleRight: {
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  salePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.gold,
  },
  statusBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.small,
  },
  badgeCompleted: {
    backgroundColor: '#2EC4B615',
  },
  badgeFinance: {
    backgroundColor: Brand.gold + '15',
  },
  badgePending: {
    backgroundColor: '#E6394615',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.one,
    marginTop: 4,
  },
  smallBtn: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.small,
  },
  smallBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  actionHeader: {
    alignItems: 'flex-end',
  },
  inventoryImage: {
    width: 60,
    height: 45,
    borderRadius: Radius.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: Radius.large,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  form: {
    gap: Spacing.two,
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
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  modalCarSummary: {
    padding: Spacing.three,
    borderRadius: Radius.medium,
    backgroundColor: '#00000030',
    gap: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryDesc: {
    fontSize: 12,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: Spacing.two,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Radius.small,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxTick: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  checklistLabel: {
    fontSize: 13,
  },
  emptyContainer: {
    padding: Spacing.five,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
});
