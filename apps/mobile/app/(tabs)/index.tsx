import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  View,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSession, signOut } from "@/lib/auth-client";
import { useHiringProcesses } from "@/hooks/use-hiring-processes";

const STATUS_COLORS: Record<string, string> = {
  "first-contact": "#3b82f6",
  ongoing: "#22c55e",
  "on-hold": "#f59e0b",
  rejected: "#ef4444",
  "dropped-out": "#6b7280",
  hired: "#10b981",
  "offer-made": "#8b5cf6",
  "offer-accepted": "#06b6d4",
};

export default function HomeScreen() {
  const { data: session, isPending: sessionPending } = useSession();
  const { data: hiringData, isPending: hiringPending, error, refetch } = useHiringProcesses();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (err) {
      Alert.alert("Error", "Failed to sign out");
      console.error(err);
    }
  };

  if (sessionPending) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ActivityIndicator size="large" color="#0a7ea4" />
        </ThemedView>
      </SafeAreaView>
    );
  }

  const hiringProcesses = hiringData?.data ?? [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedView>
            <ThemedText type="title">My Hirings</ThemedText>
            {session?.user && <ThemedText style={styles.email}>{session.user.email}</ThemedText>}
          </ThemedView>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <ThemedText style={styles.logoutButtonText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {hiringPending ? (
          <ThemedView style={styles.centered}>
            <ActivityIndicator size="large" color="#0a7ea4" />
            <ThemedText style={styles.loadingText}>Loading hiring processes...</ThemedText>
          </ThemedView>
        ) : error ? (
          <ThemedView style={styles.centered}>
            <ThemedText style={styles.errorText}>Failed to load hiring processes</ThemedText>
            <ThemedText style={styles.errorDetail}>{error.message}</ThemedText>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : hiringProcesses.length === 0 ? (
          <ThemedView style={styles.centered}>
            <ThemedText style={styles.emptyText}>No hiring processes yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Start tracking your job applications!
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={hiringProcesses}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <View style={styles.cardHeader}>
                  <ThemedText type="subtitle" style={styles.companyName}>
                    {item.companyName}
                  </ThemedText>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: STATUS_COLORS[item.status] || "#6b7280" },
                    ]}
                  >
                    <ThemedText style={styles.statusText}>
                      {item.status.replace(/-/g, " ")}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.jobTitle}>{item.jobTitle}</ThemedText>
                {item.salary && (
                  <ThemedText style={styles.salary}>
                    {item.currency} {item.salary.toLocaleString()} / {item.salaryRateType}
                  </ThemedText>
                )}
              </ThemedView>
            )}
          />
        )}

        {hiringData?.meta?.pagination && (
          <ThemedView style={styles.pagination}>
            <ThemedText style={styles.paginationText}>
              Showing {hiringProcesses.length} of {hiringData.meta.pagination.total} processes
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  email: {
    opacity: 0.7,
    marginTop: 4,
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    opacity: 0.7,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
  errorDetail: {
    opacity: 0.7,
    marginTop: 4,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    opacity: 0.7,
    marginTop: 8,
  },
  list: {
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  companyName: {
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  jobTitle: {
    opacity: 0.8,
    fontSize: 15,
  },
  salary: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#22c55e",
  },
  pagination: {
    paddingTop: 16,
    alignItems: "center",
  },
  paginationText: {
    opacity: 0.6,
    fontSize: 13,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#dc2626",
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
