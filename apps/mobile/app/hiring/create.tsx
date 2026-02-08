import { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  View,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { apiFetch } from "@/lib/api-client";
import {
  HIRING_PROCESS_STATUS_INFO,
  HIRING_PROCESS_STATUS_VALUES,
  DEFAULT_HIRING_PROCESS_STATUS,
  CURRENCY_INFO,
  CURRENCY_VALUES,
  SALARY_RATE_TYPE_LABELS,
  SALARY_RATE_TYPE_VALUES,
} from "@interviews-tool/domain/constants";
import type {
  HiringProcessStatus,
  Currency,
  SalaryRateType,
} from "@interviews-tool/domain/constants";
import { createHiringProcessSchema } from "@interviews-tool/domain/schemas";

export default function CreateHiringScreen() {
  const queryClient = useQueryClient();

  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState<HiringProcessStatus>(DEFAULT_HIRING_PROCESS_STATUS);
  const [salary, setSalary] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [salaryRateType, setSalaryRateType] = useState<SalaryRateType>("monthly");

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiFetch("/api/v1/hiring-processes", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hiring-processes"] });
      router.back();
    },
    onError: (err) => {
      Alert.alert("Error", err.message || "Failed to create hiring process");
    },
  });

  const handleSubmit = () => {
    const raw = {
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim() || undefined,
      status,
      salary: salary ? Number(salary) : undefined,
      currency: salary ? currency : undefined,
      salaryRateType: salary ? salaryRateType : undefined,
    };

    const result = createHiringProcessSchema.safeParse(raw);
    if (!result.success) {
      const firstError = result.error.errors[0];
      Alert.alert("Validation Error", firstError?.message ?? "Invalid input");
      return;
    }

    mutation.mutate(result.data);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ThemedText style={styles.label}>Company Name *</ThemedText>
        <TextInput
          style={styles.input}
          value={companyName}
          onChangeText={setCompanyName}
          placeholder="e.g. Acme Corp"
          placeholderTextColor="#666"
        />

        <ThemedText style={styles.label}>Job Title</ThemedText>
        <TextInput
          style={styles.input}
          value={jobTitle}
          onChangeText={setJobTitle}
          placeholder="e.g. Frontend Developer"
          placeholderTextColor="#666"
        />

        <ThemedText style={styles.label}>Status *</ThemedText>
        <View style={styles.chipRow}>
          {HIRING_PROCESS_STATUS_VALUES.map((s) => {
            const info = HIRING_PROCESS_STATUS_INFO[s];
            const selected = s === status;
            return (
              <TouchableOpacity
                key={s}
                style={[
                  styles.chip,
                  { borderColor: info.color },
                  selected && { backgroundColor: info.color },
                ]}
                onPress={() => setStatus(s)}
              >
                <ThemedText style={[styles.chipText, selected && { color: "#fff" }]}>
                  {info.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <ThemedText style={styles.label}>Salary</ThemedText>
        <TextInput
          style={styles.input}
          value={salary}
          onChangeText={setSalary}
          placeholder="e.g. 5000"
          placeholderTextColor="#666"
          keyboardType="numeric"
        />

        {salary !== "" && (
          <>
            <ThemedText style={styles.label}>Currency</ThemedText>
            <View style={styles.chipRow}>
              {CURRENCY_VALUES.map((c) => {
                const selected = c === currency;
                return (
                  <TouchableOpacity
                    key={c}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => setCurrency(c)}
                  >
                    <ThemedText style={[styles.chipText, selected && { color: "#fff" }]}>
                      {CURRENCY_INFO[c].symbol} {c}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>

            <ThemedText style={styles.label}>Rate Type</ThemedText>
            <View style={styles.chipRow}>
              {SALARY_RATE_TYPE_VALUES.map((rt) => {
                const selected = rt === salaryRateType;
                return (
                  <TouchableOpacity
                    key={rt}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => setSalaryRateType(rt)}
                  >
                    <ThemedText style={[styles.chipText, selected && { color: "#fff" }]}>
                      {SALARY_RATE_TYPE_LABELS[rt]}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.submitButton, mutation.isPending && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.submitButtonText}>Create</ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.3)",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#fff",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.3)",
  },
  chipSelected: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4",
  },
  chipText: {
    fontSize: 13,
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 14,
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
