import React from 'react'
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import MessageBar from '../components/Messagebar';
import SearchUsersModal from '../components/UserSearchModal';

export default function layout({children}:Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <>
    <Header/>
    <div className='flex flex-row justify-between max-h-screen overflow-hidden'>
      <Sidebar/>
      <SearchUsersModal/>
      {children}
      <MessageBar/>
      </div>
    </>
  )
}
