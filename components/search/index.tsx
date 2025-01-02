'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { useState } from 'react';
import Link from 'next/link';
import CONSTANTS from '@/constant';
import { sluggify } from '@/utils';

const Search = () => {
  const [searchInput, setSearchInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <div className="flex items-center">
          <div className="grid place-items-center w-10 h-10 rounded-[50px] border border-slate-400 cursor-pointer hover:bg-black-1/[0.05] active:bg-black-1/10 transition-colors ease-in-out duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="min-h-[30vh]">
        <DialogHeader>
          <DialogTitle className="text-[18px]">Search</DialogTitle>
          <DialogDescription className="text-[16px]">
            Search our catalogue for our rental product...
          </DialogDescription>
          <div className="flex items-center gap-4">
            <div className="w-full  h-[3rem] my-4 px-4 flex items-center bg-white rounded-custom border border-slate-200">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e?.target?.value)}
                placeholder="Search For Products..."
                className="bg-transparent border-0 shadow-none focus:border-none font-sans focus-visible:ring-0 focus-visible:border-none focus:ring-0 placeholder:text-black-1/50 placeholder:font-[400]"
              />
              <Link
                onClick={() => setDialogOpen(false)}
                href={`/${CONSTANTS.ROUTES.products}?search=${sluggify(searchInput)}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-black-1/50 cursor-pointer hover:text-black-1 transition-colors ease-in-out duration-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Search;
