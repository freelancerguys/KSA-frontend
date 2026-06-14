import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Typography,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { colors } from '../../theme/theme';

const MAX_PHOTO_BYTES = 1 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function ChangePhotoDialog({ open, onClose, currentPhotoUrl, onUpload, uploading }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setFile(null);
      setPreview('');
      setError('');
    }
  }, [open]);

  useEffect(() => {
    if (!file) {
      setPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    e.target.value = '';
    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError('Please choose a JPG, PNG, or WEBP image.');
      setFile(null);
      return;
    }

    if (selected.size > MAX_PHOTO_BYTES) {
      setError('Image must be smaller than 1 MB.');
      setFile(null);
      return;
    }

    setError('');
    setFile(selected);
  };

  const handleUpload = () => {
    if (!file) {
      setError('Please select a photo to upload.');
      return;
    }
    onUpload(file);
  };

  return (
    <Dialog open={open} onClose={uploading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Change Profile Photo</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} pt={1}>
          <Avatar
            src={preview || currentPhotoUrl}
            sx={{
              width: 120,
              height: 120,
              border: `3px solid ${colors.primary}`,
            }}
          />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Upload a clear photo of yourself. Maximum file size: 1 MB.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}
          <Button component="label" variant="outlined" startIcon={<PhotoCameraIcon />} disabled={uploading}>
            Choose Image
            <input type="file" hidden accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} />
          </Button>
          {file && (
            <Typography variant="caption" color="text.secondary">
              {file.name} ({(file.size / 1024).toFixed(0)} KB)
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || uploading}
          startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {uploading ? 'Uploading…' : 'Upload Photo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
