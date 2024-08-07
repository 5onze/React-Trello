import React from 'react';
import Board from './Board';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { boardState } from './atoms';

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

function App() {
  const boardList = useRecoilValue(boardState);
  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return;
    /*  setTodoList((oldList) => {
      const result = [...oldList];
      // 1) Delete item on source.index
      const [removed] = result.splice(source.index, 1);
      // 2) Put back the item on the destination.index
      result.splice(destination?.index, 0, removed);
      console.log(
        `Delete item ${source.index}, Put back on ${destination?.index}, Result :`,
        result,
      );
      return result;
    }); */
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(boardList).map((boardId) => (
            <Board
              key={boardId}
              boardId={boardId}
              boardList={boardList[boardId]}
            />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
