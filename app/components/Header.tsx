'use client';

import { useEffect, useState,useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { fetchUserData } from '../lib/userSlice';
import { setSearchText, openModal } from '../lib/searchSlice';
import { signOut } from 'next-auth/react';
import { deleteToken } from '../actions/cookieHandler';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const dispatch = useAppDispatch();
  const { loading, error, ...user } = useAppSelector(state => state.user);
  async function handleLogout() {
    try {
      await deleteToken('token');
      console.log('Token deleted successfully.');
    } catch (error) {
      console.error('Error deleting token:', error);
    }
  
    try {
      await signOut({ redirect: false });
      window.location.href = "/auth/login";
      console.log('Sign out successful.');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
   console.log(user);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false); // Close dropdown
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleSearch = () => {
    if (searchInput.trim()) {
      dispatch(setSearchText(searchInput));
      dispatch(openModal());
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 max-h-14">
      <div className="md:hidden max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 pt-2">
        <Link href="/" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900">FRAMEZ</span>
        </Link>
      </div>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2">
        <Link href="/" className="flex items-center space-x-3 hidden md:block">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900">FRAMEZ</span>
        </Link>
        <div className="relative w-2/3 md:w-1/3 flex">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-4 py-2 text-sm border outline-none rounded-md focus:ring focus:ring-blue-100 bg-gray-100 text-gray-900"
          />
          <button onClick={handleSearch} className="absolute right-3 top-3 text-gray-500">
            <FaSearch />
          </button>
        </div>
        <div className="flex items-center space-x-4">
        <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="hidden md:flex items-center space-x-2 bg-gray-200 rounded-full px-3 py-1 focus:ring-4 focus:ring-gray-300"
        onClick={toggleDropdown}
      >
        <span className="text-sm font-medium text-gray-700">{user?.username || 'loading..'}</span>
        <Image className="w-8 h-8 rounded-full" src={user?.image||"/user.gif"} alt="User Photo" width={32} height={32} />
      </button>

      {(isOpen&&user) && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
        >
          <ul>
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Profile</li>
            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Settings</li>
            <li onClick={handleLogout}className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Logout</li>
          </ul>
        </div>
      )}
    </div>
          <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden flex text-sm bg-gray-200 rounded-full focus:ring-4 focus:ring-gray-300">
            <Image className="w-8 h-8 rounded-full" src="/user.gif" alt="User Photo" width={32} height={32} />
          </button>
        </div>
      </div>
      {(isMenuOpen&&user) && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/profile" className="block text-gray-700">Profile</Link>
          <Link href="/settings" className="block text-gray-700">Settings</Link>
          <Link href="/logout" className="block text-gray-700">Logout</Link>
        </div>
      )}
    </nav>
  );
};

export default Header;
