import React, { useMemo } from 'react';
import Board from './components/Board';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import {
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { boardState } from './atoms';
import BoardCreator from './components/BoardCreator';

const BoardContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #0d4274;
`;

const Header = styled.header`
  padding: 12px 16px;
  background-color: #00000042;
  margin-bottom: 20px;
  h1 {
    height: 100%;
    font-size: 18px;
    font-weight: 400;
    line-height: 32px;
    color: #fff;
    padding: 0 10px;
  }
`;

const BoardMain = styled.div`
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div``;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

function App() {
  const [boardList, setBoardList] = useRecoilState(boardState);

  // 드래그 앤 드랍
  const onDragEnd = (info: DropResult) => {
    const { source, destination, draggableId } = info;

    if (!destination) return;

    // 같은 보드에서 투두 이동
    if (destination?.droppableId === source.droppableId) {
      setBoardList((allBoards) => {
        // source.droppableId 앞에 " + "는 number 로 교체하기 위해서 사용
        const boardIndex = allBoards.findIndex(
          (board) => board.id === +source.droppableId,
        );

        // copy
        const copyBoard = allBoards[boardIndex];
        const copyItems = [...copyBoard.items]; // 해당 보드의 모든 투두 가져오기

        // splice 원본 배열에서 삭제 (변수에 삭제된 요소가 담김), slice는 원본 복제
        const copyTodo = copyItems.splice(source.index, 1); // 배열에서 해당 todo를 삭제하고 변수에 todo를 담음
        copyItems.splice(destination?.index, 0, ...copyTodo); // 원본 배열에서 아무것도 삭제하지 않고 todo를 붙여넣음

        // new board
        const newBoard = { ...copyBoard, items: copyItems };
        const newBoards = [
          ...allBoards.slice(0, boardIndex),
          newBoard,
          ...allBoards.slice(boardIndex + 1),
        ];
        return newBoards;
      });
    }
    // 다른 보드에서 이동
    if (destination?.droppableId !== source.droppableId) {
      setBoardList((allBoards) => {
        // find boardIndex
        const srcBoardIndex = allBoards.findIndex(
          (board) => board.id === +source.droppableId,
        );
        const destBaordIndex = allBoards.findIndex(
          (board) => board.id === +destination.droppableId,
        );
        // copy
        const srcCopyBoard = allBoards[srcBoardIndex];
        const destCopyBoard = allBoards[destBaordIndex];
        const srcCopyItems = [...srcCopyBoard.items]; //시작 보드의 해당 todo
        const destCopyItems = [...destCopyBoard.items]; // 드래그한 보드에 이동한 todo

        // edit
        const copyTodo = srcCopyItems.splice(source.index, 1);
        destCopyItems.splice(destination?.index, 0, ...copyTodo);

        // new board
        const srcNewBoard = { ...srcCopyBoard, items: srcCopyItems };
        const destNewBoard = { ...destCopyBoard, items: destCopyItems };

        const srcNewBoards = [
          ...allBoards.slice(0, srcBoardIndex),
          srcNewBoard,
          ...allBoards.slice(srcBoardIndex + 1),
        ];

        const resultNewBoards = [
          ...srcNewBoards.slice(0, destBaordIndex),
          destNewBoard,
          ...srcNewBoards.slice(destBaordIndex + 1),
        ];

        return resultNewBoards;
      });
    }
  };

  return (
    <BoardContainer>
      <Header>
        <h1>To Do</h1>
      </Header>
      <BoardMain>
        <DragDropContext onDragEnd={onDragEnd}>
          <Wrapper>
            <Boards>
              {boardList.map((board, index) => (
                <Board
                  key={board.id}
                  boardIndex={index}
                  boardId={board.id}
                  items={board.items}
                  boardName={board.boardName}
                />
              ))}
            </Boards>
          </Wrapper>
          <BoardCreator />
        </DragDropContext>
      </BoardMain>
    </BoardContainer>
  );
}

export default App;
