'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import React from 'react';

interface IMarkdown {
  md: string;
}

const Markdown = ({ md }: IMarkdown) => {
  return (
    <ReactMarkdown
      components={{
        a(props) {
          const { node, ...rest } = props;
          return <a className="text-orange-1" {...rest} />;
        },
        li(props) {
          const { node, ...rest } = props;
          return <li className="mb-2 list-disc" {...rest} />;
        },
        p(props) {
          const { node, ...rest } = props;
          return <p className="mb-2" {...rest} />;
        },
        code(props) {
          const { node, ...rest } = props;
          return <p className="mb-2 block" {...rest} />;
        }
      }}
      remarkPlugins={[remarkGfm]}
    >
      {md}
    </ReactMarkdown>
  );
};

export default Markdown;
