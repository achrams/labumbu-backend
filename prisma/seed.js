// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Hapus semua user (opsional)
  await prisma.user.deleteMany();

  // Hash password
  const password = await bcrypt.hash("Ladara123masuk!", 10);

  // Buat user baru
  await prisma.user.createMany({
    data: [
      {
        name: "Ladara Developer",
        email: "ladaradeveloper@gmail.com",
        password: password,
      },
      {
        name: "Administrator",
        email: "ladaraadmin@ladara.id",
        password: password,
      },
    ],
  });

  console.log("✅ Seed user selesai");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
