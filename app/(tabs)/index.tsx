import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { db, expoDb } from '../../db';
import { expenses } from '../../db/schema';
import { desc } from 'drizzle-orm';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../store/theme';
import { getColors } from '../../theme/colors';

export default function TabOneScreen() {
  const { theme, currencySymbol } = useThemeStore();
  const colors = getColors(theme);
  const styles = createStyles(colors);
  const [txList, setTxList] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [userName, setUserName] = useState("Friend");

  const fetchData = async () => {
    try {
      const profile = await expoDb.getAllAsync('SELECT * FROM user_profile LIMIT 1');
      if (profile.length > 0) {
        setUserName((profile[0] as any).name);
      }

      const result = await db.select().from(expenses).orderBy(desc(expenses.id));
      setTxList(result);
      
      let income = 0;
      let exp = 0;
      result.forEach((t) => {
        if (t.type === 'income') {
          income += t.amount;
        } else {
          exp += t.amount;
        }
      });
      setTotalIncome(income);
      setTotalExpenses(exp);
      setTotalBalance(income - exp);
    } catch (e) {
      console.error("Failed to fetch expenses:", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <Text style={styles.name}>{userName}</Text>
        </View>
        <LinearGradient
          colors={['#4F46E5', '#6C63FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarBg}
        >
          <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
        </LinearGradient>
      </View>

      {/* Balance Card */}
      <LinearGradient
        colors={['#4F46E5', '#6C63FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>{currencySymbol} {totalBalance.toFixed(2)}</Text>
        
        <View style={styles.cashFlow}>
          <View style={styles.flowItem}>
            <Text style={styles.flowLabel}>↑ Income</Text>
            <Text style={styles.flowAmountIncome}>{currencySymbol}{totalIncome.toFixed(0)}</Text>
          </View>
          <View style={styles.flowItem}>
            <Text style={styles.flowLabel}>↓ Expenses</Text>
            <Text style={styles.flowAmountExpense}>{currencySymbol}{totalExpenses.toFixed(0)}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Link href="/add" asChild>
          <Pressable style={styles.actionBtn}>
            <View style={styles.actionIcon}>
              <Text style={{ fontSize: 24 }}>➕</Text>
            </View>
            <Text style={styles.actionLabel}>Add</Text>
          </Pressable>
        </Link>
        <Link href="/add?type=income" asChild>
          <Pressable style={styles.actionBtn}>
            <View style={styles.actionIcon}>
              <Text style={{ fontSize: 24 }}>📥</Text>
            </View>
            <Text style={styles.actionLabel}>Income</Text>
          </Pressable>
        </Link>
        <Link href="/reports" asChild>
          <Pressable style={styles.actionBtn}>
            <View style={styles.actionIcon}>
              <Text style={{ fontSize: 24 }}>📊</Text>
            </View>
            <Text style={styles.actionLabel}>Reports</Text>
          </Pressable>
        </Link>
      </View>

      {/* Recent Transactions */}
      <Text style={styles.sectionTitle}>Recent</Text>

      <View style={styles.transactionsList}>
        {txList.length === 0 && (
          <Text style={{ color: colors.textTertiary, textAlign: 'center', marginTop: 20 }}>No transactions yet.</Text>
        )}
        {txList.map((tx) => (
          <View key={tx.id} style={styles.txItem}>
            <View style={styles.txLeft}>
              <View style={styles.txIconWrapper}>
                <Text style={styles.txIcon}>{tx.category === 'Salary' ? '💰' : tx.category === 'Food' ? '🍱' : tx.category === 'Jeepney' ? '🚌' : '💸'}</Text>
              </View>
              <View style={styles.txDetails}>
                <Text style={styles.txCategory}>{tx.category}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
            </View>
            <Text style={tx.type === 'income' ? styles.txAmountPos : styles.txAmountNeg}>
              {tx.type === 'income' ? '+' : '-'}{currencySymbol}{tx.amount}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 2,
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  avatarBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  balanceCard: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)', // keep white for gradient overlay
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#FFF', // keep white for gradient overlay
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 16,
  },
  cashFlow: {
    flexDirection: 'row',
    gap: 24,
  },
  flowItem: {},
  flowLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    marginBottom: 4,
  },
  flowAmountIncome: {
    color: '#86EFAC',
    fontSize: 16,
    fontWeight: '600',
  },
  flowAmountExpense: {
    color: '#FCA5A5',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 24,
    marginBottom: 30,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.iconBg,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  transactionsList: {
    paddingBottom: 40,
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
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.iconBg,
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
    fontWeight: '600',
  },
  txDate: {
    color: colors.textTertiary,
    fontSize: 12,
    marginTop: 4,
  },
  txAmountPos: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '600',
  },
  txAmountNeg: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
});
