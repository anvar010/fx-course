const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const models = ['BC162GRA1', 'BC262GRA2', 'BV262GRA2'];
  const products = await prisma.product.findMany({
    where: {
      modelNumber: { in: models }
    }
  });

  if (products.length === 0) {
    console.log("No products found for these models.");
    return;
  }

  for (const p of products) {
    console.log(`\n--- ${p.modelNumber} ---`);
    console.log(`Name: ${p.name}`);
    console.log(`Brand: ${p.brandId}`); // might need to fetch brand
    console.log(`Short Desc: ${p.shortDescription}`);
    console.log(`Desc: ${p.description}`);
    console.log(`Specs: ${p.specifications}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
