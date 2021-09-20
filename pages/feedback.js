import useSWR from 'swr';

import { useAuth } from '@/lib/auth';
import fetcher from '@/utils/fetcher';
import Page from '@/components/Page';
import DashboardShell from '@/components/DashboardShell';
import CommentTable from '@/components/CommentTable';
import CommentEmptyState from '@/components/CommentEmptyState';
import CommentTableHeader from '@/components/CommentTableHeader';
import CommentTableSkeleton from '@/components/CommentTableSkeleton';

const AllComment = () => {
  const { user } = useAuth();
  const { data } = useSWR(user ? ['/api/Comment', user.token] : null, fetcher);

  if (!data) {
    return (
      <DashboardShell>
        <CommentTableHeader />
        <CommentTableSkeleton />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <CommentTableHeader />
      {data?.Comment?.length ? (
        <CommentTable Comment={data.Comment} />
      ) : (
        <CommentEmptyState />
      )}
    </DashboardShell>
  );
};

const AllCommentPage = () => (
  <Page name="All Comment" path="/Comment">
    <AllComment />
  </Page>
);

export default AllCommentPage;
