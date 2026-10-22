import type { Access } from 'payload';
export const authenticated: Access = ({ req }) => Boolean(req.user);
export const adminOnly: Access = ({ req }) => req.user?.role === 'admin';
export const publishedOrAuthenticated: Access = ({ req }) => req.user ? true : { _status: { equals: 'published' } };
