import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard"]);
export default clerkMiddleware((auth, req) => {
  
  console.log(auth().orgId, "org id");
  if (auth().userId && req.nextUrl.pathname === "/") {
    let path = "/select-org";

    if (auth().orgId) {
      path = `organization/${auth().orgId}`;
    }

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }

  if (!auth().userId && isProtectedRoute(req)) {
    auth().protect()
  }

  // if (
  //   auth().userId &&
  //   !auth().orgId &&
  //   req.nextUrl.pathname !== "/select-org"
  // ) {
  //   const orgSelection = new URL("/select-org", req.url);
  //   return NextResponse.redirect(orgSelection);
  // }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
