import styled from 'styled-components';

export const ASPECT_RATIOS = {
  SQUARE: '1/1',
  LANDSCAPE: '16/10',
  PORTRAIT: '3/4',
  WIDE: '21/9',
  CARD: '2/3',
} as const;

const ImageContainer = styled.div<{
  ratio: string;
  heights: { default: string; tablet: string; desktop: string };
}>`
  background-color: transparent;
  position: relative;
  width: 100%;
  aspect-ratio: ${(props) => props.ratio};
  overflow: hidden;
  height: ${(props) => props.heights.default};

  @media (min-width: 768px) {
    height: ${(props) => props.heights.tablet};
  }

  @media (min-width: 1024px) {
    height: ${(props) => props.heights.desktop};
  }
`;

const StyledImage = styled.img<{ ratio: string; sizes?: string }>`
  width: 100%;
  height: auto;
  aspect-ratio: ${(props) => props.ratio};
  border-radius: 0px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  sizes: ${(props) => props.sizes};
`;

const TextOverlay = styled.div`
  position: absolute;
  top: 25px;
  left: 110px;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  z-index: 10;
`;

interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: keyof typeof ASPECT_RATIOS;
  imageSizes?: string;
  containerHeights?: { default: string; tablet: string; desktop: string };
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  aspectRatio = 'SQUARE',
  imageSizes = '(min-width: 768px) 10vw, 10vw',
  containerHeights = { default: '150px', tablet: '200px', desktop: '250px' },
}) => (
  <ImageContainer ratio={ASPECT_RATIOS[aspectRatio]} heights={containerHeights}>
    <StyledImage
      src={src}
      alt={alt}
      loading='lazy'
      ratio={ASPECT_RATIOS[aspectRatio]}
      sizes={imageSizes}
    />
    <TextOverlay>{alt}</TextOverlay>
  </ImageContainer>
);

export default ResponsiveImage;
