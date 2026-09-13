import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { db } from '../../db';
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

  const fetchTransactions = async () => {
    try {
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

  const groupedTx = txList.reduce((acc, tx) => {
    // Basic grouping by Month-Year (e.g. 2026-09 -> September 2026)
    const dateObj = new Date(tx.date);
    const monthYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = { transactions: [], total: 0 };
    }
    acc[monthYear].transactions.push(tx);
    if (tx.type === 'expense') acc[monthYear].total -= tx.amount;
    if (tx.type === 'income') acc[monthYear].total += tx.amount;
    return acc;
  }, {});

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
                  <View key={tx.id} style={styles.txItem}>
                    <View style={styles.txLeft}>
                      <View style={styles.txIconWrapper}>
                        <Text style={styles.txIcon}>{tx.category === 'Salary' ? '💰' : tx.category === 'Food' ? '🍱' : tx.category === 'Jeepney' ? '🚌' : '💸'}</Text>
                      </View>
                      <View style={styles.txDetails}>
                        <Text style={styles.txCategory}>{tx.category}</Text>
                        <Text style={styles.txDate}>{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
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
                  </View>
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
