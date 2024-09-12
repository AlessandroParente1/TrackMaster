import { useRouter } from "next/router";
import ViewProject from "@/components/projects/ViewProject";

// Project page component to display a single project based on URL parameter

const Project = () => {
  const router = useRouter();
  const { params = [] } = router.query;

  return <ViewProject projectId={params[0]} />;
};

export default Project;
