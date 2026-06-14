import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useForm, Controller } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

import {

  Box,

  Typography,

  TextField,

  Button,

  Alert,

  Grid,

  InputAdornment,

  IconButton,

  MenuItem,

  FormControl,

  InputLabel,

  Select,

  FormHelperText,

  CircularProgress,

  Stack,

  Skeleton,

} from '@mui/material';

import LockIcon from '@mui/icons-material/Lock';

import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';

import Visibility from '@mui/icons-material/Visibility';

import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { motion } from 'framer-motion';

import { api, getUploadUrl } from '../../api/client';
import { downloadIdCard } from '../../utils/downloadIdCard';

import { useAuthStore } from '../../store/authStore';

import { colors } from '../../theme/theme';

import PageHeader from '../../components/student/PageHeader';

import ProfileHeroBanner from '../../components/student/ProfileHeroBanner';

import ChangePhotoDialog from '../../components/student/ChangePhotoDialog';

import { ProfileSectionCard, ProfileInfoRow, ProfileFormDivider } from '../../components/student/ProfileSection';

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



const passwordSchema = z

  .object({

    currentPassword: z.string().min(1),

    newPassword: z.string().min(6),

    confirmPassword: z.string().min(6),

  })

  .refine((d) => d.newPassword === d.confirmPassword, {

    message: 'Passwords must match',

    path: ['confirmPassword'],

  });



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



function ProfileSkeleton() {

  return (

    <Box>

      <Skeleton variant="rounded" height={220} sx={{ mb: 3, borderRadius: 3 }} />

      <Grid container spacing={3}>

        <Grid item xs={12} lg={8}>

          <Skeleton variant="rounded" height={520} sx={{ borderRadius: 3 }} />

        </Grid>

        <Grid item xs={12} lg={4}>

          <Stack spacing={3}>

            <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />

            <Skeleton variant="rounded" height={240} sx={{ borderRadius: 3 }} />

          </Stack>

        </Grid>

      </Grid>

    </Box>

  );

}



export default function ProfilePage() {

  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [idCardLoading, setIdCardLoading] = useState(false);

  const [show, setShow] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const { updateProfile, logout } = useAuthStore();

  const navigate = useNavigate();

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

      return api.put('/students/profile', fd);

    },

    onSuccess: (res) => {

      updateProfile(res.data.data);

      qc.invalidateQueries({ queryKey: ['student-profile'] });

      setSuccessMsg(res.data.message || 'Profile updated successfully');

      setErrorMsg('');

    },

    onError: (err) => {

      setErrorMsg(err.response?.data?.message || 'Failed to update profile');

      setSuccessMsg('');

    },

  });



  const passwordMutation = useMutation({

    mutationFn: (values) =>

      api.put('/auth/change-password', {

        currentPassword: values.currentPassword,

        newPassword: values.newPassword,

      }),

    onSuccess: () => {

      passwordForm.reset();

      logout();

      navigate('/login');

    },

  });



  const photoMutation = useMutation({

    mutationFn: async (file) => {

      const fd = new FormData();

      fd.append('photo', file);

      return api.put('/students/profile', fd);

    },

    onSuccess: (res) => {

      updateProfile(res.data.data);

      qc.invalidateQueries({ queryKey: ['student-profile'] });

      setSuccessMsg(res.data.message || 'Profile photo updated successfully');

      setErrorMsg('');

      setPhotoDialogOpen(false);

    },

    onError: (err) => {

      setErrorMsg(err.response?.data?.message || 'Failed to upload photo');

      setSuccessMsg('');

    },

  });



  if (isLoading) {

    return (

      <Box>

        <PageHeader title="My Profile" subtitle="Manage your personal information and account security." />

        <ProfileSkeleton />

      </Box>

    );

  }



  return (

    <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

      <PageHeader

        title="My Profile"

        subtitle="Manage your personal information and account security."

      />



      {successMsg && (

        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccessMsg('')}>

          {successMsg}

        </Alert>

      )}

      {errorMsg && (

        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setErrorMsg('')}>

          {errorMsg}

        </Alert>

      )}



      <ProfileHeroBanner
        profile={profile}
        onChangePhoto={() => setPhotoDialogOpen(true)}
        idCardLoading={idCardLoading}
        onDownloadIdCard={async () => {
          try {
            setIdCardLoading(true);
            await downloadIdCard(api, { fallbackName: `KSA-ID-${profile?.studentId || 'card'}` });
          } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to download ID card');
            setSuccessMsg('');
          } finally {
            setIdCardLoading(false);
          }
        }}
      />



      <Grid container spacing={3} alignItems="flex-start">

        <Grid item xs={12} lg={8}>

          <ProfileSectionCard

            title="Personal Details"

            subtitle="Fields you can update anytime."

            icon={<PersonOutlineIcon fontSize="small" color="primary" />}

          >

            <Box component="form" onSubmit={form.handleSubmit((v) => updateMutation.mutate(v))}>

              <Grid container spacing={2.5}>

                <ProfileFormDivider label="Basic Information" />

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



                <ProfileFormDivider label="Contact Information" />

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

                  <TextField fullWidth label="Emergency Contact" {...form.register('emergencyContact')} />

                </Grid>

                <Grid item xs={12}>

                  <TextField fullWidth label="Address" multiline rows={2} {...form.register('address')} />

                </Grid>



                <ProfileFormDivider label="About You" />

                <Grid item xs={12}>

                  <TextField

                    fullWidth

                    label="Personal Bio"

                    multiline

                    rows={4}

                    placeholder="Share a short introduction about your shooting journey…"

                    {...form.register('personalBio')}

                  />

                </Grid>

              </Grid>



              <Box

                display="flex"

                justifyContent={{ xs: 'stretch', sm: 'flex-end' }}

                mt={3}

                pt={2.5}

                borderTop={`1px solid ${colors.border}`}

              >

                <Button

                  type="submit"

                  variant="contained"

                  color="primary"

                  sx={{ minWidth: { sm: 180 } }}

                  disabled={updateMutation.isPending}

                  startIcon={updateMutation.isPending ? <CircularProgress size={18} color="inherit" /> : null}

                >

                  {updateMutation.isPending ? 'Saving…' : 'Save Profile'}

                </Button>

              </Box>

            </Box>

          </ProfileSectionCard>

        </Grid>



        <Grid item xs={12} lg={4}>

          <Stack spacing={3}>

            <ProfileSectionCard

              title="Academy Records"

              subtitle="Managed by admin — read only."

              icon={<AdminPanelSettingsOutlinedIcon fontSize="small" color="primary" />}

            >

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} lg={12}>
                  <ProfileInfoRow label="Login Email" value={profile?.user?.email} />
                </Grid>
                <Grid item xs={12} sm={6} lg={12}>
                  <ProfileInfoRow label="West Bengal Shooter ID" value={profile?.wbShooterId} />
                </Grid>
                <Grid item xs={12} sm={6} lg={12}>
                  <ProfileInfoRow label="NRAI Shooter ID" value={profile?.nraiShooterId} />
                </Grid>
                <Grid item xs={12} sm={6} lg={12}>
                  <ProfileInfoRow label="Assigned Coach" value={profile?.assignedCoach} />
                </Grid>
                <Grid item xs={12} sm={6} lg={12}>
                  <ProfileInfoRow
                    label="Monthly Fee"
                    value={`${formatCurrency(profile?.effectiveFee)} (${profile?.feeType})`}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={12}>
                  <ProfileInfoRow label="Academy UPI ID" value={profile?.globalUPI} />
                </Grid>
                <Grid item xs={12}>
                  <ProfileInfoRow
                    label="Last Login"
                    value={profile?.user?.lastLogin ? new Date(profile.user.lastLogin).toLocaleString() : '—'}
                  />
                </Grid>
              </Grid>

            </ProfileSectionCard>



            <ProfileSectionCard

              title="Security"

              subtitle="Update your login password."

              icon={<SecurityOutlinedIcon fontSize="small" color="primary" />}

            >

              <Box component="form" onSubmit={passwordForm.handleSubmit((v) => passwordMutation.mutate(v))}>

                <Stack spacing={2}>

                  <TextField

                    fullWidth

                    type={show ? 'text' : 'password'}

                    label="Current Password"

                    {...passwordForm.register('currentPassword')}

                    InputProps={{

                      endAdornment: (

                        <InputAdornment position="end">

                          <IconButton onClick={() => setShow(!show)} edge="end">

                            {show ? <VisibilityOff /> : <Visibility />}

                          </IconButton>

                        </InputAdornment>

                      ),

                    }}

                  />

                  <TextField

                    fullWidth

                    type="password"

                    label="New Password"

                    {...passwordForm.register('newPassword')}

                  />

                  <TextField

                    fullWidth

                    type="password"

                    label="Confirm Password"

                    {...passwordForm.register('confirmPassword')}

                    error={!!passwordForm.formState.errors.confirmPassword}

                    helperText={passwordForm.formState.errors.confirmPassword?.message}

                  />

                  <Button

                    type="submit"

                    variant="contained"

                    color="secondary"

                    fullWidth

                    disabled={passwordMutation.isPending}

                  >

                    {passwordMutation.isPending ? 'Updating…' : 'Update Password'}

                  </Button>

                </Stack>

              </Box>

            </ProfileSectionCard>

          </Stack>

        </Grid>

      </Grid>



      <ChangePhotoDialog

        open={photoDialogOpen}

        onClose={() => setPhotoDialogOpen(false)}

        currentPhotoUrl={getUploadUrl(profile?.photo)}

        onUpload={(file) => photoMutation.mutate(file)}

        uploading={photoMutation.isPending}

      />

    </Box>

  );

}

