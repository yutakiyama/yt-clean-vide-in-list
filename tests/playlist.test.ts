import { describe, it, expect } from 'vitest';
import {
  isPlaylistUrl,
  getPlaylistId,
  isWatchLaterPlaylist,
  findRemoveMenuItem,
} from '../src/utils/playlist';

describe('isPlaylistUrl', () => {
  it('「後で見る」プレイリストを正しく判定', () => {
    expect(isPlaylistUrl('https://www.youtube.com/playlist?list=WL')).toBe(true);
  });

  it('通常のプレイリストを正しく判定', () => {
    expect(
      isPlaylistUrl('https://www.youtube.com/playlist?list=PLvcowOQoqtKOwI9n0Brthsg1c8WUTI817')
    ).toBe(true);
  });

  it('動画ページは非プレイリストと判定', () => {
    expect(isPlaylistUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(false);
  });

  it('YouTubeトップページは非プレイリストと判定', () => {
    expect(isPlaylistUrl('https://www.youtube.com/')).toBe(false);
  });

  it('他のサイトは非プレイリストと判定', () => {
    expect(isPlaylistUrl('https://www.google.com/playlist?list=WL')).toBe(false);
  });

  it('不正なURLはfalseを返す', () => {
    expect(isPlaylistUrl('not-a-url')).toBe(false);
  });

  it('listパラメータがない場合はfalse', () => {
    expect(isPlaylistUrl('https://www.youtube.com/playlist')).toBe(false);
  });
});

describe('getPlaylistId', () => {
  it('プレイリストIDを正しく取得', () => {
    expect(getPlaylistId('https://www.youtube.com/playlist?list=WL')).toBe('WL');
  });

  it('長いプレイリストIDを正しく取得', () => {
    expect(
      getPlaylistId('https://www.youtube.com/playlist?list=PLvcowOQoqtKOwI9n0Brthsg1c8WUTI817')
    ).toBe('PLvcowOQoqtKOwI9n0Brthsg1c8WUTI817');
  });

  it('listパラメータがない場合はnull', () => {
    expect(getPlaylistId('https://www.youtube.com/playlist')).toBe(null);
  });

  it('不正なURLはnullを返す', () => {
    expect(getPlaylistId('not-a-url')).toBe(null);
  });
});

describe('isWatchLaterPlaylist', () => {
  it('「後で見る」プレイリストを正しく判定', () => {
    expect(isWatchLaterPlaylist('https://www.youtube.com/playlist?list=WL')).toBe(true);
  });

  it('通常のプレイリストはfalse', () => {
    expect(
      isWatchLaterPlaylist(
        'https://www.youtube.com/playlist?list=PLvcowOQoqtKOwI9n0Brthsg1c8WUTI817'
      )
    ).toBe(false);
  });
});

describe('findRemoveMenuItem', () => {
  it('「から削除」を含むメニュー項目を見つける', () => {
    // DOM要素をモック
    const items = [
      { textContent: 'キューに追加' },
      { textContent: '後で見るに保存' },
      { textContent: 'testから削除' },
    ] as unknown as NodeListOf<Element>;

    const result = findRemoveMenuItem(items);
    expect(result).toBe(items[2]);
  });

  it('該当するメニュー項目がない場合はnullを返す', () => {
    const items = [
      { textContent: 'キューに追加' },
      { textContent: '後で見るに保存' },
    ] as unknown as NodeListOf<Element>;

    const result = findRemoveMenuItem(items);
    expect(result).toBe(null);
  });

  it('空のリストの場合はnullを返す', () => {
    const items = [] as unknown as NodeListOf<Element>;
    const result = findRemoveMenuItem(items);
    expect(result).toBe(null);
  });
});
