import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { db } from '../../db';
import { expenses } from '../../db/schema';
import { eq } from 'drizzle-orm';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '../../store/theme';
import { getColors } from '../../theme/colors';

const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍱',
  Transport: '🚌',
  Shopping: '🛍️',
  Bills: '🧾',
  Entertainment: '🎟️',
  Health: '⚕️',
  Jeepney: '🚌',
  Other: '📦'
};

export default function ReportsScreen() {
  const { theme, currencySymbol } = useThemeStore();
  const colors = getColors(theme);
  const styles = createStyles(colors);
  const [categoryData, setCategoryData] = useState<{category: string, amount: number}[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [savedAmount, setSavedAmount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      const fetchReports = async () => {
        try {
          const allExpenses = await db.select().from(expenses).where(eq(expenses.type, 'expense'));
          
          const currentMonth = selectedDate.getMonth();
          const currentYear = selectedDate.getFullYear();
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          
          let currentMonthTotal = 0;
          let lastMonthTotal = 0;
          const grouped: Record<string, number> = {};
          
          allExpenses.forEach((e) => {
            let txMonth = -1;
            let txYear = -1;
            
            // Try robust parsing
            if (e.date.includes('-') || e.date.includes('T')) {
              // ISO or YYYY-MM-DD
              const d = new Date(e.date);
              if (!isNaN(d.getTime())) {
                txMonth = d.getMonth();
                txYear = d.getFullYear();
              }
            } else {
              // 'Sep 14, 2026' format
              const parts = e.date.split(' ');
              if (parts.length >= 3) {
                const monthStr = parts[0]; // 'Sep'
                const yearStr = parts[2]; // '2026'
                txMonth = monthNames.indexOf(monthStr);
                txYear = parseInt(yearStr, 10);
              } else {
                // Fallback parsing just in case
                const d = new Date(e.date);
                if (!isNaN(d.getTime())) {
                  txMonth = d.getMonth();
                  txYear = d.getFullYear();
                }
              }
            }

            const isCurrent = txMonth === currentMonth && txYear === currentYear;
            const isLast = txMonth === lastMonth && txYear === lastMonthYear;

            if (isCurrent) {
              currentMonthTotal += e.amount;
              grouped[e.category] = (grouped[e.category] || 0) + e.amount;
            } else if (isLast) {
              lastMonthTotal += e.amount;
            }
          });
          
          setTotalExpense(currentMonthTotal);
          setSavedAmount(lastMonthTotal - currentMonthTotal);
          
          const sortedData = Object.keys(grouped)
            .map(k => ({ category: k, amount: grouped[k] }))
            .sort((a, b) => b.amount - a.amount);
            
          setCategoryData(sortedData);
        } catch (err) {
          console.error("Failed to fetch reports:", err);
        }
      };
      fetchReports();
    }, [selectedDate])
  );

  const handlePrevMonth = () => {
    Haptics.selectionAsync();
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    Haptics.selectionAsync();
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[selectedDate.getMonth()];
  const displayYear = selectedDate.getFullYear() !== new Date().getFullYear() ? ` '${selectedDate.getFullYear().toString().slice(2)}` : '';

  const maxCategoryAmount = categoryData.length > 0 ? categoryData[0].amount : 1;
  const barColors = [colors.primary, colors.success, colors.warning, colors.danger, '#8B5CF6'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <View style={styles.monthSelectorContainer}>
          <Pressable onPress={handlePrevMonth} style={styles.monthArrow}>
            <Text style={styles.monthArrowText}>‹</Text>
          </Pressable>
          <Text style={styles.monthSelector}>{monthName}{displayYear}</Text>
          <Pressable onPress={handleNextMonth} style={styles.monthArrow}>
            <Text style={styles.monthArrowText}>›</Text>
          </Pressable>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.chartBox}>
          {categoryData.length === 0 ? (
            <Text style={{ color: colors.textTertiary }}>No data to chart</Text>
          ) : (
            <View style={styles.chartInner}>
              {categoryData.slice(0, 5).map((item, index) => {
                const heightPercentage = Math.max(10, (item.amount / maxCategoryAmount) * 100);
                return (
                  <View key={item.category} style={styles.barColumn}>
                    <Text style={styles.barValue}>{Math.round((item.amount / totalExpense) * 100)}%</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { height: `${heightPercentage}%`, backgroundColor: barColors[index % barColors.length] }]} />
                    </View>
                    <Text style={styles.barLabel}>{CATEGORY_ICONS[item.category] || '📦'}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.cardsContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Total Spent</Text>
          <Text style={styles.cardValue}>{currencySymbol}{totalExpense.toFixed(0)}</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFillRed} />
          </View>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Saved vs Last</Text>
          <Text style={[styles.cardValue, { color: savedAmount >= 0 ? colors.success : colors.danger }]}>
            {savedAmount >= 0 ? '+' : '-'}{currencySymbol}{Math.abs(savedAmount).toFixed(0)}
          </Text>
          <View style={styles.progressTrack}>
            {savedAmount >= 0 ? (
              <View style={styles.progressFillGreen} />
            ) : (
              <View style={styles.progressFillRed} />
            )}
          </View>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>By Category</Text>
      <View style={styles.categoryList}>
        {categoryData.length === 0 ? (
          <Text style={{ color: colors.textTertiary, textAlign: 'center', marginTop: 20 }}>No data for this month.</Text>
        ) : (
          categoryData.map((item, index) => {
            const percentage = totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;
            
            return (
              <View key={item.category} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={styles.categoryIconWrapper}>
                    <Text style={styles.categoryIcon}>{CATEGORY_ICONS[item.category] || '📦'}</Text>
                  </View>
                  <View style={styles.categoryDetails}>
                    <Text style={styles.categoryName}>{item.category}</Text>
                    <Text style={styles.categoryCount}>{percentage.toFixed(0)}% of total</Text>
                  </View>
                </View>
                <Text style={styles.categoryAmount}>{currencySymbol}{item.amount.toFixed(0)}</Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  monthSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  monthSelector: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  monthArrow: {
    padding: 8,
  },
  monthArrowText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    color: colors.textTertiary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFillRed: {
    height: '100%',
    backgroundColor: colors.danger,
    borderRadius: 4,
  },
  progressFillGreen: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  chartBox: {
    height: 220,
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  chartInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    width: 40,
  },
  barValue: {
    color: colors.textTertiary,
    fontSize: 10,
    marginBottom: 8,
    fontWeight: '600',
  },
  barTrack: {
    flex: 1,
    width: 12,
    backgroundColor: colors.border,
    borderRadius: 999,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 999,
  },
  barLabel: {
    marginTop: 12,
    fontSize: 18,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryDetails: {
    justifyContent: 'center',
  },
  categoryName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  categoryCount: {
    color: colors.textTertiary,
    fontSize: 12,
    marginTop: 4,
  },
  categoryAmount: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
