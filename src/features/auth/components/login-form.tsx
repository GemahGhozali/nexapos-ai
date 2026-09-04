"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Controller } from "react-hook-form";
import { useLoginForm } from "../hooks";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown03Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const QUICK_ACCESS = [
  {
    value: "admin",
    email: "admin@gmail.com",
    password: "12345678",
    label: "Login sebagai admin",
    badge: "Full Access",
    icon: Crown03Icon,
  },
  {
    value: "cashier",
    email: "kasir@gmail.com",
    password: "12345678",
    label: "Login sebagai kasir",
    badge: "Operasional",
    icon: UserIcon,
  },
] as const;

export default function LoginForm() {
  const { form, onSubmit, isPending } = useLoginForm();

  function handleQuickAccess(value: string) {
    const account = QUICK_ACCESS.find((a) => a.value === value);
    if (!account) return;
    form.setValue("email", account.email, { shouldValidate: true });
    form.setValue("password", account.password, { shouldValidate: true });
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Selamat Datang 🙌</CardTitle>
        <CardDescription>Silahkan login untuk menggunakan aplikasi</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input {...field} id="email" type="email" aria-invalid={fieldState.invalid} placeholder="example@gmail.com" autoComplete="off" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button type="submit" size="lg" disabled={isPending || !form.formState.isValid}>
                {isPending ? "Memproses" : "Login"}
                {isPending && <Spinner data-icon="inline-start" />}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <Separator />
      <CardFooter>
        <RadioGroup onValueChange={handleQuickAccess}>
          {QUICK_ACCESS.map((account) => (
            <FieldLabel key={account.value} htmlFor={account.value} className="cursor-pointer">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    <HugeiconsIcon icon={account.icon} size={16} color="currentColor" strokeWidth={1.5} />
                    {account.label}
                  </FieldTitle>
                </FieldContent>
                <Badge variant="secondary">{account.badge}</Badge>
                <RadioGroupItem value={account.value} id={account.value} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </CardFooter>
    </Card>
  );
}
