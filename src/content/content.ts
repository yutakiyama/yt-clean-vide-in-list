import { sleep, SELECTORS, findRemoveMenuItem } from '../utils/playlist';
import type { StartDeleteMessage, ProgressMessage, CompleteMessage, ErrorMessage } from '../types';

/**
 * 動画を1件削除
 * @param videoItem 動画要素
 * @returns 削除に成功したかどうか
 */
async function deleteVideo(videoItem: Element): Promise<boolean> {
  try {
    // 操作メニューボタンを探してクリック
    const menuButton = videoItem.querySelector(SELECTORS.MENU_BUTTON) as HTMLElement | null;
    if (!menuButton) {
      console.warn('Menu button not found');
      return false;
    }

    menuButton.click();
    await sleep(200);

    // メニューポップアップが表示されるまで待機
    const popup = document.querySelector(SELECTORS.MENU_POPUP);
    if (!popup) {
      console.warn('Menu popup not found');
      return false;
    }

    // 「〜から削除」メニュー項目を探してクリック
    const menuItems = popup.querySelectorAll(SELECTORS.MENU_ITEM);
    const removeItem = findRemoveMenuItem(menuItems);

    if (!removeItem) {
      console.warn('Remove menu item not found');
      // メニューを閉じる
      document.body.click();
      return false;
    }

    (removeItem as HTMLElement).click();
    await sleep(300);

    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    return false;
  }
}

/**
 * すべての動画を削除
 */
async function deleteAllVideos(
  sendResponse: (response: CompleteMessage | ErrorMessage) => void
): Promise<void> {
  try {
    let deletedCount = 0;
    let failedCount = 0;
    const maxRetries = 3;

    // 動画がなくなるまで繰り返し削除
    // 注意: リストから削除すると要素が消えるので、常に最初の要素を取得
    let videoItems = document.querySelectorAll(SELECTORS.VIDEO_ITEM);
    while (videoItems.length > 0) {
      const total = deletedCount + videoItems.length;

      // 進捗を報告
      const progressMessage: ProgressMessage = {
        type: 'DELETE_PROGRESS',
        current: deletedCount,
        total: total,
      };
      chrome.runtime.sendMessage(progressMessage);

      // 最初の動画を削除
      const success = await deleteVideo(videoItems[0]);

      if (success) {
        deletedCount++;
        failedCount = 0;
      } else {
        failedCount++;
        if (failedCount >= maxRetries) {
          // 複数回失敗したら中断
          const errorResponse: ErrorMessage = {
            type: 'DELETE_ERROR',
            error: `削除処理中にエラーが発生しました。${deletedCount}本の動画を削除しました。`,
          };
          sendResponse(errorResponse);
          return;
        }
        // リトライ前に少し待機
        await sleep(500);
      }

      // 次のループのために再取得
      videoItems = document.querySelectorAll(SELECTORS.VIDEO_ITEM);
    }

    const completeResponse: CompleteMessage = {
      type: 'DELETE_COMPLETE',
      deletedCount: deletedCount,
    };
    sendResponse(completeResponse);
  } catch (error) {
    const errorResponse: ErrorMessage = {
      type: 'DELETE_ERROR',
      error: `予期せぬエラーが発生しました: ${error}`,
    };
    sendResponse(errorResponse);
  }
}

/**
 * メッセージリスナー
 */
chrome.runtime.onMessage.addListener(
  (
    message: StartDeleteMessage,
    _sender,
    sendResponse: (response: CompleteMessage | ErrorMessage) => void
  ) => {
    if (message.type === 'START_DELETE') {
      // 非同期で削除処理を実行
      deleteAllVideos(sendResponse);
      // 非同期レスポンスを返すためにtrueを返す
      return true;
    }
  }
);
