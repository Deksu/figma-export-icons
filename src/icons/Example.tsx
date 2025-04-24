import * as React from 'react';

const Example = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" {...props}>
    <path d="..." />
  </svg>
);

export default Example;