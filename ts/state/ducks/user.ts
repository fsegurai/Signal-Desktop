// Copyright 2019 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { trigger } from '../../shims/events';

import type { LocaleMessagesType } from '../../types/I18N';
import type { LocalizerType } from '../../types/Util';
import type { MenuOptionsType } from '../../types/menu';
import type { NoopActionType } from './noop';
import type { UUIDStringType } from '../../types/UUID';
import * as OS from '../../OS';
import { ThemeType } from '../../types/Util';

// State

export type UserStateType = {
  attachmentsPath: string;
  i18n: LocalizerType;
  interactionMode: 'mouse' | 'keyboard';
  isMainWindowFullScreen: boolean;
  isMainWindowMaximized: boolean;
  localeMessages: LocaleMessagesType;
  menuOptions: MenuOptionsType;
  osName: 'linux' | 'macos' | 'windows' | undefined;
  ourACI: UUIDStringType | undefined;
  ourConversationId: string | undefined;
  ourDeviceId: number | undefined;
  ourNumber: string | undefined;
  ourPNI: UUIDStringType | undefined;
  platform: string;
  regionCode: string | undefined;
  stickersPath: string;
  tempPath: string;
  theme: ThemeType;
  version: string;
};

// Actions

type UserChangedActionType = {
  type: 'USER_CHANGED';
  payload: {
    ourConversationId?: string;
    ourDeviceId?: number;
    ourACI?: UUIDStringType;
    ourPNI?: UUIDStringType;
    ourNumber?: string;
    regionCode?: string;
    interactionMode?: 'mouse' | 'keyboard';
    theme?: ThemeType;
    isMainWindowMaximized?: boolean;
    isMainWindowFullScreen?: boolean;
    menuOptions?: MenuOptionsType;
  };
};

export type UserActionType = UserChangedActionType;

// Action Creators

export const actions = {
  userChanged,
  manualReconnect,
};

function userChanged(attributes: {
  interactionMode?: 'mouse' | 'keyboard';
  ourConversationId?: string;
  ourDeviceId?: number;
  ourNumber?: string;
  ourACI?: UUIDStringType;
  ourPNI?: UUIDStringType;
  regionCode?: string;
  theme?: ThemeType;
  isMainWindowMaximized?: boolean;
  isMainWindowFullScreen?: boolean;
  menuOptions?: MenuOptionsType;
}): UserChangedActionType {
  return {
    type: 'USER_CHANGED',
    payload: attributes,
  };
}

function manualReconnect(): NoopActionType {
  trigger('manualConnect');

  return {
    type: 'NOOP',
    payload: null,
  };
}

const intlNotSetup = () => {
  throw new Error('i18n not yet set up');
};

// Reducer

export function getEmptyState(): UserStateType {
  let osName: 'windows' | 'macos' | 'linux' | undefined;

  if (OS.isWindows()) {
    osName = 'windows';
  } else if (OS.isMacOS()) {
    osName = 'macos';
  } else if (OS.isLinux()) {
    osName = 'linux';
  }

  return {
    attachmentsPath: 'missing',
    i18n: Object.assign(intlNotSetup, {
      getLocale: intlNotSetup,
      getIntl: intlNotSetup,
      isLegacyFormat: intlNotSetup,
    }),
    interactionMode: 'mouse',
    isMainWindowMaximized: false,
    isMainWindowFullScreen: false,
    localeMessages: {},
    menuOptions: {
      development: false,
      devTools: false,
      includeSetup: false,
      isProduction: true,
      platform: 'unknown',
    },
    osName,
    ourACI: undefined,
    ourConversationId: 'missing',
    ourDeviceId: 0,
    ourNumber: 'missing',
    ourPNI: undefined,
    platform: 'missing',
    regionCode: 'missing',
    stickersPath: 'missing',
    tempPath: 'missing',
    theme: ThemeType.light,
    version: '0.0.0',
  };
}

export function reducer(
  state: Readonly<UserStateType> = getEmptyState(),
  action: Readonly<UserActionType>
): UserStateType {
  if (!state) {
    return getEmptyState();
  }

  if (action.type === 'USER_CHANGED') {
    const { payload } = action;

    return {
      ...state,
      ...payload,
    };
  }

  return state;
}
