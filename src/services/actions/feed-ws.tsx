export type TWsFeedActions = {
  onStart: 'feed/wsStart';
  onSuccess: 'feed/wsSuccess';
  onOpen: 'feed/wsOpen';
  onClose: 'feed/wsClose';
  onClosed: 'feed/wsClosed';
  onError: 'feed/wsError';
  onMessage: 'feed/wsMessage';
  onDisconnect: 'feed/wsDisconnect';
};

export const feedWsActions: TWsFeedActions = {
  onStart: 'feed/wsStart',
  onSuccess: 'feed/wsSuccess',
  onOpen: 'feed/wsOpen',
  onClose: 'feed/wsClose',
  onClosed: 'feed/wsClosed',
  onError: 'feed/wsError',
  onMessage: 'feed/wsMessage',
  onDisconnect: 'feed/wsDisconnect',
};
