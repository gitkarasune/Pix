import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "per month",
    features: ["1 user", "100 PRs per month", "Basic support"],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Team",
    price: "$15",
    period: "per month",
    features: ["Unlimited users", "Unlimited PRs", "Priority support", "Advanced analytics"],
    cta: "Get started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Contact us",
    period: "",
    features: ["Custom pricing", "Dedicated support", "Onboarding assistance", "Security and compliance"],
    cta: "Contact sales",
    popular: false,
  },
]

export default function Pricing() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-xl">
            Choose the plan that&apos;s right for you. All plans come with a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">Most popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className=" ml-2">{plan.period}</span>}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  className={`w-full py-5 ${plan.popular ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
