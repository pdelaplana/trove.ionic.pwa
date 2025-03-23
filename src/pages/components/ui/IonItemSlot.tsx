import styled from 'styled-components';

export const IonItemStartSlot = styled.div`
  width: 1.2em;

  ion-icon {
    width: 1.2em;
    height: 1.2em;

    position: absolute;

    left: 14px;
    top: 14px;
    display: flex;
    align-self: start;
    margin-right: 10px;
  }
`;

export const IonItemEndSlot = styled.div`
  position: absolute;

  top: 10px;
  right: 10px;

  font-size: 0.8rem;

  display: flex;
  align-items: center;
`;
