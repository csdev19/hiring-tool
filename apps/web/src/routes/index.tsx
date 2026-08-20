import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, CardContent } from "@interviews-tool/web-ui";
import { useTranslations } from "@interviews-tool/i18n";
import {
  Briefcase,
  Building2,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const features = [
  { key: "applicationTracking", icon: Briefcase },
  { key: "companyDetails", icon: Building2 },
  { key: "interactionHistory", icon: MessageSquare },
  { key: "pipelineManagement", icon: TrendingUp },
  { key: "statusUpdates", icon: CheckCircle2 },
  { key: "centralizedDashboard", icon: Briefcase },
] as const;

function HomePage() {
  const context = Route.useRouteContext();
  const { isAuthenticated } = context;
  const t = useTranslations("landing");

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {t("hero.titleLine1")}
              <span className="block text-primary mt-2">{t("hero.titleLine2")}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("hero.subtitle")}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {isAuthenticated ? (
              <Link to="/hiring-processes">
                <Button size="lg" className="text-lg">
                  {t("hero.goToDashboard")} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/signup">
                  <Button size="lg" className="text-lg">
                    {t("hero.getStarted")} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button size="lg" variant="outline" className="text-lg">
                    {t("hero.signIn")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t("features.heading")}</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ key, icon: Icon }) => (
              <Card key={key}>
                <CardContent className="space-y-4 p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{t(`features.${key}.title`)}</h3>
                  <p className="text-muted-foreground">{t(`features.${key}.description`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="text-center space-y-6 p-12">
            <h2 className="text-3xl font-bold">
              {isAuthenticated ? t("cta.headingAuthenticated") : t("cta.headingGuest")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {isAuthenticated ? t("cta.bodyAuthenticated") : t("cta.bodyGuest")}
            </p>
            <Link to={isAuthenticated ? "/hiring-processes" : "/auth/signup"}>
              <Button size="lg" className="text-lg">
                {isAuthenticated ? t("cta.goToDashboard") : t("cta.createFreeAccount")}{" "}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="text-center text-sm text-muted-foreground">
          <p>{t("footer.tagline")}</p>
        </div>
      </footer>
    </div>
  );
}
