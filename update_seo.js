const { prisma } = require('./lib/prisma');

async function main() {
  const seo = await prisma.siteContent.findUnique({ where: { key: 'seo' } });
  console.log('BEFORE:', JSON.stringify(seo?.data, null, 2));

  if (seo) {
    const newData = { ...seo.data, siteUrl: 'https://parvejshah.com' };
    await prisma.siteContent.update({
      where: { key: 'seo' },
      data: { data: newData }
    });
    console.log('AFTER:', JSON.stringify(newData, null, 2));
  } else {
    console.log('No SEO data found in DB, relying on defaultSiteUrl');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
