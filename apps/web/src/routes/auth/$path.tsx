import { AuthView } from "@daveyplate/better-auth-ui";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/auth/$path");

const AuthPage = () => {
  const { path } = routeApi.useParams();

  return (
    <main className="container mx-auto my-auto flex flex-col items-center p-4 md:p-6">
      <AuthView path={path} />
    </main>
  );
};

export const Route = createFileRoute("/auth/$path")({
  component: AuthPage,
});
