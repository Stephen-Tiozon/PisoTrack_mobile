import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { expoDb } from '../db';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../store/theme';
import { getColors } from '../theme/colors';

export default function ManageCategoriesScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const styles = createStyles(colors);

  const [categories, setCategories] = useState<any[]>([]);
  const [newIcon, setNewIcon] = useState('📌');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('expense');

  const fetchCategories = async () => {
    try {
      const cats = await expoDb.getAllAsync('SELECT * FROM categories ORDER BY type ASC, name ASC');
      setCategories(cats);
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const handleAddCategory = async () => {
    if (!newName.trim() || !newIcon.trim()) {
      Alert.alert("Invalid Input", "Please enter both an icon and a name.");
      return;
    }
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await expoDb.runAsync(
        'INSERT INTO categories (name, icon, type) VALUES (?, ?, ?)',
        [newName.trim(), newIcon.trim(), newType]
      );
      setNewName('');
      setNewIcon('📌');
      fetchCategories();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to add category.");
    }
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await expoDb.runAsync('DELETE FROM categories WHERE id = ?', [id]);
            fetchCategories();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.closeText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Manage Categories</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.list}>
        {categories.map((c) => (
          <View key={c.id} style={styles.categoryRow}>
            <View style={styles.categoryLeft}>
              <View style={[styles.iconWrapper, c.type === 'income' && { backgroundColor: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)' }]}>
                <Text style={styles.iconText}>{c.icon}</Text>
              </View>
              <View>
                <Text style={styles.categoryName}>{c.name}</Text>
                <Text style={styles.categoryType}>{c.type}</Text>
              </View>
            </View>
            <Pressable onPress={() => handleDelete(c.id, c.name)} hitSlop={10}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <View style={styles.addSection}>
        <Text style={styles.addTitle}>Add New Category</Text>
        
        <View style={styles.typeSelector}>
          <Pressable 
            style={[styles.typeBtn, newType === 'expense' && styles.typeBtnActiveExpense]}
            onPress={() => { Haptics.selectionAsync(); setNewType('expense'); }}
          >
            <Text style={[styles.typeText, newType === 'expense' && { color: '#FFF' }]}>Expense</Text>
          </Pressable>
          <Pressable 
            style={[styles.typeBtn, newType === 'income' && styles.typeBtnActiveIncome]}
            onPress={() => { Haptics.selectionAsync(); setNewType('income'); }}
          >
            <Text style={[styles.typeText, newType === 'income' && { color: '#FFF' }]}>Income</Text>
          </Pressable>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.iconInput}
            value={newIcon}
            onChangeText={setNewIcon}
            maxLength={2}
          />
          <TextInput
            style={styles.nameInput}
            value={newName}
            onChangeText={setNewName}
            placeholder="Category Name"
            placeholderTextColor={colors.textTertiary}
          />
        </View>
        
        <Pressable 
          style={({ pressed }) => [
            styles.submitBtnWrapper,
            pressed && { opacity: 0.8 }
          ]} 
          onPress={handleAddCategory}
        >
          <LinearGradient
            colors={newType === 'income' ? ['#10B981', '#059669'] : [colors.primary, '#6C63FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submitBtn}
          >
            <Text style={styles.submitBtnText}>Add Category</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
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
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  list: {
    flex: 1,
    paddingHorizontal: 10,
  },
  categoryRow: {
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
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.iconBg,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  categoryName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  categoryType: {
    color: colors.textTertiary,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  deleteText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  addSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 10,
  },
  addTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeBtnActiveExpense: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeBtnActiveIncome: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  typeText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  iconInput: {
    width: 60,
    height: 50,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.text,
    fontSize: 24,
    textAlign: 'center',
  },
  nameInput: {
    flex: 1,
    height: 50,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.text,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  submitBtnWrapper: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 20,
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
