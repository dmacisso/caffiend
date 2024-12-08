import CoffeeForm from './components/CoffeeForm';
import Hero from './components/Hero';
import Layout from './components/Layout';
import Stats from './components/Stats';
import History from './components/History';
import { useAuth } from './context/AuthContext';
import { coffeeConsumptionHistory } from './utils';

function App() {
  const { globalUser, globalData, isLoading } = useAuth();
  // let globalData = coffeeConsumptionHistory;
  const isAuthenticated = globalUser;
  const isData = globalData && !!Object.keys(globalData || {}).length;
  //* The preceding '!!' type converts any expression that can be a truthey or falsey to be a boolean
  


  const authenticatedContent = (
    <>
      <h1>Authenticated</h1>
      <Stats />
      <History />
    </>
  );

  return (
    <Layout>
      <Hero />
      <CoffeeForm isAuthenticated={isAuthenticated} />
      { isAuthenticated && isLoading && (
        <p>Loading data....</p>
      ) }
      {isAuthenticated && isData && authenticatedContent}
    </Layout>
  );
}

export default App;
