import { StyleSheet, Text, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { db } from '../../db';
import { expenses } from '../../db/schema';
import { eq } from 'drizzle-orm';
import * as Haptics from 'expo-haptics';
import { useThemeStore } from '../../store/theme';
import { getColors } from '../../theme/colors';
import { PieChart, LineChart } from 'react-native-gifted-charts';

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
  const [sevenDayData, setSevenDayData] = useState<{value: number, label: string}[]>([]);
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
          
          // For 7 day data
          const today = new Date();
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 6);
          sevenDaysAgo.setHours(0, 0, 0, 0);

          const dailyTotals: Record<string, number> = {};
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          
          // Initialize last 7 days
          for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            dailyTotals[key] = 0;
          }

          allExpenses.forEach((e) => {
            let txDate: Date | null = null;
            let txMonth = -1;
            let txYear = -1;
            
            // Try robust parsing
            if (e.date.includes('-') || e.date.includes('T')) {
              txDate = new Date(e.date);
              if (!isNaN(txDate.getTime())) {
                txMonth = txDate.getMonth();
                txYear = txDate.getFullYear();
              }
            } else {
              const parts = e.date.split(' ');
              if (parts.length >= 3) {
                const monthStr = parts[0]; 
                const yearStr = parts[2]; 
                txMonth = monthNames.indexOf(monthStr);
                txYear = parseInt(yearStr, 10);
                
                // Construct a date to check 7 days ago
                txDate = new Date(`${monthStr} ${parts[1]}, ${yearStr}`);
                if (isNaN(txDate.getTime())) {
                  txDate = new Date(`${monthStr} ${parts[1]} ${yearStr}`);
                }
              } else {
                txDate = new Date(e.date);
                if (!isNaN(txDate.getTime())) {
                  txMonth = txDate.getMonth();
                  txYear = txDate.getFullYear();
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
            
            // 7 day logic
            if (txDate && txDate >= sevenDaysAgo && txDate <= today) {
               const key = `${txDate.getFullYear()}-${String(txDate.getMonth()+1).padStart(2, '0')}-${String(txDate.getDate()).padStart(2, '0')}`;
               if (dailyTotals[key] !== undefined) {
                 dailyTotals[key] += e.amount;
               }
            }
          });
          
          setTotalExpense(currentMonthTotal);
          setSavedAmount(lastMonthTotal - currentMonthTotal);
          
          const sortedData = Object.keys(grouped)
            .map(k => ({ category: k, amount: grouped[k] }))
            .sort((a, b) => b.amount - a.amount);
            
          setCategoryData(sortedData);
          
          const newSevenDayData = Object.keys(dailyTotals).sort().map(key => {
            const d = new Date(key);
            return {
              value: dailyTotals[key],
              label: daysOfWeek[d.getDay()]
            };
          });
          setSevenDayData(newSevenDayData);
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
  const displayYear = selectedDate.getFullYear() !== new Date().getFullYear() ? ` ${selectedDate.getFullYear()}` : ` ${selectedDate.getFullYear()}`;

  const barColors = [colors.primary, colors.success, colors.warning, colors.danger, '#8B5CF6'];

  const pieData = categoryData.slice(0, 5).map((item, index) => {
    return {
      value: item.amount,
      color: barColors[index % barColors.length],
    };
  });

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
      
      <View style={styles.cardsContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Total Spent</Text>
          <Text style={styles.cardValueRed}>{currencySymbol}{totalExpense.toLocaleString()}</Text>
          <Text style={styles.cardSubText}>{monthName}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Saved vs Last</Text>
          <Text style={[styles.cardValueGreen, { color: savedAmount >= 0 ? colors.success : colors.danger }]}>
            {savedAmount >= 0 ? '+' : '-'}{currencySymbol}{Math.abs(savedAmount).toLocaleString()}
          </Text>
          <Text style={[styles.cardSubText, { color: savedAmount >= 0 ? colors.success : colors.danger }]}>
            {savedAmount >= 0 ? '+ better' : '- worse'}
          </Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>Spending Breakdown</Text>
        <View style={styles.breakdownContent}>
          <View style={styles.chartWrapper}>
            {pieData.length > 0 ? (
              <PieChart
                donut
                innerRadius={50}
                radius={75}
                data={pieData}
                centerLabelComponent={() => {
                  return <View />
                }}
              />
            ) : (
              <View style={[styles.chartWrapper, { height: 150, justifyContent: 'center' }]}>
                <Text style={{ color: colors.textTertiary }}>No data</Text>
              </View>
            )}
          </View>
          <View style={styles.legendContainer}>
            {categoryData.slice(0, 5).map((item, index) => (
              <View key={item.category} style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: barColors[index % barColors.length] }]} />
                  <Text style={styles.legendText}>{item.category}</Text>
                </View>
                <Text style={styles.legendAmount}>{currencySymbol}{item.amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>7-Day Spending</Text>
        <View style={styles.lineChartContainer}>
          <LineChart
            data={sevenDayData}
            color={colors.primary}
            thickness={3}
            dataPointsColor={colors.primary}
            hideYAxisText
            hideRules
            xAxisLabelTextStyle={{ color: colors.textTertiary, fontSize: 11, textAlign: 'center' }}
            xAxisColor={colors.border}
            yAxisColor="transparent"
            height={140}
            width={Dimensions.get('window').width - 90}
            initialSpacing={20}
            endSpacing={20}
            isAnimated
            curved
            spacing={(Dimensions.get('window').width - 100) / 6}
          />
        </View>
      </View>

      <View style={[styles.sectionCard, { marginBottom: 40 }]}>
        <Text style={styles.sectionCardTitle}>Top Categories</Text>
        <View style={styles.topCategoriesContainer}>
          {categoryData.length === 0 ? (
            <Text style={{ color: colors.textTertiary }}>No data for this month.</Text>
          ) : (
            categoryData.slice(0, 5).map((item, index) => {
              const percentage = totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;
              return (
                <View key={item.category} style={styles.categoryProgressRow}>
                  <View style={styles.categoryLabelWrapper}>
                    <Text style={styles.categoryEmoji}>{CATEGORY_ICONS[item.category] || '📦'}</Text>
                    <Text style={styles.categoryName} numberOfLines={1}>{item.category}</Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: barColors[index % barColors.length] }]} />
                  </View>
                  <Text style={styles.categoryAmountText}>{currencySymbol}{item.amount.toLocaleString()}</Text>
                </View>
              );
            })
          )}
        </View>
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
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  monthSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  monthSelector: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  monthArrow: {
    padding: 6,
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
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    color: colors.textTertiary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  cardValueRed: {
    color: colors.danger,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  cardValueGreen: {
    color: colors.success,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  cardSubText: {
    color: colors.textTertiary,
    fontSize: 12,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionCardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  breakdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartWrapper: {
    paddingLeft: 0,
    alignItems: 'center',
  },
  legendContainer: {
    flex: 1,
    paddingLeft: 24,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    color: colors.text,
    fontSize: 13,
  },
  legendAmount: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  lineChartContainer: {
    marginTop: 10,
    paddingRight: 10,
    alignItems: 'center',
  },
  topCategoriesContainer: {
    marginTop: 5,
  },
  categoryProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  categoryLabelWrapper: {
    width: 90,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  progressBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  categoryAmountText: {
    color: colors.textSecondary,
    fontSize: 13,
    width: 50,
    textAlign: 'right',
    fontWeight: '600',
  },
});
