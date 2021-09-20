import { useRef } from 'react';
import { useRouter } from 'next/router';
import { Box, FormControl, Textarea, Button } from '@chakra-ui/core';
import useSWR, { mutate } from 'swr';

import { useAuth } from '@/lib/auth';
import { createComment } from '@/lib/db';
import fetcher from '@/utils/fetcher';
import Comment from '@/components/Comment';
import DashboardShell from '@/components/DashboardShell';
import SiteHeader from '@/components/SiteHeader';
import LoginButtons from '@/components/LoginButtons';

const CommentPage = () => {
  const { user, loading } = useAuth();
  const inputEl = useRef(null);
  const router = useRouter();
  const siteAndRoute = router.query?.site;
  const siteId = siteAndRoute ? siteAndRoute[0] : null;
  const route = siteAndRoute ? siteAndRoute[1] : null;
  const CommentApi = route
    ? `/api/Comment/${siteId}/${route}`
    : `/api/Comment/${siteId}`;

  const { data: siteData } = useSWR(`/api/site/${siteId}`, fetcher);
  const { data: CommentData } = useSWR(CommentApi, fetcher);

  const site = siteData?.site;
  const allComment = CommentData?.Comment;

  const onSubmit = (e) => {
    e.preventDefault();

    const newComment = {
      siteId,
      siteAuthorId: site.authorId,
      route: route || '/',
      author: user.name,
      authorId: user.uid,
      text: inputEl.current.value.replace('\n', '\n\n'),
      createdAt: new Date().toISOString(),
      provider: user.provider,
      status: 'pending'
    };

    inputEl.current.value = '';
    createComment(newComment);
    mutate(
      CommentApi,
      async (data) => ({
        Comment: [newComment, ...data.Comment]
      }),
      false
    );
  };

  const LoginOrLeaveComment = () =>
    user ? (
      <Button
        type="submit"
        isDisabled={!siteData || !CommentData}
        backgroundColor="gray.900"
        color="white"
        fontWeight="medium"
        mt={4}
        _hover={{ bg: 'gray.700' }}
        _active={{
          bg: 'gray.800',
          transform: 'scale(0.95)'
        }}
      >
        Leave Comment
      </Button>
    ) : (
      <LoginButtons />
    );

  return (
    <DashboardShell>
      <SiteHeader
        isSiteOwner={site?.authorId === user?.uid}
        site={site}
        siteId={siteId}
        route={route}
      />
      <Box
        display="flex"
        mx={4}
        flexDirection="column"
        width="full"
        maxWidth="700px"
      >
        <Box as="form" onSubmit={onSubmit}>
          <FormControl mb={8}>
            <Textarea
              ref={inputEl}
              id="comment"
              placeholder="Leave a comment"
              isDisabled={!user}
              h="100px"
            />
            {!loading && <LoginOrLeaveComment />}
          </FormControl>
        </Box>
        {allComment &&
          allComment.map((Comment, index) => (
            <Comment
              key={Comment.id}
              settings={site?.settings}
              isLast={index === allComment.length - 1}
              {...Comment}
            />
          ))}
      </Box>
    </DashboardShell>
  );
};

export default CommentPage;
