import React from 'react';
import { Box } from '@chakra-ui/core';

import { Table, Tr, Th } from './Table';
import CommentRow from './CommentRow';

const CommentTable = (props) => {
  return (
    <Box overflowX="scroll">
      <Table w="full">
        <thead>
          <Tr>
            <Th minW="150px">Name</Th>
            <Th>Comment</Th>
            <Th>Route</Th>
            <Th>Visible</Th>
            <Th width="50px">{''}</Th>
          </Tr>
        </thead>
        <tbody>
          {props.Comment.map((Comment) => (
            <CommentRow key={Comment.id} {...Comment} />
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default CommentTable;
