import React from 'react';import Image from 'next/dist/client/image';export default function NextImage(props) { return React.createElement(Image, Object.assign({}, props, { unoptimized: true })); }
