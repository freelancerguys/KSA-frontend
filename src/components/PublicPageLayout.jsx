import FloatingActions from './FloatingActions';

export default function PublicPageLayout({ children }) {
  return (
    <>
      {children}
      <FloatingActions />
    </>
  );
}
