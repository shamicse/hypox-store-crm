import {records} from '@/lib/crm';
import {notFound} from 'next/navigation';
import {Shell} from '@/components/storefront';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const page=(await records('live','pages')).find(p=>p.slug===slug&&p.status==='published');if(!page)notFound();return <Shell><article style={{maxWidth:850,margin:'60px auto',padding:'0 20px'}}><h1>{page.name}</h1><p style={{whiteSpace:'pre-line',margin:'24px 0'}}>{page.body}</p>{String(page.sections||'').split('\n').filter(Boolean).map((s,i)=><section style={{margin:'32px 0'}} key={i}><h2>{s.split('|')[0]}</h2><p>{s.split('|').slice(1).join('|')}</p></section>)}</article></Shell>}
