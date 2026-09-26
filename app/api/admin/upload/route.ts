import {getChatGPTUser} from '@/app/chatgpt-auth';
import {crmRole} from '@/lib/crm';
import {boundary,HttpError,json,id} from '@/lib/server';
import {env} from 'cloudflare:workers';
// Keep admin uploads separate from the storefront's seller upload endpoint.
export const dynamic='force-dynamic';
export async function POST(req:Request){return boundary(async()=>{
 if(req.headers.get('origin')!==new URL(req.url).origin)throw new HttpError(403,'Invalid request origin');
 const user=await getChatGPTUser();if(!user)throw new HttpError(401,'Please sign in');
 const role=await crmRole(user.email);if(!['owner','admin','content manager','seller manager'].includes(role))throw new HttpError(403,'Upload access required');
 if(!env.BUCKET)throw new HttpError(503,'Image storage unavailable');
 const reader=req.body?.getReader();if(!reader)throw new HttpError(400,'Image required');const chunks:Uint8Array[]=[];let size=0;
 while(true){const part=await reader.read();if(part.done)break;size+=part.value.length;if(size>5*1024*1024){await reader.cancel();throw new HttpError(413,'Image must be under 5 MB')}chunks.push(part.value)}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length}
 const png=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;const jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;const webp=new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
 if(!png&&!jpg&&!webp)throw new HttpError(400,'Upload JPEG, PNG or WebP');
 const ext=png?'png':jpg?'jpg':'webp';const key=id()+'.'+ext;await env.BUCKET.put(key,bytes,{httpMetadata:{contentType:'image/'+(jpg?'jpeg':ext)}});
 return json({url:'/api/media/'+key});
})}
