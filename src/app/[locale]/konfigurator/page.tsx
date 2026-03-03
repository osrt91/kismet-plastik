import dynamic from "next/dynamic";

const ConfiguratorClient = dynamic(
  () => import("@/components/features/Configurator/ConfiguratorClient"),
  { ssr: false }
);

export default function KonfiguratorPage() {
  return <ConfiguratorClient />;
}
