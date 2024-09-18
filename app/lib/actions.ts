"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "./db";
import { redirect } from "next/navigation";

const FormSchema = z.object({
  id: z.number(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  // option 1
  //   const rawFormData = {
  //     customerId: formData.get("customerId"),
  //     amount: formData.get("amount"),
  //     status: formData.get("status"),
  //   };
  // option 2
  //   const rawFormData = Object.fromEntries(formData.entries());
  // Test it out:
  //   console.log(rawFormData);
  //   console.log(typeof rawFormData.amount);

  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString();

  await prisma.invoice.create({
    data: {
      customer_id: Number(customerId),
      status,
      amount: amountInCents,
      date,
    },
  });
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: number, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  await prisma.invoice.update({
    where: {
      id: id,
    },
    data: {
      status,
      amount: amountInCents,
      customer_id: Number(customerId),
    },
  });

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: number) {
  await prisma.invoice.delete({
    where: { id },
  });
  revalidatePath("/dashboard/invoices");
}
