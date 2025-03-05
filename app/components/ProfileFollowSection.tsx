"use client"
import { useEffect, useState } from "react";
import {  getFollowing } from "../actions/userActions";
import Link from "next/link";

export function ProfileFollowing({followings}:any) {
  
  
 
  
    return (
      <div className="mt-6">
        <h3 className="text-gray-500 text-sm font-semibold mb-2">Following</h3>
  
        <div className="overflow-y-scroll max-h-[20rem] scrollbar-hide">
          {
            followings.map((contact:any) => (
              
              <Link href={`/profile/${contact.follower.username}`} key={contact.follower.username} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                <img 
                  src={contact.follower.image || "/profile.png"} 
                  alt={contact.follower.username} 
                  className="w-8 h-8 rounded-full" 
                />
                <div>
                  <p className="text-gray-700 font-medium text-sm">{contact.follower.username}</p>
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    );
  }
  