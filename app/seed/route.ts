import {
  customers,
  invoices,
  revenue,
  users,
} from "@/app/lib/placeholder-data";
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
      const isoDate = new Date(invoice.date);
      return prisma.invoices.create({
        data: {
          status: invoice.status,
          amount: invoice.amount,
          date: isoDate.toISOString(),
          customer_id: invoice.customer_id,
        },
      });
    })
  );

  return insertedInvoices;
}

async function seedCustomers() {
  const insertedCustomers = await Promise.all(
    customers.map((customer) => {
      return prisma.customer.create({
        data: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          image: customer.image_url,
        },
      });
    })
  );

  return insertedCustomers;
}

async function seedRevenue() {
  const insertedRevenue = await Promise.all(
    revenue.map((rev) =>
      prisma.revenue.create({
        data: {
          month: rev.month,
          revenue: rev.revenue,
        },
      })
    )
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();
    return Response.json({
      success: true,
      message: "database seeded successfully",
    });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
