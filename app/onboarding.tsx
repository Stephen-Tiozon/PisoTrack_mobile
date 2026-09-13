import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, KeyboardAvoidingView, Platform, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { expoDb } from '../db';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../store/theme';
import { getColors } from '../theme/colors';

export default function OnboardingScreen() {
  const { theme } = useThemeStore();
  const colors = getColors(theme);
  const styles = createStyles(colors);
  const [offlineMode, setOfflineMode] = useState(false);
  const [name, setName] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleStartOffline = async () => {
    if (name.trim().length === 0) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    try {
      await expoDb.runAsync(
        'INSERT INTO user_profile (name, has_onboarded) VALUES (?, ?)',
        [name.trim(), 1]
      );
      router.replace('/');
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Something went wrong saving your profile.");
    }
  };

  const handleCloudFeature = () => {
    Alert.alert(
      "Coming Soon!",
      "Cloud sync and online accounts are coming in a future update! For now, please use Offline Mode.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );
  };

  if (offlineMode) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
          <View style={styles.content}>
            <Text style={styles.title}>What's your name?</Text>
            <Text style={styles.subtitle}>We'll use this to greet you on your offline dashboard.</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={colors.textTertiary}
                value={name}
                onChangeText={setName}
                autoFocus
                returnKeyType="go"
                onSubmitEditing={handleStartOffline}
              />
            </View>
          </View>
  
          <Pressable 
            style={({ pressed }) => [
              styles.buttonWrapper,
              pressed && { opacity: 0.8 },
              name.trim().length === 0 && { opacity: 0.5 }
            ]} 
            onPress={handleStartOffline}
            disabled={name.trim().length === 0}
          >
            <LinearGradient
              colors={['#4F46E5', '#6C63FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Enter Offline Mode</Text>
            </LinearGradient>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Main Login Screen
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#4F46E5', '#6C63FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBox}
            >
              <Text style={styles.logoText}>₱</Text>
            </LinearGradient>
          </View>
          
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your PisoTrack account</Text>
          
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Pressable style={styles.forgotBtn} onPress={handleCloudFeature}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            <Pressable 
              style={({ pressed }) => [styles.buttonWrapper, pressed && { opacity: 0.8 }]} 
              onPress={handleCloudFeature}
            >
              <LinearGradient
                colors={['#4F46E5', '#6C63FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable 
              style={({ pressed }) => [styles.offlineBtn, pressed && { backgroundColor: 'rgba(255,255,255,0.05)' }]}
              onPress={() => setOfflineMode(true)}
            >
              <Text style={styles.offlineBtnText}>Continue without account (Offline Mode)</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <Pressable onPress={handleCloudFeature}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    color: colors.text,
    fontSize: 16,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  signUpText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  signUpLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  dividerText: {
    color: colors.textTertiary,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  offlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  offlineBtnText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 24,
  },
  buttonGradient: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  }
});
