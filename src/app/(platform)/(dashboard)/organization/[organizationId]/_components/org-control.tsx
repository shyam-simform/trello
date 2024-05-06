"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const OrgControl = () => {
    console.log("inside the orgControl")
  const params = useParams();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    console.log("inside useEffect")
    if (!setActive) return;

    setActive({
      organization: params.organizationId as string,
    });
  }, [setActive, params.organizationId]);
  return null;
};

export default OrgControl;
