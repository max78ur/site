import { Mail, MessageSquareText, Phone } from 'lucide-react';

const inquiries = [
  { id: 'INQ-DEMO-101', name: 'Demo Contact A', subject: 'Dispatch services', email: 'contact-a@example.test', date: 'Jun 12, 2025', status: 'New' },
  { id: 'INQ-DEMO-102', name: 'Demo Contact B', subject: 'Freight quote request', email: 'contact-b@example.test', date: 'Jun 11, 2025', status: 'In progress' },
  { id: 'INQ-DEMO-103', name: 'Demo Contact C', subject: 'Fleet onboarding', email: 'contact-c@example.test', date: 'Jun 10, 2025', status: 'New' },
  { id: 'INQ-DEMO-104', name: 'Demo Contact D', subject: 'General inquiry', email: 'contact-d@example.test', date: 'Jun 08, 2025', status: 'Resolved' },
];

const inquiryStatusClass: Record<string, string> = {
  New: 'bg-blue-50 text-blue-700',
  'In progress': 'bg-amber-50 text-amber-700',
  Resolved: 'bg-emerald-50 text-emerald-700',
};

export default function ContactInquiries() {
  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-red-700">Communications</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-4xl">Contact Inquiries</h1>
          <p className="mt-2 text-sm text-slate-500">A demo queue for contact and quote requests.</p>
        </div>
        <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">Sample records · Demo</span>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'All inquiries', value: '14', icon: MessageSquareText },
          { label: 'New', value: '6', icon: Mail },
          { label: 'Awaiting response', value: '3', icon: Phone },
        ].map(({ label, value, icon: Icon }) => (
          <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={label}>
            <span className="rounded-xl bg-slate-100 p-3 text-slate-700"><Icon aria-hidden="true" size={19} /></span>
            <div>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Inquiry</th>
                <th className="px-5 py-4 font-semibold">Contact</th>
                <th className="px-5 py-4 font-semibold">Received</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.map((inquiry) => (
                <tr className="hover:bg-slate-50/70" key={inquiry.id}>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">{inquiry.subject}</p>
                    <p className="mt-1 text-xs text-slate-400">{inquiry.id}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-700">{inquiry.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{inquiry.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{inquiry.date}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${inquiryStatusClass[inquiry.status]}`}>
                      {inquiry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
