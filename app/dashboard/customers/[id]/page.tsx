import { fetchCustomerById } from '@/app/lib/data';
import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import InvoicesTable from '@/app/ui/invoices/table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Customer',
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params?.id || '';

  const [customer] = await Promise.all([fetchCustomerById(id)]);

  if (!customer) {
    notFound();
  }

  const currentPage = 1;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: customer.name,
            href: `/dashboard/customers/${id}`,
            active: true,
          },
        ]}
      />

      <div className="flex items-center gap-3 py-3">
        <Image
          src={customer.image_url}
          className="rounded-full"
          alt={`${customer.name}'s profile picture`}
          width={48}
          height={48}
        />
        <p>
          Email: <strong>{customer.email}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card
          title="Total invoices"
          type="invoices"
          value={customer.total_invoices}
        />
        <Card title="Paid" value={customer.total_paid} type="collected" />
        <Card title="Pending" value={customer.total_pending} type="pending" />
      </div>
      <div>
      <h2 className={`${lusitana.className} my-8 text-xl md:text-2xl`}>
        Invoices
      </h2>
        <Suspense
          key={customer.email + currentPage}
          fallback={<InvoicesTableSkeleton />}
        >
          <InvoicesTable query={customer.email} currentPage={currentPage} showCustomerInfo={false}/>
        </Suspense>
      </div>
    </main>
  );
}
