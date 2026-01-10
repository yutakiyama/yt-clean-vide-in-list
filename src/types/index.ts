/** メッセージの種類 */
export type MessageType = 'START_DELETE' | 'DELETE_PROGRESS' | 'DELETE_COMPLETE' | 'DELETE_ERROR';

/** ポップアップからContent Scriptへのメッセージ */
export interface StartDeleteMessage {
  type: 'START_DELETE';
}

/** 進捗報告メッセージ */
export interface ProgressMessage {
  type: 'DELETE_PROGRESS';
  current: number;
  total: number;
}

/** 削除完了メッセージ */
export interface CompleteMessage {
  type: 'DELETE_COMPLETE';
  deletedCount: number;
}

/** エラーメッセージ */
export interface ErrorMessage {
  type: 'DELETE_ERROR';
  error: string;
}

/** Content Scriptからの応答 */
export type ContentResponse = ProgressMessage | CompleteMessage | ErrorMessage;

/** プレイリストページ判定結果 */
export interface PlaylistCheckResult {
  isPlaylistPage: boolean;
  playlistName?: string;
  videoCount?: number;
}
