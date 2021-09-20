import { compareDesc, compareAsc, parseISO } from 'date-fns';

import { db } from './firebase-admin';

export async function getAllComment(siteId, route) {
  try {
    let ref = db
      .collection('Comment')
      .where('siteId', '==', siteId)
      .where('status', '==', 'active');

    if (route) {
      ref = ref.where('route', '==', route);
    }

    const snapshot = await ref.get();
    const Comment = [];

    snapshot.forEach((doc) => {
      Comment.push({ id: doc.id, ...doc.data() });
    });

    Comment.sort((a, b) =>
      compareAsc(parseISO(a.createdAt), parseISO(b.createdAt))
    );

    return { Comment };
  } catch (error) {
    return { error };
  }
}

export async function getSite(siteId) {
  const doc = await db.collection('sites').doc(siteId).get();
  const site = { id: doc.id, ...doc.data() };

  return { site };
}

export async function getAllSites() {
  const snapshot = await db.collection('sites').get();

  const sites = [];

  snapshot.forEach((doc) => {
    sites.push({ id: doc.id, ...doc.data() });
  });

  return { sites };
}

export async function getUserSites(uid) {
  const snapshot = await db
    .collection('sites')
    .where('authorId', '==', uid)
    .get();

  const sites = [];

  snapshot.forEach((doc) => {
    sites.push({ id: doc.id, ...doc.data() });
  });

  sites.sort((a, b) =>
    compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
  );

  return { sites };
}

export async function getAllCommentForSites(uid) {
  const { sites } = await getUserSites(uid);

  if (!sites.length) {
    return { Comment: [] };
  }

  const siteIds = sites.map((site) => site.id);
  const snapshot = await db
    .collection('Comment')
    .where('siteId', 'in', siteIds)
    .get();

  const Comment = [];

  snapshot.forEach((doc) => {
    Comment.push({ id: doc.id, ...doc.data() });
  });

  return { Comment };
}
