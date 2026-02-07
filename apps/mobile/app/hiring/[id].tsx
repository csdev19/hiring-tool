import { StyleSheet, ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { HIRING_PROCESS_STATUS_INFO } from "@interviews-tool/domain/constants";
import type { HiringProcessStatus } from "@interviews-tool/domain/constants";

export default function HiringDetailScreen() {
  const params = useLocalSearchParams<{
    id: string;
    companyName: string;
    jobTitle: string;
    status: string;
    salary: string;
    currency: string;
    salaryRateType: string;
    createdAt: string;
    updatedAt: string;
  }>();

  const statusInfo = HIRING_PROCESS_STATUS_INFO[params.status as HiringProcessStatus];
  const salary = params.salary ? Number(params.salary) : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title">{params.companyName}</ThemedText>

        {params.jobTitle && <ThemedText style={styles.jobTitle}>{params.jobTitle}</ThemedText>}

        <View style={[styles.statusBadge, { backgroundColor: statusInfo?.color ?? "#6b7280" }]}>
          <ThemedText style={styles.statusText}>
            {statusInfo?.label ?? params.status?.replace(/-/g, " ")}
          </ThemedText>
        </View>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Details</ThemedText>

          {salary ? (
            <Row
              label="Salary"
              value={`${params.currency} ${salary.toLocaleString()} / ${params.salaryRateType}`}
            />
          ) : (
            <Row label="Salary" value="Not specified" />
          )}

          <Row label="Created" value={formatDate(params.createdAt)} />
          <Row label="Updated" value={formatDate(params.updatedAt)} />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      <ThemedText style={styles.rowValue}>{value}</ThemedText>
    </View>
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 12,
  },
  jobTitle: {
    opacity: 0.7,
    fontSize: 16,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  section: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    opacity: 0.6,
    fontSize: 14,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "500",
  },
});
