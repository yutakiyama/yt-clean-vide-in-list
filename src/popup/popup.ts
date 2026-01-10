import { isPlaylistUrl } from '../utils/playlist';
import type { PlaylistCheckResult, StartDeleteMessage, ContentResponse } from '../types';

/** DOM要素の参照 */
const elements = {
  loading: document.getElementById('loading')!,
  playlistInfo: document.getElementById('playlist-info')!,
  playlistName: document.getElementById('playlist-name')!,
  videoCount: document.getElementById('video-count')!,
  errorMessage: document.getElementById('error-message')!,
  errorText: document.getElementById('error-text')!,
  deleteBtn: document.getElementById('delete-btn')!,
  progress: document.getElementById('progress')!,
  progressFill: document.getElementById('progress-fill')!,
  progressCurrent: document.getElementById('progress-current')!,
  progressTotal: document.getElementById('progress-total')!,
  complete: document.getElementById('complete')!,
  deletedCount: document.getElementById('deleted-count')!,
};

/**
 * 現在のタブがプレイリストページか確認
 */
async function checkCurrentTab(): Promise<PlaylistCheckResult> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.url || !isPlaylistUrl(tab.url)) {
    return { isPlaylistPage: false };
  }

  // Content Script を注入してプレイリスト情報を取得
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: () => {
      const titleEl = document.querySelector(
        'yt-dynamic-sizing-formatted-string.ytd-playlist-header-renderer, h1.ytd-playlist-header-renderer'
      );
      const videos = document.querySelectorAll('ytd-playlist-video-renderer');
      return {
        playlistName: titleEl?.textContent?.trim() || 'プレイリスト',
        videoCount: videos.length,
      };
    },
  });

  const result = results[0]?.result;
  return {
    isPlaylistPage: true,
    playlistName: result?.playlistName,
    videoCount: result?.videoCount || 0,
  };
}

/**
 * UIを更新
 */
function showError(message: string): void {
  elements.loading.classList.add('hidden');
  elements.playlistInfo.classList.add('hidden');
  elements.deleteBtn.classList.add('hidden');
  elements.errorMessage.classList.remove('hidden');
  elements.errorText.textContent = message;
}

function showPlaylistInfo(name: string, count: number): void {
  elements.loading.classList.add('hidden');
  elements.errorMessage.classList.add('hidden');
  elements.playlistInfo.classList.remove('hidden');
  elements.deleteBtn.classList.remove('hidden');
  elements.playlistName.textContent = name;
  elements.videoCount.textContent = count.toString();
}

function showProgress(current: number, total: number): void {
  elements.deleteBtn.classList.add('hidden');
  elements.playlistInfo.classList.add('hidden');
  elements.progress.classList.remove('hidden');
  elements.progressCurrent.textContent = current.toString();
  elements.progressTotal.textContent = total.toString();
  elements.progressFill.style.width = `${(current / total) * 100}%`;
}

function showComplete(count: number): void {
  elements.progress.classList.add('hidden');
  elements.complete.classList.remove('hidden');
  elements.deletedCount.textContent = count.toString();
}

/**
 * 削除処理を開始
 */
async function startDelete(): Promise<void> {
  const confirmed = confirm(
    '本当にこのプレイリスト内のすべての動画を削除しますか？\n\nこの操作は取り消せません。'
  );

  if (!confirmed) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  // Content Script を注入
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js'],
  });

  // 削除開始メッセージを送信
  const message: StartDeleteMessage = { type: 'START_DELETE' };

  chrome.tabs.sendMessage(tab.id, message, (response: ContentResponse) => {
    if (chrome.runtime.lastError) {
      showError('削除処理に失敗しました。ページを再読み込みしてお試しください。');
      return;
    }

    if (response.type === 'DELETE_COMPLETE') {
      showComplete(response.deletedCount);
    } else if (response.type === 'DELETE_ERROR') {
      showError(response.error);
    }
  });

  // 進捗を監視
  chrome.runtime.onMessage.addListener((message: ContentResponse) => {
    if (message.type === 'DELETE_PROGRESS') {
      showProgress(message.current, message.total);
    }
  });

  // 初期進捗を表示
  const info = await checkCurrentTab();
  if (info.videoCount) {
    showProgress(0, info.videoCount);
  }
}

/**
 * 初期化
 */
async function init(): Promise<void> {
  try {
    const result = await checkCurrentTab();

    if (!result.isPlaylistPage) {
      showError(
        'この機能はYouTubeのプレイリスト画面でのみ使用できます。\n\nプレイリスト画面に移動してから、もう一度お試しください。'
      );
      return;
    }

    if (result.videoCount === 0) {
      showError('このプレイリストには動画がありません。');
      return;
    }

    showPlaylistInfo(result.playlistName || 'プレイリスト', result.videoCount || 0);

    elements.deleteBtn.addEventListener('click', startDelete);
  } catch (error) {
    showError('エラーが発生しました。ページを再読み込みしてお試しください。');
    console.error('Popup init error:', error);
  }
}

// DOMContentLoaded で初期化
document.addEventListener('DOMContentLoaded', init);
