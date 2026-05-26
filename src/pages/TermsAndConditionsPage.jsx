import { Typography } from '@mui/material';
import LegalPageLayout from '../components/LegalPageLayout';
import { termsSections } from '../content/legalContent';

const EFFECTIVE_DATE = '25 May 2026';

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions" effectiveDate={EFFECTIVE_DATE}>
      {termsSections.map((section) => (
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
