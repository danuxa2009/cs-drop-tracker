import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionsApi, expensesApi } from "./client";

export function useSessionsList() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: sessionsApi.list,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSession(id: number | null) {
  return useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionsApi.get(id!),
    enabled: id !== null,
  });
}

export function useExpensesList() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: expensesApi.list,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expensesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
