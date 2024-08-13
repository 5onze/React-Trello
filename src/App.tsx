import React from 'react';
import Board from './Board';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { boardState } from './atoms';

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

function App() {
  const [boardList, setBoardList] = useRecoilState(boardState);
  const onDragEnd = ({ source, destination, draggableId }: DropResult) => {
    if (!destination) return;
    // 같은 보드에서 투두 이동
    if (destination?.droppableId === source.droppableId) {
      setBoardList((allBoards) => {
        const result = [...allBoards[source.droppableId]]; // 해당 보드의 모든 투두 가져오기
        result.splice(source.index, 1); // 선택한 투두를 index에서 지우기
        result.splice(destination?.index, 0, draggableId); // draggableId를 마지막에 추가
        return { ...allBoards, [source.droppableId]: result };
      });
    }
    // 다른 보드에서 이동
    if (destination?.droppableId !== source.droppableId) {
      setBoardList((allBoards) => {
        const sourceResult = [...allBoards[source.droppableId]];
        const destinationResult = [...allBoards[destination.droppableId]];
        sourceResult.splice(source.index, 1);
        destinationResult.splice(destination?.index, 0, draggableId);
        return {
          ...allBoards,
          [source.droppableId]: sourceResult,
          [destination.droppableId]: destinationResult,
        };
      });
    }
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
