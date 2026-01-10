/**
 * プレイリストURL判定
 * @param url 判定するURL
 * @returns プレイリストページかどうか
 */
export function isPlaylistUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname === 'www.youtube.com' &&
      urlObj.pathname === '/playlist' &&
      urlObj.searchParams.has('list')
    );
  } catch {
    return false;
  }
}

/**
 * プレイリストIDを取得
 * @param url プレイリストURL
 * @returns プレイリストID（取得できない場合はnull）
 */
export function getPlaylistId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('list');
  } catch {
    return null;
  }
}

/**
 * 「後で見る」プレイリストかどうかを判定
 * @param url プレイリストURL
 * @returns 「後で見る」プレイリストかどうか
 */
export function isWatchLaterPlaylist(url: string): boolean {
  return getPlaylistId(url) === 'WL';
}

/**
 * 指定時間待機
 * @param ms 待機時間（ミリ秒）
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** DOM セレクタ定数 */
export const SELECTORS = {
  /** 動画アイテム */
  VIDEO_ITEM: 'ytd-playlist-video-renderer',
  /** 操作メニューボタン */
  MENU_BUTTON: '#button.yt-icon-button',
  /** メニューポップアップ */
  MENU_POPUP: 'ytd-menu-popup-renderer',
  /** メニュー項目 */
  MENU_ITEM: 'ytd-menu-service-item-renderer',
  /** プレイリストタイトル */
  PLAYLIST_TITLE:
    'yt-dynamic-sizing-formatted-string.ytd-playlist-header-renderer, h1.ytd-playlist-header-renderer',
} as const;

/**
 * 「〜から削除」メニュー項目を見つける
 * @param menuItems メニュー項目のリスト
 * @returns 削除メニュー項目（見つからない場合はnull）
 */
export function findRemoveMenuItem(menuItems: NodeListOf<Element>): Element | null {
  for (const item of menuItems) {
    const text = item.textContent || '';
    if (text.includes('から削除')) {
      return item;
    }
  }
  return null;
}
