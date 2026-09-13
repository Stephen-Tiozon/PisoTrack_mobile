import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { db, expoDb } from '../db';
import { expenses } from '../db/schema';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../store/theme';
import { getColors } from '../theme/colors';

const EXPENSE_CATEGORIES = [
  { id: 'Jeepney', icon: '🚌' },
  { id: 'Food', icon: '🍔' },
  { id: 'Groceries', icon: '🛒' },
  { id: 'Shopping', icon: '🛍️' },
  { id: 'Bills', icon: '💡' },
];

const INCOME_CATEGORIES = [
  { id: 'Salary', icon: '💼' },
  { id: 'Freelance', icon: '💻' },
  { id: 'Gift', icon: '🎁' },
  { id: 'Investment', icon: '📈' },
];

export default function AddExpenseScreen() {
  const { theme, currencySymbol } = useThemeStore();
  const colors = getColors(theme);
  const styles = createStyles(colors);

  const params = useLocalSearchParams();
  const isIncome = params.type === 'income';
  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const [amount, setAmount] = useState('0');
  const [category, setCategory] = useState(categories[0].id);

  const handleKey = (k: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (k === '⌫') {
      setAmount((a) => (a.length > 1 ? a.slice(0, -1) : '0'));
    } else if (k === '.' && amount.includes('.')) {
      return;
    } else {
      setAmount((a) => (a === '0' ? k : a + k));
    }
  };

  const submitExpense = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const val = parseFloat(amount);
    if (val > 0) {
      try {
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        await expoDb.runAsync(
          'INSERT INTO expenses (amount, category, date, type, synced_status) VALUES (?, ?, ?, ?, ?)',
          [val, category, dateStr, isIncome ? 'income' : 'expense', 0]
        );
      } catch (err) {
        console.error("Failed to insert record:", err);
      }
    }
    router.back();
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.closeText}>←</Text>
        </Pressable>
        <Text style={styles.title}>{isIncome ? 'Add Income' : 'Add Expense'}</Text>
        <Pressable onPress={submitExpense} hitSlop={10}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>

      <View style={styles.amountContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.currency, isIncome && { color: 'rgba(16,185,129,0.5)' }]}>{currencySymbol}</Text>
          <Text style={[styles.amount, isIncome && { color: '#10B981' }]}>{amount}</Text>
        </View>
        <View style={[styles.amountUnderline, isIncome && { backgroundColor: '#10B981' }]} />
      </View>

      <View style={styles.categorySelectorWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((c) => {
            const isSelected = category === c.id;
            return (
              <Pressable 
                key={c.id} 
                style={[
                  styles.categoryBadge, 
                  isSelected && styles.categoryBadgeSelected,
                  isSelected && isIncome && { backgroundColor: 'rgba(16,185,129,0.2)', borderColor: 'rgba(16,185,129,0.5)' }
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setCategory(c.id);
                }}
              >
                <Text style={[
                  styles.categoryText, 
                  isSelected && styles.categoryTextSelected,
                  isSelected && isIncome && { color: '#10B981' }
                ]}>
                  {c.icon} {c.id}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.numpad}>
        {keys.map((k) => (
          <Pressable
            key={k}
            style={({ pressed }) => [
              styles.key,
              pressed && styles.keyPressed,
            ]}
            onPress={() => handleKey(k)}
          >
            <Text style={styles.keyText}>{k}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable 
        style={({ pressed }) => [
          styles.submitBtnWrapper,
          pressed && { opacity: 0.8 }
        ]} 
        onPress={submitExpense}
      >
        <LinearGradient
          colors={isIncome ? ['#10B981', '#059669'] : [colors.primary, '#6C63FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.submitBtn}
        >
          <Text style={styles.submitBtnText}>Save {isIncome ? 'Income' : 'Expense'}</Text>
        </LinearGradient>
      </Pressable>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  closeText: {
    color: colors.text,
    fontSize: 24,
  },
  doneText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  amountContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  currency: {
    color: colors.textSecondary,
    fontSize: 24,
    marginRight: 8,
  },
  amount: {
    color: colors.text,
    fontSize: 48,
    fontWeight: '800',
  },
  amountUnderline: {
    width: 80,
    height: 3,
    backgroundColor: colors.primary,
    marginTop: 10,
    borderRadius: 2,
  },
  categorySelectorWrapper: {
    height: 50,
    marginBottom: 20,
  },
  categoryScroll: {
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 10,
  },
  categoryBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  categoryBadgeSelected: {
    backgroundColor: colors.primary + '33',
    borderColor: colors.primary,
  },
  categoryText: {
    color: colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryTextSelected: {
    color: colors.primary,
  },
  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 20,
  },
  key: {
    width: '31%',
    aspectRatio: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  keyPressed: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  keyText: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '600',
  },
  submitBtnWrapper: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  submitBtn: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
