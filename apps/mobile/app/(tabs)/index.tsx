import { StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, View } from "react-native";
import { useMemo } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSession } from "@/lib/auth-client";
import { useHiringProcesses } from "@/hooks/use-hiring-processes";
import type { HiringProcess } from "@/hooks/use-hiring-processes";
import { HIRING_PROCESS_STATUS_INFO } from "@interviews-tool/domain/constants";
import type { HiringProcessStatus } from "@interviews-tool/domain/constants";
import { Colors } from "@/constants/theme";

export default function HomeScreen() {
  const { isPending: sessionPending } = useSession();
  const {
    data: hiringData,
    isPending: hiringPending,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useHiringProcesses();

  const hiringProcesses = useMemo(
    () => hiringData?.pages.flatMap((page) => page.data) ?? [],
    [hiringData],
  );

  const total = hiringData?.pages[0]?.meta.pagination.total;

  const navigateToDetail = (item: HiringProcess) => {
    router.push({
      pathname: "/hiring/[id]",
      params: {
        id: item.id,
        companyName: item.companyName,
        jobTitle: item.jobTitle ?? "",
        status: item.status,
        salary: item.salary?.toString() ?? "",
        currency: item.currency,
        salaryRateType: item.salaryRateType,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">My Hirings</ThemedText>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push("/hiring/create")}>
            <ThemedText style={styles.addButtonText}>+</ThemedText>
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
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigateToDetail(item)}>
                <ThemedView style={styles.card}>
                  <View style={styles.cardHeader}>
                    <ThemedText type="subtitle" style={styles.companyName}>
                      {item.companyName}
                    </ThemedText>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            HIRING_PROCESS_STATUS_INFO[item.status as HiringProcessStatus]?.color ??
                            "#6b7280",
                        },
                      ]}
                    >
                      <ThemedText style={styles.statusText}>
                        {HIRING_PROCESS_STATUS_INFO[item.status as HiringProcessStatus]?.label ??
                          item.status.replace(/-/g, " ")}
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
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <>
                {isFetchingNextPage && (
                  <ActivityIndicator style={styles.footerLoader} size="small" color="#0a7ea4" />
                )}
                {hasNextPage && !isFetchingNextPage && (
                  <TouchableOpacity style={styles.loadMoreButton} onPress={() => fetchNextPage()}>
                    <ThemedText style={styles.loadMoreButtonText}>Load More</ThemedText>
                  </TouchableOpacity>
                )}
                {total !== undefined && (
                  <ThemedView style={styles.pagination}>
                    <ThemedText style={styles.paginationText}>
                      Showing {hiringProcesses.length} of {total} processes
                    </ThemedText>
                  </ThemedView>
                )}
              </>
            }
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "red",
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 24,
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
  footerLoader: {
    marginTop: 16,
  },
  loadMoreButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
    alignItems: "center",
  },
  loadMoreButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  pagination: {
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  paginationText: {
    opacity: 0.6,
    fontSize: 13,
  },
});
