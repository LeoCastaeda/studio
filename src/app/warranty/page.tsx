import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function WarrantyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <div className="inline-block bg-primary text-primary-foreground p-4 rounded-full mb-4">
                <ShieldCheck className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-headline font-bold">Warranty Information</h1>
            <p className="mt-2 text-muted-foreground">
                Your peace of mind is our priority. Here’s how we stand behind our products and services.
            </p>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Lifetime Workmanship Guarantee</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                        GlassNou Online guarantees the installation of your new auto glass for as long as you own your vehicle.
                        This warranty covers any issues related to the installation workmanship, including water leaks, wind noise,
                        and loose moldings or seals.
                    </p>
                    <p>
                        Should you experience any of these issues, simply contact us to schedule a no-cost inspection and repair.
                        This guarantee is non-transferable and applies only to the vehicle for which the service was performed.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Manufacturer's Defect Warranty</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                        All glass products we sell are covered by a manufacturer's warranty for a period of one (1) year from the date of installation.
                        This warranty covers defects in the glass, such as distortion, delamination, or other manufacturing flaws.
                    </p>
                    <p>
                        It does not cover damage from external factors, including but not limited to rock chips, cracks from impact, vandalism,
                        or stress cracks resulting from accidents or body flex of the vehicle.
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Warranty Exclusions & Limitations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                        Our warranty does not cover damage or failure resulting from:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Impact, accidents, vandalism, or any form of external damage.</li>
                        <li>Pre-existing rust or damage to the vehicle's frame or body where the glass is installed.</li>
                        <li>Improper maintenance, including the use of harsh chemicals or abrasive materials on the glass.</li>
                        <li>Any modifications or alterations made to the vehicle or glass after our installation.</li>
                    </ul>
                     <p>
                        To make a warranty claim, proof of purchase and service from GlassNou Online is required. We reserve the right to inspect the vehicle
                        and the damage before approving any warranty service.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
