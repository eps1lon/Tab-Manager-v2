import React, { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { HistoryItem } from 'stores/SearchStore'
import classNames from 'classnames'
import Url from 'components/Tab/Url'
import { useStore } from 'components/hooks/useStore'
import moment from 'moment'
import HighlightNode from 'components/HighlightNode'

type Props = { tab: HistoryItem }

const Content = observer((props: Props) => {
  const { query } = useStore().searchStore
  const { title } = props.tab
  const getHighlightNode = useCallback(
    (text) => {
      if (!query) {
        return text
      }
      return <HighlightNode {...{ query, text }} />
    },
    [query]
  )
  const buttonClassName = classNames(
    'group flex flex-col justify-center flex-1 h-12 overflow-hidden text-left m-0 rounded-sm text-base'
  )
  return (
    <button className={buttonClassName} disabled>
      <div className="w-full overflow-hidden truncate">
        {getHighlightNode(title)}
      </div>
      <Url {...props} {...{ getHighlightNode }} />
    </button>
  )
})

export default observer(function HistoryItemTab(props: Props) {
  const { tab } = props
  const { lastVisitTime, typedCount, visitCount } = props.tab

  return (
    <div tabIndex={-1} className="relative flex items-center w-full pl-4 group">
      <Content tab={tab} />
      <div className="flex-col px-2 text-sm opacity-75 group-hover:opacity-100">
        <div>{moment(lastVisitTime).fromNow()}</div>
        <div className="text-right">
          {typedCount} / {visitCount}
        </div>
      </div>
    </div>
  )
})
