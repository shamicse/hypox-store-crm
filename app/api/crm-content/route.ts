import {records} from '@/lib/crm';
import {boundary,json} from '@/lib/server';
export const dynamic='force-dynamic';
export async function GET(){return boundary(async()=>{const result:Record<string,unknown>={};for(const resource of ['announcements','pages','navigation','promotions']){result[resource]=(await records('live',resource)).filter(r=>['active','published'].includes(r.status)&&(!r.start||Date.parse(r.start)<=Date.now())&&(!r.end||Date.parse(r.end)>Date.now())).sort((a,b)=>resource==='announcements'?(b.priority||0)-(a.priority||0):(a.position||0)-(b.position||0));}return json(result)})}
