import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { db, expoDb } from '../../db';
import { expenses } from '../../db/schema';
import { desc } from 'drizzle-orm';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/theme';
import { getColors } from '../../theme/colors';

export default function TransactionsScreen() {
  const { theme, currencySymbol } = useThemeStore();
  const colors = getColors(theme);
  const styles = createStyles(colors);
  const [txList, setTxList] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  const fetchTransactions = async () => {
    try {
      const cats: any = await expoDb.getAllAsync('SELECT * FROM categories');
      const map: Record<string, string> = {};
      cats.forEach((c: any) => { map[c.name] = c.icon; });
      setCategoryMap(map);

      const result = await db.select().from(expenses).orderBy(desc(expenses.id));
      setTxList(result);
    } catch (e) {
      console.error("Failed to fetch expenses:", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  const filters = ['All', 'Today', 'This Week', 'This Month'];

  const getStatus = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today ? 'Pending' : 'Synced';
  };

  const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
    
    // Try robust parsing for "Sep 14, 2026"
    const parts = dateStr.split(' ');
    if (parts.length >= 3) {
      const monthStr = parts[0];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames.indexOf(monthStr);
      const day = parseInt(parts[1].replace(',', ''), 10);
      const year = parseInt(parts[2], 10);
      if (month !== -1 && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return new Date();
  };

  const filteredTx = txList.filter(tx => {
    if (filter === 'All') return true;
    const txDate = parseDate(tx.date);
    const today = new Date();
    if (filter === 'Today') {
      return txDate.toDateString() === today.toDateString();
    }
    if (filter === 'This Week') {
      const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
      return txDate >= firstDay;
    }
    if (filter === 'This Month') {
      const realToday = new Date();
      return txDate.getMonth() === realToday.getMonth() && txDate.getFullYear() === realToday.getFullYear();
    }
    return true;
  });

  const groupedTx = filteredTx.reduce((acc, tx) => {
    // Basic grouping by Month-Year (e.g. 2026-09 -> September 2026)
    const dateObj = parseDate(tx.date);
    const monthYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = { transactions: [], total: 0 };
    }
    acc[monthYear].transactions.push(tx);
    if (tx.type === 'expense') acc[monthYear].total -= tx.amount;
    if (tx.type === 'income') acc[monthYear].total += tx.amount;
    return acc;
  }, {} as Record<string, any>);

  const handleManageTx = (tx: any) => {
    Haptics.selectionAsync();
    Alert.alert(
      "Manage Transaction",
      `What would you like to do with this ${currencySymbol}${tx.amount} ${tx.category} transaction?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Edit", 
          onPress: () => router.push({ pathname: '/add', params: { id: tx.id, type: tx.type } }) 
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              await expoDb.runAsync('DELETE FROM expenses WHERE id = ?', [tx.id]);
              fetchTransactions();
            } catch (e) {
              console.error("Failed to delete", e);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={24} color={colors.textSecondary} />
          <Ionicons name="filter-outline" size={24} color={colors.textSecondary} style={{ marginLeft: 16 }} />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filters.map((f) => {
            const isActive = filter === f;
            return (
              <Pressable
                key={f}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setFilter(f);
                }}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{f}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {Object.keys(groupedTx).length === 0 && (
          <Text style={{ color: colors.textTertiary, textAlign: 'center', marginTop: 40 }}>No transactions found.</Text>
        )}
        
        {Object.keys(groupedTx).map((monthGroup) => {
          const group = groupedTx[monthGroup];
          return (
            <View key={monthGroup} style={styles.groupContainer}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{monthGroup}</Text>
                <Text style={group.total >= 0 ? styles.groupTotalPos : styles.groupTotalNeg}>
                  {group.total >= 0 ? '+' : '-'}{currencySymbol}{Math.abs(group.total).toFixed(0)}
                </Text>
              </View>

              {group.transactions.map((tx: any) => {
                const status = getStatus(tx.date);
                return (
                  <Pressable key={tx.id} style={styles.txItem} onPress={() => handleManageTx(tx)}>
                    <View style={styles.txLeft}>
                      <View style={styles.txIconWrapper}>
                        <Text style={styles.txIcon}>{categoryMap[tx.category] || '💸'}</Text>
                      </View>
                      <View style={styles.txDetails}>
                        <Text style={styles.txCategory}>{tx.category}</Text>
                        <Text style={styles.txDate}>{parseDate(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                      </View>
                    </View>
                    <View style={styles.txRight}>
                      <Text style={tx.type === 'income' ? styles.txAmountPos : styles.txAmountNeg}>
                        {tx.type === 'income' ? '+' : '-'}{currencySymbol}{tx.amount}
                      </Text>
                      {status === 'Synced' ? (
                        <View style={styles.pillSynced}>
                          <Text style={styles.pillTextSynced}>✓ Synced</Text>
                        </View>
                      ) : (
                        <View style={styles.pillPending}>
                          <Text style={styles.pillTextPending}>⌛ Pending</Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterContainer: {
    marginBottom: 24,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  groupContainer: {
    marginBottom: 32,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupTitle: {
    color: colors.textTertiary,
    fontSize: 14,
    fontWeight: '700',
  },
  groupTotalPos: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
  },
  groupTotalNeg: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  txItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  txIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.iconBg,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txIcon: {
    fontSize: 20,
  },
  txDetails: {
    justifyContent: 'center',
  },
  txCategory: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  txDate: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmountPos: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  txAmountNeg: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  pillSynced: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  pillTextSynced: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '700',
  },
  pillPending: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  pillTextPending: {
    color: colors.warning,
    fontSize: 10,
    fontWeight: '700',
  },
});
