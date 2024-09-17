import { invoices, users } from "@/app/lib/placeholder-data";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/db";

async function seedUsers() {
  const data = await Promise.all(
    users.map(async (user) => {
      // hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      //   save to database
      return prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
        },
      });
    })
  );
  return data;
}

async function seedInvoices() {
  const insertedInvoices = await Promise.all(
    invoices.map((invoice) => {
      return prisma.invoices.create({
        data: {
          status: invoice.status,
          amount: invoice.amount,
          customer_id: invoice.customer_id,
        },
      });
    })
  );

  return insertedInvoices;
}

export async function GET() {
  try {
    await seedUsers();
    // await seedInvoices();
    return Response.json({
      success: true,
      message: "database seeded successfully",
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
