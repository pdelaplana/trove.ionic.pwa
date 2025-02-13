import styled from 'styled-components';

const ScrollContainer = styled.div<{ height?: string }>`
  height: ${(props) => props.height || '90dvh'};
  overflow-y: scroll;
`;

interface ScrollableContainerProps {
  height?: string;
  children: React.ReactNode;
}

const ScrollableSection: React.FC<ScrollableContainerProps> = ({
  height,
  children,
}) => {
  return <ScrollContainer height={height}>{children}</ScrollContainer>;
};

export default ScrollableSection;
