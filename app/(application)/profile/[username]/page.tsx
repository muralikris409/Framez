import { Suspense, use } from 'react';
import {ProfileSection} from '../../../components/ProfileSection';
import { fetchUserData } from '@/app/actions/userActions';
import { Loader2 } from 'lucide-react';
export default async function ProfilePage({params}:any) {
  const {username}=(await params)
  let loading=true;
   let error=null;
  let data=null;
  try{
  data=await fetchUserData(username.replaceAll("%20"," "));
  }
 catch(err){
  error=err;
 }
  finally{
    loading=false;
  }
  console.log(username.replaceAll("%20"," "));

  if(error){
     return  (<div className="absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md rounded-lg">
               <span className="h-12 w-12 text-gray-800">failed to load data</span>
             </div>)
  } 
  if(loading){
    return ( <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md rounded-lg">
      <Loader2 className="h-12 w-12 animate-spin text-gray-800" />
    </div>)
  }
  return (
    <ProfileSection user={data}/>
  );
}