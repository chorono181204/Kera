import React from 'react'
import { Button, Menu, MenuItem } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
const Templates = () => {
  const [anchorEl, setAnchorEl] = React.useState(null )
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        id="basic-button-templates "
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ filter: 'brightness(100%)' // Độ sáng ban đầu
          , display: 'flex', justifyContent: 'center', alignItems: 'center',color:'text.primary', }}
      >
                Templates
        <KeyboardArrowDownIcon />
      </Button>
      <Menu
        id="basic-menu-templates "
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-templates '
        }}
        sx={{ width: '100%' }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  )
}
export default Templates
