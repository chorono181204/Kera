import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const REMINDER_OPTIONS = [
  { value: 'none', label: 'No reminder' },
  { value: '1d', label: '1 day before' },
  { value: '1h', label: '1 hour before' },
  { value: '10m', label: '10 minutes before' }
];

// CSS để ẩn icon đồng hồ mặc định của input type=time
const hideNativeTimeIcon = `
  input[type="time"]::-webkit-calendar-picker-indicator {
    opacity: 0;
    display: none;
  }
  input[type="time"]::-webkit-input-placeholder { color: #fff; }
`;

const DateTimeModal = ({
  open,
  onClose,
  onSave,
  initialStartDate = '',
  initialDueDate = '',
  initialStartTime = '',
  initialDueTime = '',
  initialReminder = 'none',
}) => {
  const theme = useTheme();
  const bgColor = theme.palette.mode === 'dark' ? '#1A2027' : '#fff';
  const textColor = theme.palette.mode === 'dark' ? '#fff' : '#172b4d';
  const inputBg = theme.palette.mode === 'dark' ? '#23272f' : '#fff';
  const inputBorder = theme.palette.mode === 'dark' ? '#3a3f4b' : 'rgba(0,0,0,0.23)';

  const [enableStart, setEnableStart] = useState(!!initialStartDate);
  const [enableDue, setEnableDue] = useState(true);
  const [startDate, setStartDate] = useState(initialStartDate ? new Date(initialStartDate) : null);
  const [dueDate, setDueDate] = useState(initialDueDate ? new Date(initialDueDate) : null);
  const [startTime, setStartTime] = useState(initialStartTime ? new Date(`1970-01-01T${initialStartTime}`) : null);
  const [dueTime, setDueTime] = useState(initialDueTime ? new Date(`1970-01-01T${initialDueTime}`) : null);
  const [reminder, setReminder] = useState(initialReminder);

  if (!open) return null;

  const handleSave = () => {
    onSave && onSave({
      startDate: enableStart && startDate ? startDate.toISOString().slice(0, 10) : '',
      startTime: enableStart && startTime ? startTime.toTimeString().slice(0, 5) : '',
      dueDate: enableDue && dueDate ? dueDate.toISOString().slice(0, 10) : '',
      dueTime: enableDue && dueTime ? dueTime.toTimeString().slice(0, 5) : '',
      reminder
    });
    onClose && onClose();
  };

  return (
    <>
      <style>{hideNativeTimeIcon}</style>
      <div
        style={{
          width: 420,
          background: bgColor,
          color: textColor,
          borderRadius: 14,
          boxShadow: '0 12px 32px rgba(0,0,0,0.22)',
          padding: 0,
          zIndex: 1400,
          border: 'none',
          position: 'relative',
          transition: 'background 0.2s, color 0.2s'
        }}
      >
        <div style={{
          padding: "18px 24px 10px 24px",
          fontWeight: 600,
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: textColor
        }}>
          Date
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "#888"
            }}
          >×</button>
        </div>
        <div style={{ padding: "0 24px 24px 24px", color: textColor }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={2}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={enableStart}
                      onChange={e => setEnableStart(e.target.checked)}
                    />
                  }
                  label={<span style={{ color: textColor }}>Start date</span>}
                />
                <DatePicker
                  disabled={!enableStart}
                  value={startDate}
                  onChange={setStartDate}
                  format="MM/dd/yyyy"
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: {
                        minWidth: 150,
                        color: textColor,
                        background: inputBg,
                        borderRadius: 1.5,
                        '& .MuiOutlinedInput-root': {
                          background: inputBg,
                          color: textColor,
                          '& fieldset': { borderColor: inputBorder },
                          '&:hover fieldset': { borderColor: inputBorder },
                          '&.Mui-focused fieldset': { borderColor: inputBorder }
                        },
                        '& input': { color: textColor }
                      }
                    }
                  }}
                />
                <TimePicker
                  ampm={false}
                  disabled={!enableStart}
                  value={startTime}
                  onChange={setStartTime}
                  slotProps={{
                    textField: {
                      size: 'small',
                      label: 'Time',
                      sx: {
                        minWidth: 110,
                        color: textColor,
                        background: inputBg,
                        borderRadius: 1.5,
                        '& .MuiOutlinedInput-root': {
                          background: inputBg,
                          color: textColor,
                          '& fieldset': { borderColor: inputBorder },
                          '&:hover fieldset': { borderColor: inputBorder },
                          '&.Mui-focused fieldset': { borderColor: inputBorder }
                        },
                        '& input': { color: textColor }
                      },
                      InputLabelProps: { shrink: true, style: { color: textColor } }
                    }
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={enableDue}
                      onChange={e => setEnableDue(e.target.checked)}
                    />
                  }
                  label={<span style={{ color: textColor }}>Due date</span>}
                />
                <DatePicker
                  disabled={!enableDue}
                  value={dueDate}
                  onChange={setDueDate}
                  format="MM/dd/yyyy"
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: {
                        minWidth: 150,
                        color: textColor,
                        background: inputBg,
                        borderRadius: 1.5,
                        '& .MuiOutlinedInput-root': {
                          background: inputBg,
                          color: textColor,
                          '& fieldset': { borderColor: inputBorder },
                          '&:hover fieldset': { borderColor: inputBorder },
                          '&.Mui-focused fieldset': { borderColor: inputBorder }
                        },
                        '& input': { color: textColor }
                      }
                    }
                  }}
                />
                <TimePicker
                  ampm={false}
                  disabled={!enableDue}
                  value={dueTime}
                  onChange={setDueTime}
                  slotProps={{
                    textField: {
                      size: 'small',
                      label: 'Time',
                      sx: {
                        minWidth: 110,
                        color: textColor,
                        background: inputBg,
                        borderRadius: 1.5,
                        '& .MuiOutlinedInput-root': {
                          background: inputBg,
                          color: textColor,
                          '& fieldset': { borderColor: inputBorder },
                          '&:hover fieldset': { borderColor: inputBorder },
                          '&.Mui-focused fieldset': { borderColor: inputBorder }
                        },
                        '& input': { color: textColor }
                      },
                      InputLabelProps: { shrink: true, style: { color: textColor } }
                    }
                  }}
                />
              </div>
              <TextField
                select
                label="Reminder"
                value={reminder}
                onChange={e => setReminder(e.target.value)}
                fullWidth
                size="small"
                sx={{ color: textColor, background: inputBg, borderRadius: 1.5,
                  '& .MuiOutlinedInput-root': {
                    background: inputBg,
                    color: textColor,
                    '& fieldset': { borderColor: inputBorder },
                    '&:hover fieldset': { borderColor: inputBorder },
                    '&.Mui-focused fieldset': { borderColor: inputBorder }
                  },
                  '& input': { color: textColor }
                }}
                InputLabelProps={{ style: { color: textColor } }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: { background: inputBg, color: textColor }
                    }
                  }
                }}
              >
                {REMINDER_OPTIONS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value} style={{ color: textColor, background: inputBg }}>{opt.label}</MenuItem>
                ))}
              </TextField>
              <div style={{ color: theme.palette.mode === 'dark' ? '#bfc2cf' : '#6b778c', fontSize: 13 }}>
                Reminder will be sent to all members and watchers of this card.
              </div>
              <button
                style={{
                  width: "100%",
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 0",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  marginTop: 8
                }}
                disabled={enableDue && !dueDate}
                onClick={handleSave}
              >
                Save
              </button>
            </Stack>
          </LocalizationProvider>
        </div>
      </div>
    </>
  );
};

export default DateTimeModal;
