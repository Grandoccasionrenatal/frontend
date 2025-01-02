import React from 'react';

interface IPillTabs<T> {
  currTab: T;
  tabs: T[];
  setCurrTab: (i: T) => void;
}

const PillTabs = <T,>({ currTab, setCurrTab, tabs }: IPillTabs<T>) => {
  return (
    <div
      className={`${
        tabs?.length < 2 ? `hidden` : `grid`
      } relative w-full overflow-auto no-scrollbar `}
    >
      <div className="flex items-center justify-center gap-2 whitespace-nowrap">
        {tabs?.map((i, idx) => (
          <div
            onClick={() => setCurrTab(i)}
            key={idx}
            className={`cursor-pointer w-max px-4 py-1 border rounded-[13px] border-black-1 grid place-items-center hover:bg-black-1 hover:text-white transition-colors ease-in-out duration-300
                ${currTab === i ? `bg-black-1 text-white` : ``}
                `}
          >
            <span className="whitespace-nowrap text-[14px]">{`${i}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PillTabs;
