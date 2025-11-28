import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import FormPage from './pages/FormPage';
import SubmissionsPage from './pages/SubmissionsPage';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/form" replace />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/submissions" element={<SubmissionsPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
