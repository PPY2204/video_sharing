import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const Icon: React.FC<IconProps> = (props) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <rect width="24" height="24" fill="none" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
);

export default Icon;