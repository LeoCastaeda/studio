import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Protección de Datos | GlassNou',
  description: 'Información sobre cómo GlassNou trata y protege tus datos personales conforme al RGPD.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function DataProtectionPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Política de Protección de Datos</h1>
          </div>
          
          <p className="text-muted-foreground text-lg">
            En GlassNou nos tomamos muy en serio la protección de tus datos personales. 
            Esta política explica cómo recopilamos, usamos y protegemos tu información.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Responsable del Tratamiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold mb-2">GlassNou</p>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span>Carrer Maria Barrientos, 23, Local 2, Distrito de Les Corts, 08028 Barcelona</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>+34 686 770 074</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>info@glassnoubarcelona.com</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Datos que Recopilamos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Cuando solicitas una cotización o te pones en contacto con nosotros, podemos recopilar:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Información del vehículo (marca, modelo, año, VIN)</li>
                <li>Cualquier otra información que nos proporciones voluntariamente</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Finalidad del Tratamiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Utilizamos tus datos personales para:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Responder a tus solicitudes de cotización</li>
                <li>Proporcionarte información sobre nuestros servicios</li>
                <li>Gestionar y procesar tus pedidos</li>
                <li>Comunicarnos contigo sobre tu solicitud</li>
                <li>Mejorar nuestros servicios</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Base Legal del Tratamiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>El tratamiento de tus datos se basa en:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Consentimiento:</strong> Al aceptar esta política, nos das tu consentimiento para tratar tus datos</li>
                <li><strong>Ejecución de contrato:</strong> Para proporcionarte los servicios que solicitas</li>
                <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y comunicarnos contigo</li>
                <li><strong>Obligación legal:</strong> Para cumplir con requisitos legales y fiscales</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Conservación de Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Conservaremos tus datos personales durante el tiempo necesario para cumplir con las finalidades 
                para las que fueron recopilados, incluyendo cualquier requisito legal, contable o de información. 
                Una vez que ya no sean necesarios, procederemos a su eliminación segura.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Compartir Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>No vendemos ni alquilamos tus datos personales a terceros. Podemos compartir tu información con:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Proveedores de servicios que nos ayudan a operar nuestro negocio (ej. WhatsApp para comunicación)</li>
                <li>Autoridades legales cuando sea requerido por ley</li>
                <li>Proveedores de cristales para procesar tu pedido</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Tus Derechos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Conforme al RGPD, tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales</li>
                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos</li>
                <li><strong>Limitación:</strong> Restringir el tratamiento de tus datos</li>
                <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
                <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos</li>
                <li><strong>Retirar consentimiento:</strong> En cualquier momento</li>
              </ul>
              <p className="mt-4">
                Para ejercer estos derechos, contáctanos en:{" "}
                <a href="mailto:info@glassnoubarcelona.com" className="text-primary hover:underline">
                  info@glassnoubarcelona.com
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Seguridad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos personales 
                contra acceso no autorizado, pérdida, destrucción o alteración. Sin embargo, ningún método de 
                transmisión por Internet es 100% seguro.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nuestro sitio web puede utilizar cookies para mejorar tu experiencia. Puedes configurar tu 
                navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Cambios en esta Política</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Podemos actualizar esta política de protección de datos ocasionalmente. Te notificaremos 
                cualquier cambio significativo publicando la nueva política en esta página con una fecha 
                de actualización.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Si tienes preguntas sobre esta política de protección de datos o sobre cómo tratamos 
                tu información personal, no dudes en contactarnos:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href="mailto:info@glassnoubarcelona.com" className="text-primary hover:underline">
                    info@glassnoubarcelona.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <a href="tel:+34686770074" className="text-primary hover:underline">
                    +34 686 770 074
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/quote">Solicitar Cotización</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contactar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
