import React from 'react';

interface IEmptyContentWrapper {
  children: React.ReactNode;
  isEmpty: boolean;
}

const EmptyContentWrapper = ({ isEmpty, children }: IEmptyContentWrapper) => {
  return isEmpty ? (
    <div className="w-max h-[20vh] flex items-center absolute top-[65%] lg:top-[20%] left-[50%] -translate-x-[150px]">
      <span className="text-[16px] max-w-[20rem] text-center">
        Please check back, no items available for this currently!
      </span>
    </div>
  ) : (
    <>{children}</>
  );
};

export default EmptyContentWrapper;
