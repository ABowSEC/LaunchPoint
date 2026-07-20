import SolarSystemView from '../components/SolarSystemView';
import { usePageMeta } from '../hooks/usePageMeta';

export default function SolarSimPage() {
  usePageMeta('/solarsim');
  return <SolarSystemView />;
}
