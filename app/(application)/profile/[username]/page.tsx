import { use } from 'react';
import {ProfileSection} from '../../../components/ProfileSection';
import { fetchUserData } from '@/app/actions/userActions';
export default async function ProfilePage({params}:any) {
    const {username}=(await params)
    const data=await fetchUserData(username.replaceAll("%20"," "));
    console.log(username.replaceAll("%20"," "));

    console.log(data)
    if(!data){
       return  <div>Failed to load data</div>
    }
    return (
      <ProfileSection user={data}/>
    );
  }