import type {Metadata} from 'next';
import './admin.css';
export const metadata:Metadata={title:'Hypox Control — Store Admin',description:'Private Hypox administration',robots:{index:false,follow:false},icons:{icon:'/admin-favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
