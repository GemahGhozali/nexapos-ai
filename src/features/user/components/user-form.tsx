"use client";

import Link from "next/link";
import { User } from "../types";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import { useUserForm } from "../hooks";
import { ImageUploader } from "@/components/image-uploader";
import { Button, buttonVariants } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";

interface UserFormProps {
  user?: User;
}

export default function UserForm({ user }: UserFormProps) {
  const { form, isPending, onSubmit } = useUserForm(user);

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{user ? "Update User Data" : "Create New User"}</CardTitle>
          <CardDescription>Insert user identity, account and set role permission</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {/* Profile Image */}
            <Controller
              name="profileImage"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <ImageUploader
                    label="Profile Image (Optional)"
                    description="JPEG, JPG, PNG and WEBP, Max. 1 MB"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Fullname */}
            <Controller
              name="fullname"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="fullname">
                    Fullname <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="fullname"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter fullname here..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">
                    Email Address <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter email address here..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">
                    {user ? "New Password (Optional)" : "Password"}
                    {!user && <span className="text-red-600">*</span>}
                  </FieldLabel>
                  {user && <FieldDescription>Old password will be replaced by the new one</FieldDescription>}
                  <Input
                    {...field}
                    id="password"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder={user ? "Enter new password here..." : "Enter password here..."}
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {/* Role */}
            <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Role <span className="text-red-600">*</span>
                  </FieldLabel>
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                  >
                    {/* Cashier Role */}
                    <FieldLabel htmlFor="cashier">
                      <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <FieldTitle>Cashier</FieldTitle>
                          <FieldDescription>Limited to manage transaction, cashier and cashflow only</FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value="cashier" id="cashier" aria-invalid={fieldState.invalid} />
                      </Field>
                    </FieldLabel>
                    {/* Admin Role */}
                    <FieldLabel htmlFor="admin">
                      <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                        <FieldContent>
                          <FieldTitle>Admin</FieldTitle>
                          <FieldDescription>Have full access to all application features and master data</FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value="admin" id="admin" aria-invalid={fieldState.invalid} />
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldSet>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Link href={`/dashboard/user`} className={buttonVariants({ variant: "outline" })} aria-disabled={isPending}>
            Cancel
          </Link>
          <Button type="submit" size="lg" disabled={isPending || !form.formState.isValid}>
            {isPending ? "Processing" : user ? "Update User Data" : "Create New User"}
            {isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
