import Admin from '@/components/admin';
import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {crmRole} from '@/lib/crm';
export const dynamic='force-dynamic';
export default async function Page(){
 const user=await requireChatGPTUser('/admin');
 try {await crmRole(user.email)} catch {return <main className="error-state"><h1>Admin access required</h1><p>This account does not have access, or the workspace is unavailable. Ask the store owner to check your team membership.</p><a className="button" href="/">Back to the store</a><a className="button" href="/signout-with-chatgpt?return_to=/admin">Use another account</a></main>}
 return <Admin/>;
}
