import { Typography } from '@mui/material';
import LegalPageLayout from '../components/LegalPageLayout';
import { privacyPolicySections } from '../content/legalContent';

const EFFECTIVE_DATE = '25 May 2026';

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" effectiveDate={EFFECTIVE_DATE}>
      {privacyPolicySections.map((section) => (
        <div key={section.heading}>
          <Typography component="h6" variant="subtitle1">
            {section.heading}
          </Typography>
          <Typography component="p" variant="body1">
            {section.body}
          </Typography>
        </div>
      ))}
    </LegalPageLayout>
  );
}
