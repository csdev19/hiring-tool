import { StyleSheet, ActivityIndicator, View } from "react-native";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHiringProcesses } from "@/hooks/use-hiring-processes";
import {
  HIRING_PROCESS_STATUS_INFO,
  HIRING_PROCESS_STATUS_VALUES,
} from "@interviews-tool/domain/constants";
import type { HiringProcessStatus } from "@interviews-tool/domain/constants";
import { Colors } from "@/constants/theme";

export default function StatsScreen() {
  const { data: hiringData, isPending } = useHiringProcesses();

  const allProcesses = useMemo(
    () => hiringData?.pages.flatMap((page) => page.data) ?? [],
    [hiringData],
  );

  const statusCounts = useMemo(() => {
    const counts: Partial<Record<HiringProcessStatus, number>> = {};
    for (const process of allProcesses) {
      const status = process.status as HiringProcessStatus;
      counts[status] = (counts[status] ?? 0) + 1;
    }
    return counts;
  }, [allProcesses]);

  const activeCount = useMemo(
    () =>
      allProcesses.filter(
        (p) => HIRING_PROCESS_STATUS_INFO[p.status as HiringProcessStatus]?.category === "active",
      ).length,
    [allProcesses],
  );

  const terminalCount = allProcesses.length - activeCount;

  if (isPending) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <ActivityIndicator size="large" color="#0a7ea4" />
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Stats
        </ThemedText>

        <View style={styles.summaryRow}>
          <ThemedView style={styles.summaryCard}>
            <ThemedText style={styles.summaryNumber}>{allProcesses.length}</ThemedText>
            <ThemedText style={styles.summaryLabel}>Total</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.summaryCard, { borderColor: "#3b82f6" }]}>
            <ThemedText style={[styles.summaryNumber, { color: "#3b82f6" }]}>
              {activeCount}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Active</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.summaryCard, { borderColor: "#6b7280" }]}>
            <ThemedText style={[styles.summaryNumber, { color: "#6b7280" }]}>
              {terminalCount}
            </ThemedText>
            <ThemedText style={styles.summaryLabel}>Closed</ThemedText>
          </ThemedView>
        </View>

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          By Status
        </ThemedText>

        <ThemedView style={styles.breakdownCard}>
          {HIRING_PROCESS_STATUS_VALUES.map((status) => {
            const info = HIRING_PROCESS_STATUS_INFO[status];
            const count = statusCounts[status] ?? 0;
            if (count === 0) return null;
            return (
              <View key={status} style={styles.statusRow}>
                <View style={styles.statusLeft}>
                  <View style={[styles.dot, { backgroundColor: info.color }]} />
                  <ThemedText style={styles.statusLabel}>{info.label}</ThemedText>
                </View>
                <ThemedText style={styles.statusCount}>{count}</ThemedText>
              </View>
            );
          })}
          {allProcesses.length === 0 && (
            <ThemedText style={styles.emptyText}>No data yet</ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  title: {
    marginTop: 12,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "700",
    paddingTop: 12,
  },
  summaryLabel: {
    opacity: 0.6,
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  breakdownCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    gap: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusLabel: {
    fontSize: 15,
  },
  statusCount: {
    fontSize: 15,
    fontWeight: "600",
  },
  emptyText: {
    opacity: 0.5,
    textAlign: "center",
  },
});
