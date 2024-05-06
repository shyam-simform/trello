import { OrganizationSwitcher } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

const OrganizationIdPage = () => {
  const { userId, orgId } = auth();
  return (
    <div>
      {/* <OrganizationSwitcher hidePersonal/> */}
      <h1>Organization</h1>
    </div>
  );
};

export default OrganizationIdPage;
