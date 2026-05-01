"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "./ui/skeleton";

import { formatDate } from "@/lib/utils";
import { useExpensesList, useCreateExpense } from "@/lib/api/queries";
import type { ExpenseCategory } from "@/lib/api/types";

export const expenseCategories: { value: ExpenseCategory; label: string }[] = [
  { value: "accounts", label: "Accounts" },
  { value: "proxy", label: "Proxy" },
  { value: "subscription", label: "Subscription" },
  { value: "hardware", label: "Hardware" },
  { value: "other", label: "Other" },
];

const categoryClass: Record<ExpenseCategory, string> = {
  accounts: "border-primary/30 bg-primary/10 text-primary",
  proxy: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  subscription: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  hardware: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  other: "border-muted-foreground/30 bg-muted text-muted-foreground",
};

const getInitialForm = () => ({
  amount: "",
  category: "accounts" as ExpenseCategory,
  description: "",
  date: new Date().toISOString().slice(0, 10),
});

export function ExpensesManager() {
  const { data: expenses = [], isLoading, error } = useExpensesList();
  const createExpense = useCreateExpense();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(getInitialForm);

  const set =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) =>
      setForm((prev) => ({ ...prev, [field]: typeof e === "string" ? e : e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number.parseFloat(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) return toast.error("Enter a valid amount greater than 0");
    if (!form.description.trim()) return toast.error("Description is required");

    createExpense.mutate(
      { amount, category: form.category, description: form.description.trim(), date: form.date },
      {
        onSuccess: () => {
          toast.success(`Added $${amount.toFixed(2)} to ${form.category}`);
          setForm(getInitialForm());
          setOpen(false);
        },
        onError: (err: Error) => toast.error(err.message || "Failed to add expense"),
      },
    );
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Expenses</CardTitle>
          <CardDescription>
            Total spend: <span className="font-mono font-semibold text-foreground">${total.toFixed(2)}</span>{" "}
            across {expenses.length} entries
          </CardDescription>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" />
              Add expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add expense</DialogTitle>
                <DialogDescription>Log a new operational cost for your farm.</DialogDescription>
              </DialogHeader>

              <FieldGroup className="py-4">
                <Field>
                  <FieldLabel>Amount (USD)</FieldLabel>
                  <Input
                    inputMode="decimal"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={set("amount")}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <Select value={form.category} onValueChange={set("category") as (v: string) => void}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    className="resize-none"
                    data-gramm="false"
                    data-gramm_editor="false"
                    data-enable-grammarly="false"
                    placeholder="What was this for?"
                    rows={2}
                    value={form.description}
                    onChange={set("description")}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Date</FieldLabel>
                  <Input type="date" value={form.date} onChange={set("date")} required />
                </Field>
              </FieldGroup>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createExpense.isPending}>
                  {createExpense.isPending && <Loader2 className="size-4 animate-spin" />}
                  Save expense
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        {error && <p className="px-6 py-4 text-sm text-red-400">Failed to load expenses</p>}
        {expenses.length === 0 && !isLoading && !error && (
          <p className="py-12 text-center text-sm text-muted-foreground">No expenses yet</p>
        )}
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              {["#", "Date", "Category", "Description", "Amount"].map((header) => (
                <TableHead
                  key={header}
                  className="text-xs uppercase tracking-wider text-muted-foreground first:pl-6 last:pr-6 last:text-right"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className="border-border/60">
                    <TableCell className="pl-6">
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell className="pr-6 flex justify-end">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              : expenses.map((expense, index) => (
                  <TableRow key={expense.id} className="border-border/60">
                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(expense.date)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize ${categoryClass[expense.category]}`}>
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md truncate text-sm">{expense.description}</TableCell>
                    <TableCell className="pr-6 text-right font-mono font-semibold tabular-nums">
                      ${Number(expense.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
