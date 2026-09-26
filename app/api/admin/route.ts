import {getChatGPTUser} from '@/app/chatgpt-auth';
import {handleCrm} from '@/lib/crm';
import {boundary,json,HttpError} from '@/lib/server';
export const dynamic='force-dynamic';
export async function POST(req:Request){return boundary(async()=>{
 if(req.headers.get('origin')!==new URL(req.url).origin)throw new HttpError(403,'Invalid request origin');
 const user=await getChatGPTUser();if(!user)throw new HttpError(401,'Please sign in with your authorized admin account.');
 const reader=req.body?.getReader();if(!reader)throw new HttpError(400,'Request body required');
 const decoder=new TextDecoder();let raw='',size=0;
 while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>64000){await reader.cancel();throw new HttpError(413,'Request too large')}raw+=decoder.decode(chunk.value,{stream:true})}raw+=decoder.decode();
 let input:Record<string,unknown>;try{input=JSON.parse(raw)}catch{throw new HttpError(400,'Invalid JSON request')}
 return json(await handleCrm({...input,actor:user.email,name:user.displayName}));
})}
