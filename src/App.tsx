import { useEffect, useState } from 'react'

import { BehaviorConfigurationPage } from '@/components/behavior-configuration-page'
import { BehaviorConfigurationPageV1 } from '@/components/v1/behavior-configuration-page-v1'

function App() {
  const getInitialTheme = () => {
    if (typeof window === 'undefined') {
      return 'wireframe' as const
    }

    const theme = new URLSearchParams(window.location.search).get('theme')
    return theme === 'hifi' ? ('hifi' as const) : ('wireframe' as const)
  }

  const getInitialVersion = () => {
    if (typeof window === 'undefined') {
      return 'current' as const
    }

    const version = new URLSearchParams(window.location.search).get('version')
    return version === 'v1' ? ('v1' as const) : ('current' as const)
  }

  const [theme, setTheme] = useState<'wireframe' | 'hifi'>(getInitialTheme)
  const [version, setVersion] = useState<'current' | 'v1'>(getInitialVersion)
  const isWireframe = theme === 'wireframe'

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const url = new URL(window.location.href)

    if (theme === 'hifi') {
      url.searchParams.set('theme', 'hifi')
    } else {
      url.searchParams.delete('theme')
    }

    if (version === 'v1') {
      url.searchParams.set('version', 'v1')
    } else {
      url.searchParams.delete('version')
    }

    window.history.replaceState({}, '', url.toString())
  }, [theme, version])

  return (
    <div className={isWireframe ? 'wireframe-theme' : undefined}>
      {version === 'v1' ? <BehaviorConfigurationPageV1 /> : <BehaviorConfigurationPage />}
      <div className="fixed bottom-4 left-4 z-[70] rounded-[10px] border border-[#8f969e] bg-white/95 p-1 shadow-sm">
        <div className="flex items-center gap-2">
          <select
            value={version}
            onChange={(event) => setVersion(event.target.value as 'current' | 'v1')}
            className="h-9 rounded-[8px] border border-[#8f969e] bg-white px-3 text-[12px] font-medium leading-4 text-[#282829] outline-none"
            aria-label="Select prototype version"
          >
            <option value="current">Current</option>
            <option value="v1">Version 1</option>
          </select>

          <button
            type="button"
            onClick={() => setTheme('wireframe')}
            className={
              theme === 'wireframe'
                ? 'rounded-[8px] border border-[#616870] bg-[#f1f2f4] px-3 py-2 text-[12px] font-medium leading-4 text-[#282829]'
                : 'rounded-[8px] border border-transparent bg-transparent px-3 py-2 text-[12px] font-medium leading-4 text-[#676d7a] hover:bg-[#f6f7f9]'
            }
          >
            Wireframe
          </button>
          <button
            type="button"
            onClick={() => setTheme('hifi')}
            className={
              theme === 'hifi'
                ? 'rounded-[8px] border border-[#616870] bg-[#f1f2f4] px-3 py-2 text-[12px] font-medium leading-4 text-[#282829]'
                : 'rounded-[8px] border border-transparent bg-transparent px-3 py-2 text-[12px] font-medium leading-4 text-[#676d7a] hover:bg-[#f6f7f9]'
            }
          >
            Polished
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
