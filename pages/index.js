import Head from 'next/head';
import { Box, Button, Flex, Text, Icon, Link, Stack } from '@chakra-ui/core';

import { useAuth } from '@/lib/auth';
import { getAllComment, getSite } from '@/lib/db-admin';
import Comment from '@/components/Comment';
import CommentLink from '@/components/CommentLink';
import LoginButtons from '@/components/LoginButtons';
import Footer from '@/components/Footer';

const SITE_ID = process.env.NEXT_PUBLIC_HOME_PAGE_SITE_ID;

export async function getStaticProps(context) {
  const { Comment } = await getAllComment(SITE_ID);
  const { site } = await getSite(SITE_ID);

  return {
    props: {
      allComment: Comment,
      site
    },
    revalidate: 1
  };
}

const Home = ({ allComment, site }) => {
  const auth = useAuth();

  return (
    <>
      <Box bg="gray.100" py={16} px={4}>
        <Flex as="main" direction="column" maxW="700px" margin="0 auto">
          <Head>
            <script
              dangerouslySetInnerHTML={{
                __html: `
              if (document.cookie && document.cookie.includes('fast-Comment-auth')) {
                window.location.href = "/sites"
              }
            `
              }}
            />
          </Head>
          <Icon color="black" name="logo" size="48px" mb={2} />
          {auth.user ? (
            <Button
              as="a"
              href="/sites"
              backgroundColor="gray.900"
              color="white"
              fontWeight="medium"
              mt={4}
              maxW="200px"
              _hover={{ bg: 'gray.700' }}
              _active={{
                bg: 'gray.800',
                transform: 'scale(0.95)'
              }}
            >
              View Dashboard
            </Button>
          ) : (
            <LoginButtons />
          )}
        </Flex>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        width="full"
        maxWidth="700px"
        margin="0 auto"
        mt={8}
        px={4}
      >
        <CommentLink paths={[SITE_ID]} />
        {allComment.map((Comment, index) => (
          <Comment
            key={Comment.id}
            settings={site?.settings}
            isLast={index === allComment.length - 1}
            {...Comment}
          />
        ))}
      </Box>
      <Footer />
    </>
  );
};

export default Home;
