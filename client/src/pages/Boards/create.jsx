import { useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import CancelIcon from '@mui/icons-material/Cancel'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { FIELD_REQUIRED_MESSAGE } from '../../utils/validators'
import FieldErrorAlert from '../../components/Form/FieldErrorAlert'
import AbcIcon from '@mui/icons-material/Abc'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { createNewBoardAPI } from '../../apis'
import Popover from '@mui/material/Popover'

const LABEL_COLORS = [
  "#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0", "#0079bf",
  "#00c2e0", "#51e898", "#ff78cb", "#344563", "#b3bac5", "#dfe1e6",
  "#f4f5f7", "#e2b203", "#faa53d", "#f87462", "#9f8fef", "#579dff",
  "#60c6d2", "#94c748", "#e774bb", "#8590a2", "#c1c7d0", "#e4e6ea",
  "#f9fafc", "#f7d070", "#f5cd47", "#f87168", "#b3a4f7", "#7f5fff",
  "#1f845a", "#4bce97", "#d3f1a7", "#f9e2e7", "#f5f6f8", "#091e42"
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * LABEL_COLORS.length);
  return LABEL_COLORS[randomIndex];
};

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

// BOARD_TYPES tương tự bên model phía Back-end (nếu cần dùng nhiều nơi thì hãy đưa ra file constants, không thì cứ để ở đây)
const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

/**
 * Bản chất của cái component SidebarCreateBoardModal này chúng ta sẽ trả về một cái SidebarItem để hiển thị ở màn Board List cho phù hợp giao diện bên đó, đồng thời nó cũng chứa thêm một cái Modal để xử lý riêng form create board nhé.
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function CreateBoardModal({ open, onClose, afterCreateNewBoard }) {
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      color: getRandomColor()
    }
  })
  const navigate = useNavigate()

  const handleColorClick = (event) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleColorClose = () => {
    setColorAnchorEl(null);
  };

  const submitCreateNewBoard = (data) => {
    const { title, description, type, color } = data
    createNewBoardAPI({ title, description, type, color }).then((createdBoard) => {
      onClose()
      afterCreateNewBoard && afterCreateNewBoard()
      reset()
      if (createdBoard && createdBoard.id) {
        navigate(`/boards/${createdBoard.id}`)
      }
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '20px 30px',
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : 'white')
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer'
          }}
        >
          <CancelIcon color='error' sx={{ '&:hover': { color: 'error.light' } }} onClick={onClose} />
        </Box>
        <Box id='modal-modal-title' sx={{ display: 'flex', alignItems: 'center', gap: 1 }} >
          <LibraryAddIcon />
          <Typography variant='h6' component='h2'>
            {' '}
            Create a new board
          </Typography>
        </Box>
        <Box id='modal-modal-description' sx={{ my: 2 }}>
          <form onSubmit={handleSubmit(submitCreateNewBoard)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label='Title'
                  type='text'
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AbcIcon fontSize='small' />
                      </InputAdornment>
                    )
                  }}
                  {...register('title', {
                    required: FIELD_REQUIRED_MESSAGE,
                    minLength: { value: 3, message: 'Min Length is 3 characters' },
                    maxLength: { value: 50, message: 'Max Length is 50 characters' }
                  })}
                  error={!!errors['title']}
                />
                <FieldErrorAlert errors={errors} fieldName={'title'} />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label='Description'
                  type='text'
                  variant='outlined'
                  multiline
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <DescriptionOutlinedIcon fontSize='small' />
                      </InputAdornment>
                    )
                  }}
                  {...register('description', {
                    required: FIELD_REQUIRED_MESSAGE,
                    minLength: { value: 3, message: 'Min Length is 3 characters' },
                    maxLength: { value: 255, message: 'Max Length is 255 characters' }
                  })}
                  error={!!errors['description']}
                />
                <FieldErrorAlert errors={errors} fieldName={'description'} />
              </Box>

              <Controller
                name='type'
                defaultValue={'public'}
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row onChange={(event, value) => field.onChange(value)} value={field.value}>
                    <FormControlLabel
                      value={'public'}
                      control={<Radio size='small' />}
                      label='Public'
                      labelPlacement='start'
                    />
                    <FormControlLabel
                      value={'private'}
                      control={<Radio size='small' />}
                      label='Private'
                      labelPlacement='start'
                    />
                  </RadioGroup>
                )}
              />

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Board Color</Typography>
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box 
                        onClick={handleColorClick}
                        sx={{ 
                          width: '100%', 
                          height: '40px', 
                          backgroundColor: field.value, 
                          borderRadius: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.8
                          }
                        }} 
                      />
                      <Popover
                        open={Boolean(colorAnchorEl)}
                        anchorEl={colorAnchorEl}
                        onClose={handleColorClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        PaperProps={{
                          sx: {
                            p: 2,
                            width: 300,
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white'
                          }
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Choose a color</Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 1 }}>
                          {LABEL_COLORS.map(color => (
                            <Box
                              key={color}
                              onClick={() => {
                                field.onChange(color);
                                handleColorClose();
                              }}
                              sx={{
                                background: color,
                                width: 32,
                                height: 32,
                                borderRadius: 1,
                                border: field.value === color ? "2px solid #1976d2" : "2px solid transparent",
                                cursor: "pointer",
                                '&:hover': {
                                  opacity: 0.8
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Popover>
                    </Box>
                  )}
                />
              </Box>

              <Box sx={{ alignSelf: 'flex-end' }}>
                <Button className='interceptor-loading' type='submit' variant='contained' color='primary'>
                  Create
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  )
}

export default CreateBoardModal