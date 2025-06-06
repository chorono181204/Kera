import { useState, useEffect } from 'react'
import { useColorScheme } from '@mui/material/styles'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import EditNoteIcon from '@mui/icons-material/EditNote'

const markdownValueExample = `
# Hello World

This is a test of the markdown editor.
`
/**
 * Vài ví dụ Markdown từ lib
 * https://codesandbox.io/embed/markdown-editor-for-react-izdd6?fontsize=14&hidenavigation=1&theme=dark
 */
function CardDescriptionMdEditor({ cardDescriptionProp, handleUpdateCardDescription }) {
  // Lấy giá trị 'dark', 'light' hoặc 'system' mode từ MUI để support phần Markdown bên dưới: data-color-mode={mode}
  // https://www.npmjs.com/package/@uiw/react-md-editor#support-dark-modenight-mode
  const { mode } = useColorScheme()

  // State xử lý chế độ Edit và chế độ View
  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  // State xử lý giá trị markdown khi chỉnh sửa
  const [cardDescription, setCardDescription] = useState(cardDescriptionProp)

  // Cập nhật state khi prop thay đổi
  useEffect(() => {
    if (!markdownEditMode) {
      setCardDescription(cardDescriptionProp);
    }
  }, [cardDescriptionProp, markdownEditMode]);

  const updateCardDescription = () => {
    setMarkdownEditMode(false)
    handleUpdateCardDescription(cardDescription)
  }

  const handleCancel = () => {
    setCardDescription(cardDescriptionProp);
    setMarkdownEditMode(false);
  }

  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode
        ? <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box data-color-mode={mode}>
            <MDEditor
              value={cardDescription}
              onChange={setCardDescription}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }} // https://www.npmjs.com/package/@uiw/react-md-editor#security
              height={400}
              preview="edit" // Có 3 giá trị để set tùy nhu cầu ['edit', 'live', 'preview']
              // hideToolbar={true}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              onClick={handleCancel}
              type="button"
              variant="text"
              size="small"
              sx={{ color: '#888', minWidth: 64 }}
            >
              Cancel
            </Button>
            <Button
              sx={{ minWidth: 64 }}
              onClick={updateCardDescription}
              className="interceptor-loading"
              type="button"
              variant="contained"
              size="small"
              color="info">
              Save
            </Button>
          </Box>
        </Box>
        : <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => setMarkdownEditMode(true)}
            type="button"
            variant="contained"
            color="info"
            size="small"
            startIcon={<EditNoteIcon />}>
            Edit
          </Button>
          <Box data-color-mode={mode}>
            <MDEditor.Markdown
              source={cardDescriptionProp} // Sử dụng prop trực tiếp thay vì state
              style={{
                whiteSpace: 'pre-wrap',
                padding: cardDescriptionProp ? '10px' : '0px',
                border: cardDescriptionProp ? '0.5px solid rgba(0, 0, 0, 0.2)' : 'none',
                borderRadius: '8px'
              }}
            />
          </Box>
        </Box>
      }
    </Box>
  )
}

export default CardDescriptionMdEditor
