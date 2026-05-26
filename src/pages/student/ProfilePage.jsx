import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box, Card, CardContent, Typography, TextField, Button, Avatar, Alert, Grid,
  InputAdornment, IconButton, Chip, Divider, MenuItem, FormControl, InputLabel, Select,
  FormHelperText, CircularProgress,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';
import { api, getUploadUrl } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../theme/theme';
import PageHeader from '../../components/student/PageHeader';
import GlassCard from '../../components/student/GlassCard';
import { formatCurrency } from '../../utils/currency';
import { GENDER_OPTIONS, BLOOD_GROUP_OPTIONS } from '../../constants/profileOptions';

const profileSchema = z.object({
  phone: z.string().min(10, 'Valid phone number is required'),
  alternatePhone: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  personalBio: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other', '']).optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).optional(),
  parentGuardianName: z
    .string()
    .max(120)
    .optional()
    .refine((v) => !v || v.trim().length >= 2, { message: 'Parent name must be at least 2 characters' }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] });

function LockedField({ label, value }) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value || '—'}
      disabled
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockIcon fontSize="small" color="disabled" />
          </InputAdornment>
        ),
      }}
      sx={{ '& .MuiInputBase-root': { bgcolor: colors.surfaceAlt } }}
    />
  );
}

export default function ProfilePage() {
  const [photo, setPhoto] = useState(null);
  const [show, setShow] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { updateProfile } = useAuthStore();
  const qc = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['student-profile'],
    queryFn: async () => (await api.get('/students/profile')).data.data,
  });

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: '',
      alternatePhone: '',
      address: '',
      emergencyContact: '',
      personalBio: '',
      gender: '',
      bloodGroup: '',
      parentGuardianName: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        phone: profile.phone || '',
        alternatePhone: profile.alternatePhone || '',
        address: profile.address || '',
        emergencyContact: profile.emergencyContact || '',
        personalBio: profile.personalBio || '',
        gender: profile.gender || '',
        bloodGroup: profile.bloodGroup || '',
        parentGuardianName: profile.parentGuardianName || '',
      });
      updateProfile(profile);
    }
  }, [profile]);

  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  const updateMutation = useMutation({
    mutationFn: async (values) => {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append('photo', photo);
      return api.put('/students/profile', fd);
    },
    onSuccess: (res) => {
      updateProfile(res.data.data);
      qc.invalidateQueries(['student-profile']);
      setSuccessMsg(res.data.message || 'Profile updated successfully');
      setErrorMsg('');
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
      setSuccessMsg('');
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (values) => api.put('/auth/change-password', {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    }),
    onSuccess: () => {
      passwordForm.reset();
      setSuccessMsg('Password changed successfully');
      setErrorMsg('');
    },
  });

  if (isLoading) return <Typography>Loading profile...</Typography>;

  return (
    <Box>
      <PageHeader title="My Profile" subtitle="Edit personal details. Fees and shooter IDs are managed by admin." />
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard sx={{ textAlign: 'center', borderTop: `4px solid ${colors.primary}` }}>
              <CardContent>
                <Avatar
                  src={photo ? URL.createObjectURL(photo) : getUploadUrl(profile?.photo)}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: `3px solid ${colors.primary}` }}
                />
                <Typography variant="h6" fontWeight={700}>{profile?.fullName}</Typography>
                <Typography variant="body2" color="text.secondary">{profile?.studentId}</Typography>
                <Chip label={profile?.user?.isActive ? 'Active' : 'Suspended'} color={profile?.user?.isActive ? 'success' : 'error'} size="small" sx={{ mt: 1 }} />
                <Button component="label" variant="outlined" size="small" sx={{ mt: 2 }}>
                  Change Photo
                  <input type="file" hidden accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
                </Button>
              </CardContent>
            </GlassCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={8}>
          <GlassCard sx={{ mb: 3 }}>
            <CardContent>
              <Typography fontWeight={700} mb={2}>Personal Details</Typography>
              <form onSubmit={form.handleSubmit((v) => updateMutation.mutate(v))}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <LockedField label="Full Name" value={profile?.fullName} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="gender"
                      control={form.control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!form.formState.errors.gender}>
                          <InputLabel>Gender</InputLabel>
                          <Select {...field} label="Gender">
                            <MenuItem value="">
                              <em>Select gender</em>
                            </MenuItem>
                            {GENDER_OPTIONS.map((g) => (
                              <MenuItem key={g} value={g}>
                                {g}
                              </MenuItem>
                            ))}
                          </Select>
                          {form.formState.errors.gender && (
                            <FormHelperText>{form.formState.errors.gender.message}</FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="bloodGroup"
                      control={form.control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!form.formState.errors.bloodGroup}>
                          <InputLabel>Blood Group</InputLabel>
                          <Select {...field} label="Blood Group">
                            <MenuItem value="">
                              <em>Select blood group</em>
                            </MenuItem>
                            {BLOOD_GROUP_OPTIONS.map((bg) => (
                              <MenuItem key={bg} value={bg}>
                                {bg}
                              </MenuItem>
                            ))}
                          </Select>
                          {form.formState.errors.bloodGroup && (
                            <FormHelperText>
                              {form.formState.errors.bloodGroup.message || 'Please select blood group'}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Parent / Guardian Name"
                      {...form.register('parentGuardianName')}
                      error={!!form.formState.errors.parentGuardianName}
                      helperText={form.formState.errors.parentGuardianName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      {...form.register('phone')}
                      error={!!form.formState.errors.phone}
                      helperText={form.formState.errors.phone?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Alternate Phone" {...form.register('alternatePhone')} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Address" multiline rows={2} {...form.register('address')} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Emergency Contact" {...form.register('emergencyContact')} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Personal Bio" multiline rows={3} {...form.register('personalBio')} />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, minWidth: 160 }}
                  disabled={updateMutation.isPending}
                  startIcon={updateMutation.isPending ? <CircularProgress size={18} color="inherit" /> : null}
                >
                  {updateMutation.isPending ? 'Saving…' : 'Save Profile'}
                </Button>
              </form>
            </CardContent>
          </GlassCard>

          <GlassCard sx={{ mb: 3, bgcolor: colors.surface }}>
            <CardContent>
              <Typography fontWeight={700} mb={2} display="flex" alignItems="center" gap={1}>
                <LockIcon fontSize="small" /> Admin-Controlled (Read Only)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><LockedField label="Login Email" value={profile?.user?.email} /></Grid>
                <Grid item xs={12} sm={6}><LockedField label="West Bengal Shooter ID" value={profile?.wbShooterId} /></Grid>
                <Grid item xs={12} sm={6}><LockedField label="NRAI Shooter ID" value={profile?.nraiShooterId} /></Grid>
                <Grid item xs={12} sm={6}><LockedField label="Assigned Coach" value={profile?.assignedCoach} /></Grid>
                <Grid item xs={12} sm={6}><LockedField label="Monthly Fee" value={`${formatCurrency(profile?.effectiveFee)} (${profile?.feeType})`} /></Grid>
                <Grid item xs={12} sm={6}><LockedField label="Academy UPI ID" value={profile?.globalUPI} /></Grid>
                <Grid item xs={12} sm={6}><LockedField label="Last Login" value={profile?.user?.lastLogin ? new Date(profile.user.lastLogin).toLocaleString() : '—'} /></Grid>
              </Grid>
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardContent>
              <Typography fontWeight={700} mb={2}>Change Password</Typography>
              <form onSubmit={passwordForm.handleSubmit((v) => passwordMutation.mutate(v))}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField fullWidth type={show ? 'text' : 'password'} label="Current Password" {...passwordForm.register('currentPassword')}
                      InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShow(!show)}>{show ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth type="password" label="New Password" {...passwordForm.register('newPassword')} /></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth type="password" label="Confirm Password" {...passwordForm.register('confirmPassword')} /></Grid>
                </Grid>
                <Button type="submit" variant="contained" color="secondary" sx={{ mt: 2 }}>Update Password</Button>
              </form>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
