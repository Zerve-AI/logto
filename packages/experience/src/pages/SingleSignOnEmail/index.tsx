import SecondaryPageLayout from '@/Layout/SecondaryPageLayout';
import SingleSignOnForm from '@/components/SingleSignOnForm';

const SingleSignOnEmail = () => {
  return (
    <SecondaryPageLayout isHeaderCentered title="action.single_sign_on">
      <SingleSignOnForm />
    </SecondaryPageLayout>
  );
};

export default SingleSignOnEmail;
