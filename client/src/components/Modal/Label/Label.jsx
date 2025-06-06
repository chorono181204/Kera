import React, { useEffect, useState, useRef } from "react";
import { getLabelsAPI, createLabelAPI, updateLabelAPI, deleteLabelAPI } from "../../../apis";
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

// Hàm tự động chọn màu chữ nổi bật trên nền bất kỳ
function getContrastTextColor(bgColor) {
  if (!bgColor) return '#000';
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1) : bgColor;
  const r = parseInt(color.substr(0,2),16);
  const g = parseInt(color.substr(2,2),16);
  const b = parseInt(color.substr(4,2),16);
  const luminance = (0.299*r + 0.587*g + 0.114*b)/255;
  return luminance > 0.5 ? '#000' : '#fff';
}

const LABEL_COLORS = [
  "#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0", "#0079bf",
  "#00c2e0", "#51e898", "#ff78cb", "#344563", "#b3bac5", "#dfe1e6",
  "#f4f5f7", "#e2b203", "#faa53d", "#f87462", "#9f8fef", "#579dff",
  "#60c6d2", "#94c748", "#e774bb", "#8590a2", "#c1c7d0", "#e4e6ea",
  "#f9fafc", "#f7d070", "#f5cd47", "#f87168", "#b3a4f7", "#7f5fff",
  "#1f845a", "#4bce97", "#d3f1a7", "#f9e2e7", "#f5f6f8", "#091e42"
];

const Label = ({ open, anchorEl, modalBoxRef, cardBg, onClose, selectedLabels = [], onChange }) => {
  const theme = useTheme();
  const bgColor = cardBg || theme.palette.background.paper;
  const [labels, setLabels] = useState([]);
  const [checked, setChecked] = useState(selectedLabels);
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLabelTitle, setNewLabelTitle] = useState('');
  const [newLabelColor, setNewLabelColor] = useState(LABEL_COLORS[0]);
  const [editLabel, setEditLabel] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editColor, setEditColor] = useState('');
  const popoverRef = useRef();

  useEffect(() => {
    if (open) getLabelsAPI().then(setLabels);
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target) && open) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  useEffect(() => {
    setChecked(selectedLabels);
  }, [selectedLabels]);

  const handleCheck = (label) => {
    let newChecked;
    if (checked.some(l => l.id === label.id)) {
      newChecked = checked.filter(l => l.id !== label.id);
    } else {
      newChecked = [...checked, label];
    }
    setChecked(newChecked);
    onChange && onChange(newChecked);
  };

  const handleCreateLabel = async () => {
    if (!newLabelTitle.trim() || !newLabelColor) return;
    console.log(newLabelTitle.trim(), newLabelColor);
    const newLabel = await createLabelAPI({ name: newLabelTitle.trim(), color: newLabelColor });

    setLabels(prev => [...prev, newLabel]);
    setShowCreateForm(false);
    setNewLabelTitle('');
    setNewLabelColor(LABEL_COLORS[0]);
  };

  const handleEditClick = (label) => {
    setEditLabel(label);
    setEditTitle(label.name || '');
    setEditColor(label.color);
  };

  const handleUpdateLabel = async () => {
    if (!(editTitle || '').trim() || !editColor) return;
    const updated = await updateLabelAPI(editLabel.id, { name: (editTitle || '').trim(), color: editColor });
    setLabels(labels.map(l => l.id === updated.id ? updated : l));
    setEditLabel(null);
  };

  const handleDeleteLabel = async () => {
    await deleteLabelAPI(editLabel.id);
    setLabels(labels.filter(l => l.id !== editLabel.id));
    setEditLabel(null);
  };

  if (!open || !anchorEl || !modalBoxRef?.current) return null;
  const modalRect = modalBoxRef.current.getBoundingClientRect();
  const rect = anchorEl.getBoundingClientRect();
  const top = rect.bottom - modalRect.top + 4;
  const left = rect.left - modalRect.left;

  // Filter labels by search
  const filteredLabels = labels.filter(label =>
    (label.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      ref={popoverRef}
      style={{
        position: "absolute",
        top,
        left,
        width: 350,
        background: bgColor,
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        padding: 0,
        zIndex: 1300,
        border: 'none'
      }}
    >
      {editLabel ? (
        <>
          <div style={{
            padding: "12px 16px",
            fontWeight: 600,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            Edit label
            <button
              onClick={() => setEditLabel(null)}
              style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "#888" }}
            >×</button>
          </div>
          <div style={{ padding: "16px" }}>
            <div style={{ background: editColor || '#eee', height: 36, borderRadius: 6, marginBottom: 16, transition: 'background 0.2s' }} />
            <TextField
              label="Title"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Choose a color</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 16 }}>
              {LABEL_COLORS.map(color => (
                <div
                  key={color}
                  onClick={() => setEditColor(color)}
                  style={{
                    background: color,
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    border: editColor === color ? "2px solid #1976d2" : "2px solid transparent",
                    cursor: "pointer"
                  }}
                />
              ))}
            </div>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mb: 2,
                background: '#f4f5f7',
                color: '#42526e',
                boxShadow: 'none',
                border: 'none',
                fontWeight: 600,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: 15,
                py: 1.2,
                '&:hover': {
                  background: '#e1e2e6',
                  boxShadow: 'none'
                }
              }}
              onClick={() => setEditColor(null)}
            >
              Remove color
            </Button>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button
                variant="contained"
                color="info"
                fullWidth
                disabled={!(editTitle || '').trim() || !editColor}
                onClick={handleUpdateLabel}
                sx={{ fontWeight: 600 }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleDeleteLabel}
                sx={{ fontWeight: 600 }}
              >
                Delete
              </Button>
            </div>
          </div>
        </>
      ) : showCreateForm ? (
        <>
          <div style={{
            padding: "12px 16px",
            fontWeight: 600,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            Create new label
            <button
              onClick={() => setShowCreateForm(false)}
              style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "#888" }}
            >×</button>
          </div>
          <div style={{ padding: "16px" }}>
            <div style={{ background: newLabelColor || '#eee', height: 36, borderRadius: 6, marginBottom: 16, transition: 'background 0.2s' }} />
            <TextField
              label="Title"
              value={newLabelTitle}
              onChange={e => setNewLabelTitle(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Choose a color</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 16 }}>
              {LABEL_COLORS.map(color => (
                <div
                  key={color}
                  onClick={() => setNewLabelColor(color)}
                  style={{
                    background: color,
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    border: newLabelColor === color ? "2px solid #1976d2" : "2px solid transparent",
                    cursor: "pointer"
                  }}
                />
              ))}
            </div>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mb: 2,
                background: '#f4f5f7',
                color: '#42526e',
                boxShadow: 'none',
                border: 'none',
                fontWeight: 600,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: 15,
                py: 1.2,
                '&:hover': {
                  background: '#e1e2e6',
                  boxShadow: 'none'
                }
              }}
              onClick={() => setNewLabelColor(null)}
            >
              Remove color
            </Button>
            <Button
              variant="contained"
              color="info"
              fullWidth
              disabled={!newLabelTitle.trim() || !newLabelColor}
              onClick={handleCreateLabel}
            >
              Create
            </Button>
          </div>
        </>
      ) : (
        <>
          <div style={{
            padding: "12px 16px",
            fontWeight: 600,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            Labels
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
          <div style={{ padding: "16px" }}>
            <TextField
              id="label-search"
              placeholder="Search labels..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="small"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.primary', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <CloseIcon
                      sx={{ color: 'text.primary', fontSize: 18, cursor: 'pointer' }}
                      onClick={() => setSearch('')}
                    />
                  </InputAdornment>
                )
              }}
              sx={{
                width: '100%',
                mb: 1.5,
                '& input': { color: 'text.primary', fontSize: 15 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: 'rgba(0,0,0,0.2)' }
                }
              }}
            />
            <div>
              {filteredLabels.map(label => (
                <div key={label.id} style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10
                }}>
                  <input
                    type="checkbox"
                    checked={checked.some(l => l.id === label.id)}
                    onChange={() => handleCheck(label)}
                    style={{ marginRight: 10, width: 18, height: 18 }}
                  />
                  <div style={{
                    background: label.color,
                    color: getContrastTextColor(label.color),
                    borderRadius: 6,
                    padding: "8px 18px",
                    minWidth: 80,
                    fontWeight: 500,
                    fontSize: 15,
                    flex: 1,
                    display: "flex",
                    alignItems: "center"
                  }}>
                    {label.name}
                  </div>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      marginLeft: 8,
                      cursor: "pointer",
                      padding: 4,
                      display: "flex",
                      alignItems: "center"
                    }}
                    title="Edit label"
                    onClick={() => handleEditClick(label)}
                  >
                    <EditIcon style={{ fontSize: 18, color: "#555" }} />
                  </button>
                </div>
              ))}
            </div>
            <Button
              variant="contained"
              color="info"
              size="small"
              sx={{
                width: '100%',
                mt: 1.5,
                fontWeight: 600,
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: 14,
                py: 1,
                minHeight: 0
              }}
              onClick={() => setShowCreateForm(true)}
            >
              Create new label
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Label;