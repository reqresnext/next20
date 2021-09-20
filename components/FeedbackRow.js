import React, { useState } from 'react';
import { Box, Code, Switch } from '@chakra-ui/core';
import { mutate } from 'swr';

import { Td } from './Table';
import { useAuth } from '@/lib/auth';
import { updateComment } from '@/lib/db';
import DeleteCommentButton from './DeleteCommentButton';

const CommentRow = ({ id, author, text, route, status }) => {
  const auth = useAuth();
  const isChecked = status === 'active';

  const toggleComment = async () => {
    await updateComment(id, { status: isChecked ? 'pending' : 'active' });
    mutate(['/api/Comment', auth.user.token]);
  };

  return (
    <Box as="tr" key={id}>
      <Td fontWeight="medium">{author}</Td>
      <Td>{text}</Td>
      <Td>
        <Code
          maxW="150px"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
          display="inherit"
        >
          {route || '/'}
        </Code>
      </Td>
      <Td>
        <Switch color="green" onChange={toggleComment} isChecked={isChecked} />
      </Td>
      <Td>
        <DeleteCommentButton CommentId={id} />
      </Td>
    </Box>
  );
};

export default CommentRow;
