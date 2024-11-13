import { useRouter } from "next/router";
import ViewProject from "@/components/projects/ViewProject";

// Project page component to display a single project based on URL parameter

const Project = () => {
  //useRouter is a Next.js hook that allows you to access routing information, such as the current URL, query parameters, etc.
  const router = useRouter();

  //router.query contains the query parameters in the URL.
  //I am trying to extract params from the query string.
  // If params does not exist, an empty array is used as the default value ([]).
  const { params = [] } = router.query;

  //passing the first element of params as a prop, which is the ID of a project.
  return <ViewProject projectId={params[0]} />;
};

export default Project;
