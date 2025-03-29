import styled from 'styled-components';

const PositionedDiv = styled.div<{
  bottom?: string;
  left?: string;
  right?: string;
  top?: string;
}>`
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  top: ${(props) => props.top};
  bottom: ${(props) => props.bottom};
  position: absolute;
`;

export default PositionedDiv;
