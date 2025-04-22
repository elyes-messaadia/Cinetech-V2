import LoginForm from '../components/ui/LoginForm';

const LoginPage = () => {
  return (
    <div className="container-custom py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Bienvenue sur Cinetech
        </h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage; 