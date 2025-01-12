import TabHistory from 'background/TabHistory'
import actions from 'libs/actions'
import { createWindow, openInNewTab, openOrTogglePopup, browser } from 'libs'

export const setBrowserIcon = () => {
  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
  let iconPathPrefix = 'icon-128'
  if (darkThemeMq.matches) {
    iconPathPrefix += '-dark'
  }
  browser.browserAction.setIcon({
    path: `${iconPathPrefix}.png`,
  })
}

export class Background {
  tabHistory: TabHistory
  actionMap: {
    [key: string]: () => void
  }

  constructor() {
    browser.omnibox.setDefaultSuggestion({
      description: 'Open tab manager window',
    })
    browser.omnibox.onInputEntered.addListener(() => {
      openOrTogglePopup()
    })
    this.tabHistory = new TabHistory(this)
    browser.runtime.onMessage.addListener(this.onMessage)
    browser.commands.onCommand.addListener(this.onCommand)
    this.actionMap = {
      [actions.togglePopup]: openOrTogglePopup,
      [actions.openInNewTab]: openInNewTab,
      [actions.createWindow]: this.createWindow,
    }
    Object.assign(this.actionMap, this.tabHistory.actionMap)
    // this.browserAction()
    setBrowserIcon()
  }

  browserAction = () => {
    browser.browserAction.onClicked.addListener(openOrTogglePopup)
  }

  createWindow = async (request, sender, sendResponse) => {
    createWindow(request.tabs)
    sendResponse()
  }

  onCommand = (action) => {
    const func = this.actionMap[action]
    if (func && typeof func === 'function') {
      func()
    }
  }

  onMessage = (request, sender, sendResponse) => {
    const { action } = request
    const func = this.actionMap[action]
    if (func && typeof func === 'function') {
      func(request, sender, sendResponse)
    } else {
      sendResponse(`Unknown action: ${action}`)
    }
  }
}

;(() => new Background())()
