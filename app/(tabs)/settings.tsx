import { StyleSheet, Text, View, Pressable, Alert, ScrollView, Linking, Platform } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { expoDb } from '../../db';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useThemeStore } from '../../store/theme';
import { getColors } from '../../theme/colors';

export default function SettingsScreen() {
  const [userName, setUserName] = useState("Friend");
  
  // Local preferences state
  const [notifications, setNotifications] = useState(true);
  const [weekStarts, setWeekStarts] = useState('Monday');

  const { theme, toggleTheme: toggleGlobalTheme, currencyCode, currencySymbol, setCurrency } = useThemeStore();
  const colors = getColors(theme);
  const styles = createStyles(colors);

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          const profile = await expoDb.getAllAsync('SELECT * FROM user_profile LIMIT 1');
          if (profile.length > 0) {
            setUserName((profile[0] as any).name);
          }
        } catch (e) {
          console.error("Failed to fetch profile", e);
        }
      };
      fetchProfile();
    }, [])
  );

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing will be fully supported in the next update. For now, you can reset your data to choose a new name.");
  };

  const handlePassword = () => {
    Alert.alert("Offline Mode", "You are currently in Offline Mode. No password is required.");
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    Haptics.selectionAsync();
  };

  const handleSyncStatus = () => {
    // Disabled as requested
  };

  const handleExportData = async () => {
    try {
      const expenses = await expoDb.getAllAsync('SELECT * FROM expenses ORDER BY date DESC');
      
      let csvContent = "ID,Amount,Category,Date\n";
      expenses.forEach((row: any) => {
        csvContent += `${row.id},${row.amount},"${row.category}","${row.date}"\n`;
      });

      const fileName = `PisoTrack_Export_${new Date().getTime()}.csv`;
      const filePath = FileSystem.cacheDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(filePath, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, { UTI: 'public.comma-separated-values-text', mimeType: 'text/csv' });
      } else {
        Alert.alert("Export Error", "Sharing is not available on this device.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Export Error", "Failed to export data.");
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Danger Zone",
      "Are you sure you want to delete all your financial data and your profile? This action is permanent and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Wipe Everything", 
          style: "destructive",
          onPress: async () => {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              await expoDb.runAsync('DELETE FROM expenses');
              await expoDb.runAsync('DELETE FROM user_profile');
              router.replace('/'); 
            } catch (err) {
              console.error("Reset failed", err);
              alert("Something went wrong wiping data.");
            }
          }
        }
      ]
    );
  };

  const cycleCurrency = () => {
    Haptics.selectionAsync();
    const opts = [
      { code: 'PHP', symbol: '₱' },
      { code: 'USD', symbol: '$' },
      { code: 'EUR', symbol: '€' }
    ];
    const currentIndex = opts.findIndex(o => o.code === currencyCode);
    const next = opts[(currentIndex + 1) % opts.length];
    setCurrency(next.code, next.symbol);
  };

  const handleToggleTheme = () => {
    Haptics.selectionAsync();
    toggleGlobalTheme();
  };

  const toggleWeekStarts = () => {
    Haptics.selectionAsync();
    setWeekStarts(weekStarts === 'Monday' ? 'Sunday' : 'Monday');
  };

  const handleVersion = () => {
    Alert.alert("PisoTrack", "Version 1.0.0 (Offline Edition)");
  };

  const handlePrivacy = () => {
    Linking.openURL("https://pisotrack.ph/privacy").catch(() => {
      Alert.alert("Link Error", "Could not open browser.");
    });
  };

  const handleFeedback = () => {
    Linking.openURL("mailto:support@pisotrack.ph?subject=PisoTrack Feedback").catch(() => {
      Alert.alert("Email Error", "Could not open email client.");
    });
  };

  const handleRate = () => {
    Alert.alert("Thank You!", "Thanks for using PisoTrack! App Store links coming soon.");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.profileCard}>
        <LinearGradient
          colors={['#4F46E5', '#6C63FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
        </LinearGradient>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileEmail}>offline_user@local</Text>
        </View>
        <Pressable style={styles.editBtn} onPress={handleEditProfile}>
          <Text style={styles.editBtnText}>Edit</Text>
        </Pressable>
      </View>

      {/* ACCOUNT SECTION */}
      <Text style={styles.sectionHeader}>ACCOUNT</Text>
      <View style={styles.cardGroup}>
        <Pressable style={styles.listItem} onPress={handleEditProfile}>
          <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.listIcon} />
          <Text style={styles.listTitle}>Profile</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.borderLight} />
        </Pressable>
        <View style={styles.divider} />
        
        <Pressable style={styles.listItem} onPress={handlePassword}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.warning} style={styles.listIcon} />
          <Text style={styles.listTitle}>Change Password</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.borderLight} />
        </Pressable>
        <View style={styles.divider} />
        
        <Pressable style={styles.listItem} onPress={toggleNotifications}>
          <Ionicons name="notifications-outline" size={20} color={colors.warning} style={styles.listIcon} />
          <Text style={styles.listTitle}>Notifications</Text>
          <Text style={styles.listValue}>{notifications ? 'On' : 'Off'}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.borderLight} />
        </Pressable>
      </View>

      {/* DATA SECTION */}
      <Text style={styles.sectionHeader}>DATA</Text>
      <View style={styles.cardGroup}>
        <Pressable style={styles.listItem} onPress={handleSyncStatus}>
          <Ionicons name="cloud-done-outline" size={20} color={colors.textSecondary} style={styles.listIcon} />
          <Text style={styles.listTitle}>Sync Status</Text>
          <Text style={styles.listValue}>Offline</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.borderLight} />
        </Pressable>
        <View style={styles.divider} />
        
        <Pressable style={styles.listItem} onPress={handleExportData}>
          <Ionicons name="download-outline" size={20} color={colors.primary} style={styles.listIcon} />
          <Text style={styles.listTitle}>Export Data</Text>
          <Text style={styles.listValue}>CSV</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.borderLight} />
        </Pressable>
        <View style={styles.divider} />
        
        <Pressable style={styles.listItem} onPress={handleReset}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} style={styles.listIcon} />
          <Text style={styles.listTitle}>Clear Local Data</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.borderLight} />
        </Pressable>
      </View>

      {/* PREFERENCES SECTION */}
      <Text style={styles.sectionHeader}>PREFERENCES</Text>
      <View style={styles.cardGroup}>
        <Pressable style={styles.listItem} onPress={cycleCurrency}>
          <Ionicons name="cash-outline" size={20} color={colors.success} style={styles.listIcon} />
          <Text style={styles.listTitle}>Currency</Text>
          <Text style={styles.listValue}>{currencyCode} {currencySymbol}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.borderLight} />
        </Pressable>
        <View style={styles.divider} />
        
        <Pressable style={styles.listItem} onPress={handleToggleTheme}>
          <Ionicons name="moon-outline" size={20} color={colors.warning} style={styles.listIcon} />
          <Text style={styles.listTitle}>Theme</Text>
          <Text style={styles.listValue}>{theme === 'dark' ? 'Dark' : 'Light'}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.borderLight} />
        </Pressable>
        <View style={styles.divider} />
        
        <Pressable style={styles.listItem} onPress={toggleWeekStarts}>
          <Ionicons name="calendar-outline" size={20} color={colors.danger} style={styles.listIcon} />
          <Text style={styles.listTitle}>Week Starts</Text>
          <Text style={styles.listValue}>{weekStarts}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.borderLight} />
        </Pressable>
      </View>

      {/* ABOUT SECTION */}
      <Text style={styles.sectionHeader}>ABOUT</Text>
      <View style={styles.cardGroup}>
        <Pressable style={styles.listItem} onPress={handleVersion}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} style={styles.listIcon} />
          <Text style={styles.listTitle}>Version</Text>
          <Text style={styles.listValue}>v1.0.0</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.borderLight} />
        </Pressable>
        <View style={styles.divider} />
        
        <Pressable style={styles.listItem} onPress={handlePrivacy}>
          <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} style={styles.listIcon} />
          <Text style={styles.listTitle}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.borderLight} />
        </Pressable>
        <View style={styles.divider} />
        
        <Pressable style={styles.listItem} onPress={handleFeedback}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.textSecondary} style={styles.listIcon} />
          <Text style={styles.listTitle}>Send Feedback</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.borderLight} />
        </Pressable>
        <View style={styles.divider} />

        <Pressable style={styles.listItem} onPress={handleRate}>
          <Ionicons name="star-outline" size={20} color={colors.warning} style={styles.listIcon} />
          <Text style={styles.listTitle}>Rate the App</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.borderLight} />
        </Pressable>
      </View>

    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 20,
    marginBottom: 32,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFF', // Always white on gradient
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    color: colors.textTertiary,
    fontSize: 13,
  },
  editBtn: {
    backgroundColor: colors.successLight, // using light tint for edit
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  editBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  cardGroup: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    marginBottom: 32,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  listIcon: {
    marginRight: 16,
  },
  listTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  listValue: {
    color: colors.textTertiary,
    fontSize: 14,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 52,
  },
});
