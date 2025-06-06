import React, { useRef, useEffect, useState } from 'react';

const CheckList = ({ open, anchorEl, modalBoxRef, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const popoverRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target) && open) {
        onClose && onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setTitle('');
    }
  }, [open]);

  if (!open || !anchorEl || !modalBoxRef?.current) return null;
  const modalRect = modalBoxRef.current.getBoundingClientRect();
  const rect = anchorEl.getBoundingClientRect();
  const top = rect.bottom - modalRect.top + 4;
  const left = rect.left - modalRect.left;

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top,
        left,
        width: 350,
        background: '#fff',
        borderRadius: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        padding: 0,
        zIndex: 1300,
        border: 'none',
      }}
    >
      <div style={{
        padding: "12px 16px",
        fontWeight: 600,
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        Add checklist
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
        <input
          autoFocus
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #d9d9d9",
            marginBottom: 12,
            fontSize: 15,
            outline: "none"
          }}
        />
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
            cursor: "pointer"
          }}
          disabled={!title.trim()}
          onClick={() => {
            if (title.trim()) {
              onAdd && onAdd({ title: title.trim() });
              setTitle('');
              onClose && onClose();
            }
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CheckList;
