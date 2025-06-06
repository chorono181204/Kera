import { useColorScheme } from '@mui/material/styles'
import { Button } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light')
      }}
      sx={{  border: '1px solid',color:'text.primary',}}
    >
      {mode === 'light' ? <DarkModeIcon/> : <LightModeIcon/>}
    </Button>
  )
}
export default ModeToggle
