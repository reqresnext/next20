import { useRouter } from 'next/router';
import { Box, Text } from '@chakra-ui/core';
import 'iframe-resizer/js/iframeResizer.contentWindow';

import Comment from '@/components/Comment';
import CommentLink from '@/components/CommentLink';
import { getAllComment, getAllSites, getSite } from '@/lib/db-admin';
import { useTheme } from '@/utils/useTheme';

export async function getStaticProps(context) {
  const [siteId, route] = context.params.site;
  const { Comment } = await getAllComment(siteId, route);
  const { site } = await getSite(siteId);

  return {
    props: {
      initialComment: Comment,
      site
    },
    revalidate: 1
  };
}

export async function getStaticPaths() {
  const { sites } = await getAllSites();
  const paths = sites.map((site) => ({
    params: {
      site: [site.id.toString()]
    }
  }));

  return {
    paths,
    fallback: true
  };
}

const EmbeddedCommentPage = ({ initialComment, site }) => {
  const router = useRouter();
  const colorMode = useTheme();
  const textColor = {
    light: 'gray.900',
    dark: 'gray.200'
  };

  return (
    <Box display="flex" flexDirection="column" width="full">
      <CommentLink paths={router?.query?.site || []} />
      {initialComment?.length ? (
        initialComment.map((Comment, index) => (
          <Comment
            key={Comment.id}
            settings={site?.settings}
            isLast={index === initialComment.length - 1}
            {...Comment}
          />
        ))
      ) : (
        <Text color={textColor[colorMode]}>
          There are no comments for this site.
        </Text>
      )}
    </Box>
  );
};

export default EmbeddedCommentPage;
