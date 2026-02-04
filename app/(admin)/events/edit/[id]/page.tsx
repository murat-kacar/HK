"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EventEditPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({ title: '', event_type: '', start_date: '' });

  useEffect(() => {
    fetch(`/api/events/id/${id}`)
      .then((r) => r.json())
      .then((j) => {
        setForm(j.data || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/events', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: Number(id), ...form }) });
    setLoading(false);
    router.push('/admin/events');
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Etkinlik Düzenle</h1>
      {loading ? <div>Yükleniyor...</div> : (
        <form onSubmit={handleSubmit} className="space-y-3 max-w-lg">
          <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-2 border rounded" />
          <input value={form.event_type || ''} onChange={(e) => setForm({ ...form, event_type: e.target.value })} className="w-full p-2 border rounded" />
          <input value={form.start_date ? form.start_date.replace('Z','') : ''} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full p-2 border rounded" />
          <div className="flex gap-2">
            <button className="bg-primary text-white px-4 py-2 rounded">Güncelle</button>
            <button type="button" onClick={() => router.push('/admin/events')} className="px-4 py-2 border rounded">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}
