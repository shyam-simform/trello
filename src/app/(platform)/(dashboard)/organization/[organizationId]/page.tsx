import { OrganizationSwitcher } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

const OrganizationIdPage = () => {
  const { userId, orgId } = auth();
  return (
    <div>
      <OrganizationSwitcher hidePersonal/>
    </div>
  );
};

export default OrganizationIdPage;
