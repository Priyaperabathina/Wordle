import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

// Styled components for the board
const BoardContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 20px 0;
  align-items: center;
`;

const Row = styled(Box)`
  display: flex;
  gap: 5px;
`;

const Cell = styled(motion.div)`
  width: 62px;
  height: 62px;
  border: 2px solid #d3d6da;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${props => {
        switch (props.status) {
            case 'correct': return '#6aaa64';
            case 'present': return '#c9b458';
            case 'absent': return '#787c7e';
            case 'empty': return '#ffffff';
            default: return '#ffffff';
        }
    }};
  color: ${props => props.status === 'empty' ? '#000000' : '#ffffff'};
  border-color: ${props => {
        switch (props.status) {
            case 'correct': return '#6aaa64';
            case 'present': return '#c9b458';
            case 'absent': return '#787c7e';
            default: return '#d3d6da';
        }
    }};
`;

const WordleBoard = ({ gameBoard, currentRow, isAnimating }) => {
    const getCellVariants = (rowIndex, colIndex) => {
        const cell = gameBoard[rowIndex][colIndex];
        const hasLetter = cell.letter !== '';
        const hasStatus = cell.status !== 'empty';

        return {
            initial: {
                scale: 1,
                rotateX: 0,
            },
            animate: {
                scale: hasLetter ? [1, 1.1, 1] : 1,
                rotateX: hasStatus ? [0, 90, 0] : 0,
                transition: {
                    duration: 0.6,
                    delay: colIndex * 0.1,
                    ease: "easeInOut"
                }
            }
        };
    };

    const getRowVariants = (rowIndex) => {
        return {
            initial: { opacity: 0, y: 20 },
            animate: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.5,
                    delay: rowIndex * 0.1
                }
            }
        };
    };

    return (
        <BoardContainer>
            {gameBoard.map((row, rowIndex) => (
                <motion.div
                    key={rowIndex}
                    variants={getRowVariants(rowIndex)}
                    initial="initial"
                    animate="animate"
                >
                    <Row>
                        {row.map((cell, colIndex) => (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                status={cell.status}
                                variants={getCellVariants(rowIndex, colIndex)}
                                initial="initial"
                                animate={isAnimating ? "animate" : "initial"}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {cell.letter}
                            </Cell>
                        ))}
                    </Row>
                </motion.div>
            ))}
        </BoardContainer>
    );
};

export default WordleBoard;
