import React from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { boardState } from '../atoms';

const Button = styled.button`
  width: 36px;
  padding: 0 8px;
`;

interface boardProps {
  index: number;
}

function BoardDelete({ index }: boardProps) {
  const setBoards = useSetRecoilState(boardState);

  const handleClick = () => {
    setBoards((allboards) => {
      const newboards = [
        ...allboards.slice(0, index),
        ...allboards.slice(index + 1),
      ];

      return newboards;
    });
  };

  return <Button onClick={handleClick}>X</Button>;
}

export default BoardDelete;
