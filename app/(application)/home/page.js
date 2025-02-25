import React from 'react'
import PostSection from '../../components/PostSection';
import SuggestionSection from '../../components/SuggestionSection';
export default function page() {
  return (
    <div className='flex flex-col md:flex-row bg-transparent justify-evenly w-[52rem] '>
    <PostSection/>
     <SuggestionSection/>
    </div>
  )
}
