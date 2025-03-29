import React from 'react';
import styled from 'styled-components';

const ContainerStyle = styled.div<{
  aspectRatio: string;
}>`
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: ${(props) => `${props.aspectRatio}` || '16/9'};
  margin: 0px;
`;

const ImageStyle = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}
const ResponsiveImage2: React.FC<ResponsiveImageProps> = ({
  src = '',
  alt = 'Responsive image',
  className = '',
  aspectRatio = '16/9', // Default 16:9 aspect ratio
}) => {
  return (
    <ContainerStyle aspectRatio={aspectRatio} className={className}>
      <ImageStyle className={className} src={src} alt={alt} />
    </ContainerStyle>
  );
};

export default ResponsiveImage2;
