import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/shared/Card";
import { Button } from "../components/shared/Button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      <Card className="max-w-sm w-full text-center space-y-6">
        <div>
          <p className="text-6xl mb-4">404</p>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Page not found
          </h1>
          <p className="text-text-secondary">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <Link to="/" className="block">
          <Button variant="primary" fullWidth>
            Return to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFound;