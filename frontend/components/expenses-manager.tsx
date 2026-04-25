"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
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
import { expenseCategories, initialExpenses, type Expense, type ExpenseCategory } from "@/lib/farm-data";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const categoryClass: Record<ExpenseCategory, string> = {
  accounts: "border-primary/30 bg-primary/10 text-primary",
  proxy: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  subscription: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  hardware: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  other: "border-muted-foreground/30 bg-muted text-muted-foreground",
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpensesManager() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [open, setOpen] = useState(false);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("accounts");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayISO());

  const total = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  function resetForm() {
    setAmount("");
    setCategory("accounts");
    setDescription("");
    setDate(todayISO());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number.parseFloat(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toast.error("Enter a valid amount greater than 0");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    const next: Expense = {
      id: `E-${String(expenses.length + 1).padStart(3, "0")}`,
      amount: parsed,
      category,
      description: description.trim(),
      date,
    };
    setExpenses((prev) => [next, ...prev]);
    toast.success(`Added $${parsed.toLocaleString("en-US", { maximumFractionDigits: 2 })} to ${category}`);
    resetForm();
    setOpen(false);
  }

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Expenses</CardTitle>
          <CardDescription>
            Total spend:{" "}
            <span className="font-mono font-semibold text-foreground">
              ${total.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </span>{" "}
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
                  <FieldLabel htmlFor="amount">Amount (USD)</FieldLabel>
                  <Input
                    id="amount"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
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
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="What was this for?"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="date">Date</FieldLabel>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save expense</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="pl-6 text-xs uppercase tracking-wider text-muted-foreground">
                ID
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Date</TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                Category
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                Description
              </TableHead>
              <TableHead className="pr-6 text-right text-xs uppercase tracking-wider text-muted-foreground">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((e) => (
              <TableRow key={e.id} className="border-border/60">
                <TableCell className="pl-6 font-mono text-xs text-muted-foreground">{e.id}</TableCell>
                <TableCell className="text-sm">{formatDate(e.date)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`capitalize ${categoryClass[e.category]}`}>
                    {e.category}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[28rem] truncate text-sm">{e.description}</TableCell>
                <TableCell className="pr-6 text-right font-mono font-semibold tabular-nums">
                  ${e.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
