import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination,
  IconButton, Tooltip, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { getUsersAPI } from '../../apis';

const defaultUser = { email: '', username: '', displayName: '', role: 'USER' };

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(defaultUser);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoadingData(true);
        const data = await getUsersAPI();
        setUsers(data || []);
      } catch (err) {
        setError('Failed to fetch users data');
        console.error('Error fetching users:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUsers();
  }, []);

  // Pagination
  const pagedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Open dialog for create or edit
  const handleOpenDialog = (user = null) => {
    setEditingUser(user);
    setForm(user ? { ...user } : defaultUser);
    setError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setForm(defaultUser);
    setError('');
  };

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate form
  const validateForm = () => {
    if (!form.email || !form.username || !form.displayName) {
      setError('All fields are required');
      return false;
    }
    if (!form.email.includes('@')) {
      setError('Invalid email format');
      return false;
    }
    return true;
  };

  // Create or update user (dummy)
  const handleSave = () => {
    if (!validateForm()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (editingUser) {
        setUsers(users.map(u => u.id === editingUser.id ? { ...form, id: editingUser.id } : u));
      } else {
        setUsers([{ ...form, id: users.length + 1 }, ...users]);
      }
      setLoading(false);
      handleCloseDialog();
    }, 500);
  };

  // Delete user (dummy)
  const handleDelete = (id) => {
    if (window.confirm('Are you sure to delete this user?')) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setUsers(users.filter(u => u.id !== id));
        setLoading(false);
      }, 500);
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon fontSize="large" color="primary" />
          User Management
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer 
        component={Paper} 
        sx={{ 
          mt: 3,
          boxShadow: 3,
          borderRadius: 2,
          '& .MuiTableHead-root': {
            backgroundColor: 'primary.main',
            '& .MuiTableCell-root': {
              color: 'white',
              fontWeight: 'bold'
            }
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedUsers.map((user) => (
              <TableRow 
                key={user.id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'action.hover' 
                  }
                }}
              >
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.displayName}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: user.role === 'ADMIN' ? 'error.main' : 'success.main',
                      fontWeight: 'bold'
                    }}
                  >
                    {user.role}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenDialog(user)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(user.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={users.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </TableContainer>

      {/* Dialog for create/edit */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField 
            label="Email" 
            name="email" 
            value={form.email} 
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField 
            label="Username" 
            name="username" 
            value={form.username} 
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField 
            label="Display Name" 
            name="displayName" 
            value={form.displayName} 
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={form.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersAdmin; 