
import { ImageResponse } from 'next/og'
import { Logo } from '@/components/app/Logo';

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7F5F2' // Grimoire light theme background
        }}
      >
        <Logo 
          // Hardcode colors for PNG generation as CSS variables are not available
          notebookFill="#FEFBEB"
          notebookStroke="#4C4A48"
          ringsFill="#4C4A48"
          checkStroke="#4C4A48"
          leavesFill="#A3B18A"
          leavesStroke="#4C4A48"
          width={24}
          height={24}
        />
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}
